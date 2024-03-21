import {
  ADD_ROLE_MUTATION,
  FIND_ROLE_BY_NAME_QUERY,
} from "./queries/sso/roles.js";
import {
  ADD_USER_MUTATION,
  FIND_USERS_BY_ROLE_NAME_QUERY,
} from "./queries/sso/users.js";
import { ADD_USER_ROLES_MUTATION } from "./queries/sso/user_roles.js";
import {
  ApolloClient,
  createHttpLink,
  FetchResult,
  InMemoryCache,
  NormalizedCacheObject,
} from "@apollo/client/index.js";
import { chalk } from "../../../../util/chalk.js";
import { getEnv } from "../../config/get-env.js";
import { GraphQLError } from "graphql";
import { isString } from "../../../../util/types.js";
import { Logging } from "../../config/logging.js";
import { setContext } from "@apollo/client/link/context/index.js";

export type IGQL = ApolloClient<NormalizedCacheObject>;
let GQL: IGQL;

/**
 * This function is called to establish that the bare minimum data exists in the
 * database to run the application. This includes the admin user and admin role.
 */
async function initHasuraInstance(GQL: ApolloClient<NormalizedCacheObject>) {
  // Do a quick check to see if there is a user that is an admin
  let findAdmins = await verifyResult(
    GQL.query({
      query: FIND_USERS_BY_ROLE_NAME_QUERY,
      variables: {
        roleName: "admin",
      },
    })
  );

  if (findAdmins) {
    Logging.api.info(
      chalk.greenBrightBold("[Connected]"),
      "Connected to Hasura GraphQL"
    );
    return;
  }

  // Check that the admin role is created
  const findAdminRoles = await verifyResult(
    GQL.query({
      query: FIND_ROLE_BY_NAME_QUERY,
      variables: {
        roleName: "admin",
      },
    })
  );
  let adminRoleId: string | undefined = findAdminRoles?.sso_roles[0]?.id;

  // If no roles, create the default admin role
  if (!findAdminRoles?.sso_roles.length) {
    const createAdminRole = await verifyResult(
      GQL.mutate({
        mutation: ADD_ROLE_MUTATION,
        variables: {
          roleName: "admin",
          description: "Top level access",
        },
      }),
      "[Initialize Error] Could not create admin role in Hasura GraphQL"
    );

    if (createAdminRole && createAdminRole.insert_sso_roles_one?.id) {
      Logging.api.info(
        chalk.greenBrightBold("[Initialize]"),
        "Created admin role in Hasura GraphQL"
      );
      adminRoleId = createAdminRole.insert_sso_roles_one.id;
    }
  }

  // Run a check to ensure the admin user is established
  findAdmins = await verifyResult(
    GQL.query({
      query: FIND_USERS_BY_ROLE_NAME_QUERY,
      variables: {
        roleName: "admin",
      },
    }),
    "[Initialize Error] Could not find admin user in Hasura GraphQL"
  );

  // If no admins, create the default admin user based on Env config if present
  if (!findAdmins?.sso_users.length) {
    // Make sure the environment is provided
    if (
      !process.env.DEFAULT_ADMIN_EMAIL ||
      !process.env.DEFAULT_ADMIN_PASSWORD
    ) {
      Logging.api.error(
        chalk.redBrightBold(
          "[Initialize Error] Could not create admin user in Hasura GraphQL"
        )
      );
      Logging.api.error(
        chalk.redBrightBold(
          "[Initialize Error] ADMIN_EMAIL and ADMIN_PASSWORD must be set for the environment"
        )
      );
      return;
    }

    // Try to create the admin user
    const createAdminUser = await verifyResult(
      GQL.mutate({
        mutation: ADD_USER_MUTATION,
        variables: {
          email: process.env.DEFAULT_ADMIN_EMAIL,
          password: process.env.DEFAULT_ADMIN_PASSWORD,
        },
      }),
      "[Initialize Error] Could not create admin user in Hasura GraphQL"
    );

    if (!createAdminUser?.insert_sso_users_one) {
      Logging.api.error(
        chalk.redBrightBold(
          "[Initialize Error] No admin user established in Hasura"
        )
      );
      return;
    } else {
      Logging.api.info(
        chalk.greenBrightBold("[Initialize]"),
        "Created admin user in Hasura GraphQL"
      );
    }

    // Try to add the admin role to the user
    const addAdminRole = await verifyResult(
      GQL.mutate({
        mutation: ADD_USER_ROLES_MUTATION,
        variables: {
          userRolePairs: [
            {
              user_id: createAdminUser.insert_sso_users_one.id,
              role_id: adminRoleId,
            },
          ],
        },
      }),
      "[Initialize Error] Could not add admin role to admin user in Hasura GraphQL"
    );

    if (!addAdminRole?.insert_sso_user_roles?.returning?.length) {
      Logging.api.error(
        chalk.redBrightBold(
          "[Initialize Error] Could not add admin role to admin user in Hasura GraphQL"
        )
      );
      return;
    } else {
      Logging.api.info(
        chalk.greenBrightBold("[Initialize]"),
        "Added admin role to admin user in Hasura GraphQL"
      );
    }
  } else {
    Logging.api.info(
      chalk.greenBrightBold("[Connected]"),
      "Connected to Hasura GraphQL"
    );
  }
}

/**
 * Simplifies some boilerplate on verifying results that come from a GQL
 * query/mutation
 */
export async function verifyResult<TData>(
  result: Promise<FetchResult<TData>>,
  onError?: ((errors: readonly GraphQLError[]) => Promise<void>) | string
) {
  const check = await result;

  if (check.errors && check.errors.length > 0) {
    if (isString(onError)) {
      Logging.api.error(chalk.redBrightBold(onError));
      Logging.api.error(check.errors);
    } else {
      await onError?.(check.errors);
    }
    return void 0;
  }

  return check.data!;
}

/**
 * Retrieves an apollo client instance that can be used for graphql queries
 * against our hasura instance.
 */
export async function useGQL(): Promise<IGQL> {
  if (GQL) return GQL;

  // Ease up restrictions to make the connection work for the dev environment
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
  const ENV = await getEnv();

  const httpLink = createHttpLink({
    uri: ENV.useApi(ENV.hostConfig.graphql, 1, "").get.path,
  });

  const authLink = setContext((_, { headers }) => {
    return {
      headers: {
        ...headers,
        "x-hasura-admin-secret": process.env.HASURA_GRAPHQL_ADMIN_SECRET,
      },
    };
  });

  Logging.api.info(
    chalk.greenBrightBold("[Connecting]"),
    ENV.useApi(ENV.hostConfig.graphql, 1, "").get.path
  );

  GQL = new ApolloClient({
    link: authLink.concat(httpLink),
    cache: new InMemoryCache(),
  });

  // Initialize any missing data for the hasura instance. This also verifies if
  // the connection is valid.
  await initHasuraInstance(GQL);

  return GQL;
}
