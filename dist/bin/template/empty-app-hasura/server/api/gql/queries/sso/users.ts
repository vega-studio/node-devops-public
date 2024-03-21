import { gql } from "../../index.js";

/**
 * Find a user and their relevant login data fields by email
 */
export const LOGIN_QUERY = gql(`
  query LOGIN_QUERY($email: String) {
    sso_users(
      where: {
        email: {
          _eq: $email
        }
      }
    ) {
      id
      password,
      email,
      name,

      user_roles {
        role {
          name
        }
      }
    }
  }
`);

/**
 * Find a user by their email
 */
export const USER_BY_EMAIL_QUERY = gql(`
  query USER_BY_EMAIL_QUERY($email: String) {
    sso_users(
      where: {
        email: {
          _eq: $email
        }
      }
    ) {
      email,
      name,
    }
  }
`);

/**
 * Find a user by their user id
 */
export const USER_BY_ID = gql(`
  query USER_BY_ID($id: uuid!) {
    sso_users(
      where: {
        id: {
          _eq: $id
        }
      }
    ) {
      id,
      email,
      name,

      user_roles {
        role {
          name
        }
      }
    }
  }
`);

/**
 * This creates a new user entry with the smallest amount of information
 * required to support that user with the default role.
 */
export const ADD_USER_MUTATION = gql(`
  mutation ADD_USER_MUTATION($email: String!, $password: String!) {
    insert_sso_users_one(object: {email: $email, password: $password}) {
      id
    }
  }
`);

/**
 * Finds users with the provided role name.
 */
export const FIND_USERS_BY_ROLE_NAME_QUERY = gql(`
  query FIND_USERS_BY_ROLE_NAME_QUERY($roleName: String) {
    sso_users(where: { user_roles: { role: { name: { _eq: $roleName } } } }) {
      id
      name
      email

      user_roles {
        role {
          name
        }
      }
    }
  }
`);
