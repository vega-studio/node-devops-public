import { gql } from "../../index.js";

/**
 * This assigns a role to a user
 */
export const ADD_USER_ROLES_MUTATION = gql(`
  mutation ADD_USER_ROLES_MUTATION(
    $userRolePairs: [sso_user_roles_insert_input!]!
  ) {
    insert_sso_user_roles(objects: $userRolePairs) {
      returning {
        id
      }
    }
  }
`);
