/* eslint-disable */
import * as types from "./graphql.js";
import { TypedDocumentNode as DocumentNode } from "@graphql-typed-document-node/core";

/**
 * Map of all GraphQL operations in the project.
 *
 * This map has several performance disadvantages:
 * 1. It is not tree-shakeable, so it will include all operations in the project.
 * 2. It is not minifiable, so the string of a GraphQL query will be multiple times inside the bundle.
 * 3. It does not support dead code elimination, so it will add unused operations.
 *
 * Therefore it is highly recommended to use the babel or swc plugin for production.
 */
const documents = {
  "\n  query ROLES_FOR_USER_QUERY($id: uuid!) {\n    sso_users_by_pk(id: $id) {\n      user_roles {\n        role {\n          name\n        }\n      }\n    }\n  }\n":
    types.Roles_For_User_QueryDocument,
  "\n  query DEFAULT_USER_ROLES_QUERY($userTypeName: String!) {\n    sso_user_type(where: {name: {_eq: $userTypeName}}) {\n      user_type_roles {\n        role {\n          id\n          name\n        }\n      }\n    }\n  }\n":
    types.Default_User_Roles_QueryDocument,
  "\n  query FIND_ADMIN_ROLE($roleName: String!) {\n    sso_roles(where: {name: {_eq: $roleName}}) {\n      id\n    }\n  }\n":
    types.Find_Admin_RoleDocument,
  "\n  mutation ADD_ROLE_MUTATION($roleName: String!, $description: String!) {\n    insert_sso_roles_one(object: {name: $roleName, description: $description}) {\n      id\n    }\n  }\n":
    types.Add_Role_MutationDocument,
  "\n  mutation ADD_USER_ROLES_MUTATION(\n    $userRolePairs: [sso_user_roles_insert_input!]!\n  ) {\n    insert_sso_user_roles(objects: $userRolePairs) {\n      returning {\n        id\n      }\n    }\n  }\n":
    types.Add_User_Roles_MutationDocument,
  "\n  query LOGIN_QUERY($email: String) {\n    sso_users(\n      where: {\n        email: {\n          _eq: $email\n        }\n      }\n    ) {\n      id\n      password,\n      email,\n      name,\n\n      user_roles {\n        role {\n          name\n        }\n      }\n    }\n  }\n":
    types.Login_QueryDocument,
  "\n  query USER_BY_EMAIL_QUERY($email: String) {\n    sso_users(\n      where: {\n        email: {\n          _eq: $email\n        }\n      }\n    ) {\n      email,\n      name,\n    }\n  }\n":
    types.User_By_Email_QueryDocument,
  "\n  query USER_BY_ID($id: uuid!) {\n    sso_users(\n      where: {\n        id: {\n          _eq: $id\n        }\n      }\n    ) {\n      id,\n      email,\n      name,\n\n      user_roles {\n        role {\n          name\n        }\n      }\n    }\n  }\n":
    types.User_By_IdDocument,
  "\n  mutation ADD_USER_MUTATION($email: String!, $password: String!) {\n    insert_sso_users_one(object: {email: $email, password: $password}) {\n      id\n    }\n  }\n":
    types.Add_User_MutationDocument,
  "\n  query FIND_USERS_BY_ROLE_NAME_QUERY($roleName: String) {\n    sso_users(where: { user_roles: { role: { name: { _eq: $roleName } } } }) {\n      id\n      name\n      email\n\n      user_roles {\n        role {\n          name\n        }\n      }\n    }\n  }\n":
    types.Find_Users_By_Role_Name_QueryDocument,
};

/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 *
 *
 * @example
 * ```ts
 * const query = gql(`query GetUser($id: ID!) { user(id: $id) { name } }`);
 * ```
 *
 * The query argument is unknown!
 * Please regenerate the types.
 */
export function gql(source: string): unknown;

/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(
  source: "\n  query ROLES_FOR_USER_QUERY($id: uuid!) {\n    sso_users_by_pk(id: $id) {\n      user_roles {\n        role {\n          name\n        }\n      }\n    }\n  }\n"
): (typeof documents)["\n  query ROLES_FOR_USER_QUERY($id: uuid!) {\n    sso_users_by_pk(id: $id) {\n      user_roles {\n        role {\n          name\n        }\n      }\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(
  source: "\n  query DEFAULT_USER_ROLES_QUERY($userTypeName: String!) {\n    sso_user_type(where: {name: {_eq: $userTypeName}}) {\n      user_type_roles {\n        role {\n          id\n          name\n        }\n      }\n    }\n  }\n"
): (typeof documents)["\n  query DEFAULT_USER_ROLES_QUERY($userTypeName: String!) {\n    sso_user_type(where: {name: {_eq: $userTypeName}}) {\n      user_type_roles {\n        role {\n          id\n          name\n        }\n      }\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(
  source: "\n  query FIND_ADMIN_ROLE($roleName: String!) {\n    sso_roles(where: {name: {_eq: $roleName}}) {\n      id\n    }\n  }\n"
): (typeof documents)["\n  query FIND_ADMIN_ROLE($roleName: String!) {\n    sso_roles(where: {name: {_eq: $roleName}}) {\n      id\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(
  source: "\n  mutation ADD_ROLE_MUTATION($roleName: String!, $description: String!) {\n    insert_sso_roles_one(object: {name: $roleName, description: $description}) {\n      id\n    }\n  }\n"
): (typeof documents)["\n  mutation ADD_ROLE_MUTATION($roleName: String!, $description: String!) {\n    insert_sso_roles_one(object: {name: $roleName, description: $description}) {\n      id\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(
  source: "\n  mutation ADD_USER_ROLES_MUTATION(\n    $userRolePairs: [sso_user_roles_insert_input!]!\n  ) {\n    insert_sso_user_roles(objects: $userRolePairs) {\n      returning {\n        id\n      }\n    }\n  }\n"
): (typeof documents)["\n  mutation ADD_USER_ROLES_MUTATION(\n    $userRolePairs: [sso_user_roles_insert_input!]!\n  ) {\n    insert_sso_user_roles(objects: $userRolePairs) {\n      returning {\n        id\n      }\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(
  source: "\n  query LOGIN_QUERY($email: String) {\n    sso_users(\n      where: {\n        email: {\n          _eq: $email\n        }\n      }\n    ) {\n      id\n      password,\n      email,\n      name,\n\n      user_roles {\n        role {\n          name\n        }\n      }\n    }\n  }\n"
): (typeof documents)["\n  query LOGIN_QUERY($email: String) {\n    sso_users(\n      where: {\n        email: {\n          _eq: $email\n        }\n      }\n    ) {\n      id\n      password,\n      email,\n      name,\n\n      user_roles {\n        role {\n          name\n        }\n      }\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(
  source: "\n  query USER_BY_EMAIL_QUERY($email: String) {\n    sso_users(\n      where: {\n        email: {\n          _eq: $email\n        }\n      }\n    ) {\n      email,\n      name,\n    }\n  }\n"
): (typeof documents)["\n  query USER_BY_EMAIL_QUERY($email: String) {\n    sso_users(\n      where: {\n        email: {\n          _eq: $email\n        }\n      }\n    ) {\n      email,\n      name,\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(
  source: "\n  query USER_BY_ID($id: uuid!) {\n    sso_users(\n      where: {\n        id: {\n          _eq: $id\n        }\n      }\n    ) {\n      id,\n      email,\n      name,\n\n      user_roles {\n        role {\n          name\n        }\n      }\n    }\n  }\n"
): (typeof documents)["\n  query USER_BY_ID($id: uuid!) {\n    sso_users(\n      where: {\n        id: {\n          _eq: $id\n        }\n      }\n    ) {\n      id,\n      email,\n      name,\n\n      user_roles {\n        role {\n          name\n        }\n      }\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(
  source: "\n  mutation ADD_USER_MUTATION($email: String!, $password: String!) {\n    insert_sso_users_one(object: {email: $email, password: $password}) {\n      id\n    }\n  }\n"
): (typeof documents)["\n  mutation ADD_USER_MUTATION($email: String!, $password: String!) {\n    insert_sso_users_one(object: {email: $email, password: $password}) {\n      id\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(
  source: "\n  query FIND_USERS_BY_ROLE_NAME_QUERY($roleName: String) {\n    sso_users(where: { user_roles: { role: { name: { _eq: $roleName } } } }) {\n      id\n      name\n      email\n\n      user_roles {\n        role {\n          name\n        }\n      }\n    }\n  }\n"
): (typeof documents)["\n  query FIND_USERS_BY_ROLE_NAME_QUERY($roleName: String) {\n    sso_users(where: { user_roles: { role: { name: { _eq: $roleName } } } }) {\n      id\n      name\n      email\n\n      user_roles {\n        role {\n          name\n        }\n      }\n    }\n  }\n"];

export function gql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> =
  TDocumentNode extends DocumentNode<infer TType, any> ? TType : never;
