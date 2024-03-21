import { gql } from "../../index.js";

/**
 * Query to retrieve the roles for a user.
 */
export const ROLES_FOR_USER_QUERY = gql(`
  query ROLES_FOR_USER_QUERY($id: uuid!) {
    sso_users_by_pk(id: $id) {
      user_roles {
        role {
          name
        }
      }
    }
  }
`);

/**
 * Retrieves the roles that apply to a default created user. This will look at
 * the user_type to find a user_type we should use to determine the configured
 * roles for the newly created user type.
 */
export const DEFAULT_USER_ROLES_QUERY = gql(`
  query DEFAULT_USER_ROLES_QUERY($userTypeName: String!) {
    sso_user_type(where: {name: {_eq: $userTypeName}}) {
      user_type_roles {
        role {
          id
          name
        }
      }
    }
  }
`);

/**
 * Finds a valid role with the provided name
 */
export const FIND_ROLE_BY_NAME_QUERY = gql(`
  query FIND_ADMIN_ROLE($roleName: String!) {
    sso_roles(where: {name: {_eq: $roleName}}) {
      id
    }
  }
`);

/**
 * Creates a new role with the provided name
 */
export const ADD_ROLE_MUTATION = gql(`
  mutation ADD_ROLE_MUTATION($roleName: String!, $description: String!) {
    insert_sso_roles_one(object: {name: $roleName, description: $description}) {
      id
    }
  }
`);
