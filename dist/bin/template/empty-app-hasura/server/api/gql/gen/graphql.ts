/* eslint-disable */
import { TypedDocumentNode as DocumentNode } from "@graphql-typed-document-node/core";
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = {
  [K in keyof T]: T[K];
};
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]?: Maybe<T[SubKey]>;
};
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]: Maybe<T[SubKey]>;
};
export type MakeEmpty<
  T extends { [key: string]: unknown },
  K extends keyof T,
> = { [_ in K]?: never };
export type Incremental<T> =
  | T
  | {
      [P in keyof T]?: P extends " $fragmentName" | "__typename" ? T[P] : never;
    };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string };
  String: { input: string; output: string };
  Boolean: { input: boolean; output: boolean };
  Int: { input: number; output: number };
  Float: { input: number; output: number };
  numeric: { input: any; output: any };
  timestamptz: { input: any; output: any };
  timetz: { input: any; output: any };
  uuid: { input: any; output: any };
};

/** Boolean expression to compare columns of type "Int". All fields are combined with logical 'AND'. */
export type Int_Comparison_Exp = {
  _eq?: InputMaybe<Scalars["Int"]["input"]>;
  _gt?: InputMaybe<Scalars["Int"]["input"]>;
  _gte?: InputMaybe<Scalars["Int"]["input"]>;
  _in?: InputMaybe<Array<Scalars["Int"]["input"]>>;
  _is_null?: InputMaybe<Scalars["Boolean"]["input"]>;
  _lt?: InputMaybe<Scalars["Int"]["input"]>;
  _lte?: InputMaybe<Scalars["Int"]["input"]>;
  _neq?: InputMaybe<Scalars["Int"]["input"]>;
  _nin?: InputMaybe<Array<Scalars["Int"]["input"]>>;
};

/** Boolean expression to compare columns of type "String". All fields are combined with logical 'AND'. */
export type String_Comparison_Exp = {
  _eq?: InputMaybe<Scalars["String"]["input"]>;
  _gt?: InputMaybe<Scalars["String"]["input"]>;
  _gte?: InputMaybe<Scalars["String"]["input"]>;
  /** does the column match the given case-insensitive pattern */
  _ilike?: InputMaybe<Scalars["String"]["input"]>;
  _in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  /** does the column match the given POSIX regular expression, case insensitive */
  _iregex?: InputMaybe<Scalars["String"]["input"]>;
  _is_null?: InputMaybe<Scalars["Boolean"]["input"]>;
  /** does the column match the given pattern */
  _like?: InputMaybe<Scalars["String"]["input"]>;
  _lt?: InputMaybe<Scalars["String"]["input"]>;
  _lte?: InputMaybe<Scalars["String"]["input"]>;
  _neq?: InputMaybe<Scalars["String"]["input"]>;
  /** does the column NOT match the given case-insensitive pattern */
  _nilike?: InputMaybe<Scalars["String"]["input"]>;
  _nin?: InputMaybe<Array<Scalars["String"]["input"]>>;
  /** does the column NOT match the given POSIX regular expression, case insensitive */
  _niregex?: InputMaybe<Scalars["String"]["input"]>;
  /** does the column NOT match the given pattern */
  _nlike?: InputMaybe<Scalars["String"]["input"]>;
  /** does the column NOT match the given POSIX regular expression, case sensitive */
  _nregex?: InputMaybe<Scalars["String"]["input"]>;
  /** does the column NOT match the given SQL regular expression */
  _nsimilar?: InputMaybe<Scalars["String"]["input"]>;
  /** does the column match the given POSIX regular expression, case sensitive */
  _regex?: InputMaybe<Scalars["String"]["input"]>;
  /** does the column match the given SQL regular expression */
  _similar?: InputMaybe<Scalars["String"]["input"]>;
};

/** ordering argument of a cursor */
export enum Cursor_Ordering {
  /** ascending ordering of the cursor */
  Asc = "ASC",
  /** descending ordering of the cursor */
  Desc = "DESC",
}

/** mutation root */
export type Mutation_Root = {
  __typename?: "mutation_root";
  /** delete data from the table: "sso.roles" */
  delete_sso_roles?: Maybe<Sso_Roles_Mutation_Response>;
  /** delete single row from the table: "sso.roles" */
  delete_sso_roles_by_pk?: Maybe<Sso_Roles>;
  /** delete data from the table: "sso.user_roles" */
  delete_sso_user_roles?: Maybe<Sso_User_Roles_Mutation_Response>;
  /** delete single row from the table: "sso.user_roles" */
  delete_sso_user_roles_by_pk?: Maybe<Sso_User_Roles>;
  /** delete data from the table: "sso.user_type" */
  delete_sso_user_type?: Maybe<Sso_User_Type_Mutation_Response>;
  /** delete single row from the table: "sso.user_type" */
  delete_sso_user_type_by_pk?: Maybe<Sso_User_Type>;
  /** delete data from the table: "sso.user_type_roles" */
  delete_sso_user_type_roles?: Maybe<Sso_User_Type_Roles_Mutation_Response>;
  /** delete single row from the table: "sso.user_type_roles" */
  delete_sso_user_type_roles_by_pk?: Maybe<Sso_User_Type_Roles>;
  /** delete data from the table: "sso.users" */
  delete_sso_users?: Maybe<Sso_Users_Mutation_Response>;
  /** delete single row from the table: "sso.users" */
  delete_sso_users_by_pk?: Maybe<Sso_Users>;
  /** delete data from the table: "test" */
  delete_test?: Maybe<Test_Mutation_Response>;
  /** delete single row from the table: "test" */
  delete_test_by_pk?: Maybe<Test>;
  /** insert data into the table: "sso.roles" */
  insert_sso_roles?: Maybe<Sso_Roles_Mutation_Response>;
  /** insert a single row into the table: "sso.roles" */
  insert_sso_roles_one?: Maybe<Sso_Roles>;
  /** insert data into the table: "sso.user_roles" */
  insert_sso_user_roles?: Maybe<Sso_User_Roles_Mutation_Response>;
  /** insert a single row into the table: "sso.user_roles" */
  insert_sso_user_roles_one?: Maybe<Sso_User_Roles>;
  /** insert data into the table: "sso.user_type" */
  insert_sso_user_type?: Maybe<Sso_User_Type_Mutation_Response>;
  /** insert a single row into the table: "sso.user_type" */
  insert_sso_user_type_one?: Maybe<Sso_User_Type>;
  /** insert data into the table: "sso.user_type_roles" */
  insert_sso_user_type_roles?: Maybe<Sso_User_Type_Roles_Mutation_Response>;
  /** insert a single row into the table: "sso.user_type_roles" */
  insert_sso_user_type_roles_one?: Maybe<Sso_User_Type_Roles>;
  /** insert data into the table: "sso.users" */
  insert_sso_users?: Maybe<Sso_Users_Mutation_Response>;
  /** insert a single row into the table: "sso.users" */
  insert_sso_users_one?: Maybe<Sso_Users>;
  /** insert data into the table: "test" */
  insert_test?: Maybe<Test_Mutation_Response>;
  /** insert a single row into the table: "test" */
  insert_test_one?: Maybe<Test>;
  /** update data of the table: "sso.roles" */
  update_sso_roles?: Maybe<Sso_Roles_Mutation_Response>;
  /** update single row of the table: "sso.roles" */
  update_sso_roles_by_pk?: Maybe<Sso_Roles>;
  /** update multiples rows of table: "sso.roles" */
  update_sso_roles_many?: Maybe<Array<Maybe<Sso_Roles_Mutation_Response>>>;
  /** update data of the table: "sso.user_roles" */
  update_sso_user_roles?: Maybe<Sso_User_Roles_Mutation_Response>;
  /** update single row of the table: "sso.user_roles" */
  update_sso_user_roles_by_pk?: Maybe<Sso_User_Roles>;
  /** update multiples rows of table: "sso.user_roles" */
  update_sso_user_roles_many?: Maybe<
    Array<Maybe<Sso_User_Roles_Mutation_Response>>
  >;
  /** update data of the table: "sso.user_type" */
  update_sso_user_type?: Maybe<Sso_User_Type_Mutation_Response>;
  /** update single row of the table: "sso.user_type" */
  update_sso_user_type_by_pk?: Maybe<Sso_User_Type>;
  /** update multiples rows of table: "sso.user_type" */
  update_sso_user_type_many?: Maybe<
    Array<Maybe<Sso_User_Type_Mutation_Response>>
  >;
  /** update data of the table: "sso.user_type_roles" */
  update_sso_user_type_roles?: Maybe<Sso_User_Type_Roles_Mutation_Response>;
  /** update single row of the table: "sso.user_type_roles" */
  update_sso_user_type_roles_by_pk?: Maybe<Sso_User_Type_Roles>;
  /** update multiples rows of table: "sso.user_type_roles" */
  update_sso_user_type_roles_many?: Maybe<
    Array<Maybe<Sso_User_Type_Roles_Mutation_Response>>
  >;
  /** update data of the table: "sso.users" */
  update_sso_users?: Maybe<Sso_Users_Mutation_Response>;
  /** update single row of the table: "sso.users" */
  update_sso_users_by_pk?: Maybe<Sso_Users>;
  /** update multiples rows of table: "sso.users" */
  update_sso_users_many?: Maybe<Array<Maybe<Sso_Users_Mutation_Response>>>;
  /** update data of the table: "test" */
  update_test?: Maybe<Test_Mutation_Response>;
  /** update single row of the table: "test" */
  update_test_by_pk?: Maybe<Test>;
  /** update multiples rows of table: "test" */
  update_test_many?: Maybe<Array<Maybe<Test_Mutation_Response>>>;
};

/** mutation root */
export type Mutation_RootDelete_Sso_RolesArgs = {
  where: Sso_Roles_Bool_Exp;
};

/** mutation root */
export type Mutation_RootDelete_Sso_Roles_By_PkArgs = {
  id: Scalars["uuid"]["input"];
};

/** mutation root */
export type Mutation_RootDelete_Sso_User_RolesArgs = {
  where: Sso_User_Roles_Bool_Exp;
};

/** mutation root */
export type Mutation_RootDelete_Sso_User_Roles_By_PkArgs = {
  id: Scalars["uuid"]["input"];
};

/** mutation root */
export type Mutation_RootDelete_Sso_User_TypeArgs = {
  where: Sso_User_Type_Bool_Exp;
};

/** mutation root */
export type Mutation_RootDelete_Sso_User_Type_By_PkArgs = {
  id: Scalars["uuid"]["input"];
};

/** mutation root */
export type Mutation_RootDelete_Sso_User_Type_RolesArgs = {
  where: Sso_User_Type_Roles_Bool_Exp;
};

/** mutation root */
export type Mutation_RootDelete_Sso_User_Type_Roles_By_PkArgs = {
  id: Scalars["uuid"]["input"];
};

/** mutation root */
export type Mutation_RootDelete_Sso_UsersArgs = {
  where: Sso_Users_Bool_Exp;
};

/** mutation root */
export type Mutation_RootDelete_Sso_Users_By_PkArgs = {
  id: Scalars["uuid"]["input"];
};

/** mutation root */
export type Mutation_RootDelete_TestArgs = {
  where: Test_Bool_Exp;
};

/** mutation root */
export type Mutation_RootDelete_Test_By_PkArgs = {
  id: Scalars["uuid"]["input"];
};

/** mutation root */
export type Mutation_RootInsert_Sso_RolesArgs = {
  objects: Array<Sso_Roles_Insert_Input>;
  on_conflict?: InputMaybe<Sso_Roles_On_Conflict>;
};

/** mutation root */
export type Mutation_RootInsert_Sso_Roles_OneArgs = {
  object: Sso_Roles_Insert_Input;
  on_conflict?: InputMaybe<Sso_Roles_On_Conflict>;
};

/** mutation root */
export type Mutation_RootInsert_Sso_User_RolesArgs = {
  objects: Array<Sso_User_Roles_Insert_Input>;
  on_conflict?: InputMaybe<Sso_User_Roles_On_Conflict>;
};

/** mutation root */
export type Mutation_RootInsert_Sso_User_Roles_OneArgs = {
  object: Sso_User_Roles_Insert_Input;
  on_conflict?: InputMaybe<Sso_User_Roles_On_Conflict>;
};

/** mutation root */
export type Mutation_RootInsert_Sso_User_TypeArgs = {
  objects: Array<Sso_User_Type_Insert_Input>;
  on_conflict?: InputMaybe<Sso_User_Type_On_Conflict>;
};

/** mutation root */
export type Mutation_RootInsert_Sso_User_Type_OneArgs = {
  object: Sso_User_Type_Insert_Input;
  on_conflict?: InputMaybe<Sso_User_Type_On_Conflict>;
};

/** mutation root */
export type Mutation_RootInsert_Sso_User_Type_RolesArgs = {
  objects: Array<Sso_User_Type_Roles_Insert_Input>;
  on_conflict?: InputMaybe<Sso_User_Type_Roles_On_Conflict>;
};

/** mutation root */
export type Mutation_RootInsert_Sso_User_Type_Roles_OneArgs = {
  object: Sso_User_Type_Roles_Insert_Input;
  on_conflict?: InputMaybe<Sso_User_Type_Roles_On_Conflict>;
};

/** mutation root */
export type Mutation_RootInsert_Sso_UsersArgs = {
  objects: Array<Sso_Users_Insert_Input>;
  on_conflict?: InputMaybe<Sso_Users_On_Conflict>;
};

/** mutation root */
export type Mutation_RootInsert_Sso_Users_OneArgs = {
  object: Sso_Users_Insert_Input;
  on_conflict?: InputMaybe<Sso_Users_On_Conflict>;
};

/** mutation root */
export type Mutation_RootInsert_TestArgs = {
  objects: Array<Test_Insert_Input>;
  on_conflict?: InputMaybe<Test_On_Conflict>;
};

/** mutation root */
export type Mutation_RootInsert_Test_OneArgs = {
  object: Test_Insert_Input;
  on_conflict?: InputMaybe<Test_On_Conflict>;
};

/** mutation root */
export type Mutation_RootUpdate_Sso_RolesArgs = {
  _set?: InputMaybe<Sso_Roles_Set_Input>;
  where: Sso_Roles_Bool_Exp;
};

/** mutation root */
export type Mutation_RootUpdate_Sso_Roles_By_PkArgs = {
  _set?: InputMaybe<Sso_Roles_Set_Input>;
  pk_columns: Sso_Roles_Pk_Columns_Input;
};

/** mutation root */
export type Mutation_RootUpdate_Sso_Roles_ManyArgs = {
  updates: Array<Sso_Roles_Updates>;
};

/** mutation root */
export type Mutation_RootUpdate_Sso_User_RolesArgs = {
  _set?: InputMaybe<Sso_User_Roles_Set_Input>;
  where: Sso_User_Roles_Bool_Exp;
};

/** mutation root */
export type Mutation_RootUpdate_Sso_User_Roles_By_PkArgs = {
  _set?: InputMaybe<Sso_User_Roles_Set_Input>;
  pk_columns: Sso_User_Roles_Pk_Columns_Input;
};

/** mutation root */
export type Mutation_RootUpdate_Sso_User_Roles_ManyArgs = {
  updates: Array<Sso_User_Roles_Updates>;
};

/** mutation root */
export type Mutation_RootUpdate_Sso_User_TypeArgs = {
  _set?: InputMaybe<Sso_User_Type_Set_Input>;
  where: Sso_User_Type_Bool_Exp;
};

/** mutation root */
export type Mutation_RootUpdate_Sso_User_Type_By_PkArgs = {
  _set?: InputMaybe<Sso_User_Type_Set_Input>;
  pk_columns: Sso_User_Type_Pk_Columns_Input;
};

/** mutation root */
export type Mutation_RootUpdate_Sso_User_Type_ManyArgs = {
  updates: Array<Sso_User_Type_Updates>;
};

/** mutation root */
export type Mutation_RootUpdate_Sso_User_Type_RolesArgs = {
  _set?: InputMaybe<Sso_User_Type_Roles_Set_Input>;
  where: Sso_User_Type_Roles_Bool_Exp;
};

/** mutation root */
export type Mutation_RootUpdate_Sso_User_Type_Roles_By_PkArgs = {
  _set?: InputMaybe<Sso_User_Type_Roles_Set_Input>;
  pk_columns: Sso_User_Type_Roles_Pk_Columns_Input;
};

/** mutation root */
export type Mutation_RootUpdate_Sso_User_Type_Roles_ManyArgs = {
  updates: Array<Sso_User_Type_Roles_Updates>;
};

/** mutation root */
export type Mutation_RootUpdate_Sso_UsersArgs = {
  _set?: InputMaybe<Sso_Users_Set_Input>;
  where: Sso_Users_Bool_Exp;
};

/** mutation root */
export type Mutation_RootUpdate_Sso_Users_By_PkArgs = {
  _set?: InputMaybe<Sso_Users_Set_Input>;
  pk_columns: Sso_Users_Pk_Columns_Input;
};

/** mutation root */
export type Mutation_RootUpdate_Sso_Users_ManyArgs = {
  updates: Array<Sso_Users_Updates>;
};

/** mutation root */
export type Mutation_RootUpdate_TestArgs = {
  _inc?: InputMaybe<Test_Inc_Input>;
  _set?: InputMaybe<Test_Set_Input>;
  where: Test_Bool_Exp;
};

/** mutation root */
export type Mutation_RootUpdate_Test_By_PkArgs = {
  _inc?: InputMaybe<Test_Inc_Input>;
  _set?: InputMaybe<Test_Set_Input>;
  pk_columns: Test_Pk_Columns_Input;
};

/** mutation root */
export type Mutation_RootUpdate_Test_ManyArgs = {
  updates: Array<Test_Updates>;
};

/** Boolean expression to compare columns of type "numeric". All fields are combined with logical 'AND'. */
export type Numeric_Comparison_Exp = {
  _eq?: InputMaybe<Scalars["numeric"]["input"]>;
  _gt?: InputMaybe<Scalars["numeric"]["input"]>;
  _gte?: InputMaybe<Scalars["numeric"]["input"]>;
  _in?: InputMaybe<Array<Scalars["numeric"]["input"]>>;
  _is_null?: InputMaybe<Scalars["Boolean"]["input"]>;
  _lt?: InputMaybe<Scalars["numeric"]["input"]>;
  _lte?: InputMaybe<Scalars["numeric"]["input"]>;
  _neq?: InputMaybe<Scalars["numeric"]["input"]>;
  _nin?: InputMaybe<Array<Scalars["numeric"]["input"]>>;
};

/** column ordering options */
export enum Order_By {
  /** in ascending order, nulls last */
  Asc = "asc",
  /** in ascending order, nulls first */
  AscNullsFirst = "asc_nulls_first",
  /** in ascending order, nulls last */
  AscNullsLast = "asc_nulls_last",
  /** in descending order, nulls first */
  Desc = "desc",
  /** in descending order, nulls first */
  DescNullsFirst = "desc_nulls_first",
  /** in descending order, nulls last */
  DescNullsLast = "desc_nulls_last",
}

export type Query_Root = {
  __typename?: "query_root";
  /** fetch data from the table: "sso.roles" */
  sso_roles: Array<Sso_Roles>;
  /** fetch aggregated fields from the table: "sso.roles" */
  sso_roles_aggregate: Sso_Roles_Aggregate;
  /** fetch data from the table: "sso.roles" using primary key columns */
  sso_roles_by_pk?: Maybe<Sso_Roles>;
  /** fetch data from the table: "sso.user_roles" */
  sso_user_roles: Array<Sso_User_Roles>;
  /** fetch aggregated fields from the table: "sso.user_roles" */
  sso_user_roles_aggregate: Sso_User_Roles_Aggregate;
  /** fetch data from the table: "sso.user_roles" using primary key columns */
  sso_user_roles_by_pk?: Maybe<Sso_User_Roles>;
  /** fetch data from the table: "sso.user_type" */
  sso_user_type: Array<Sso_User_Type>;
  /** fetch aggregated fields from the table: "sso.user_type" */
  sso_user_type_aggregate: Sso_User_Type_Aggregate;
  /** fetch data from the table: "sso.user_type" using primary key columns */
  sso_user_type_by_pk?: Maybe<Sso_User_Type>;
  /** fetch data from the table: "sso.user_type_roles" */
  sso_user_type_roles: Array<Sso_User_Type_Roles>;
  /** fetch aggregated fields from the table: "sso.user_type_roles" */
  sso_user_type_roles_aggregate: Sso_User_Type_Roles_Aggregate;
  /** fetch data from the table: "sso.user_type_roles" using primary key columns */
  sso_user_type_roles_by_pk?: Maybe<Sso_User_Type_Roles>;
  /** fetch data from the table: "sso.users" */
  sso_users: Array<Sso_Users>;
  /** fetch aggregated fields from the table: "sso.users" */
  sso_users_aggregate: Sso_Users_Aggregate;
  /** fetch data from the table: "sso.users" using primary key columns */
  sso_users_by_pk?: Maybe<Sso_Users>;
  /** fetch data from the table: "test" */
  test: Array<Test>;
  /** fetch aggregated fields from the table: "test" */
  test_aggregate: Test_Aggregate;
  /** fetch data from the table: "test" using primary key columns */
  test_by_pk?: Maybe<Test>;
};

export type Query_RootSso_RolesArgs = {
  distinct_on?: InputMaybe<Array<Sso_Roles_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Sso_Roles_Order_By>>;
  where?: InputMaybe<Sso_Roles_Bool_Exp>;
};

export type Query_RootSso_Roles_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Sso_Roles_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Sso_Roles_Order_By>>;
  where?: InputMaybe<Sso_Roles_Bool_Exp>;
};

export type Query_RootSso_Roles_By_PkArgs = {
  id: Scalars["uuid"]["input"];
};

export type Query_RootSso_User_RolesArgs = {
  distinct_on?: InputMaybe<Array<Sso_User_Roles_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Sso_User_Roles_Order_By>>;
  where?: InputMaybe<Sso_User_Roles_Bool_Exp>;
};

export type Query_RootSso_User_Roles_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Sso_User_Roles_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Sso_User_Roles_Order_By>>;
  where?: InputMaybe<Sso_User_Roles_Bool_Exp>;
};

export type Query_RootSso_User_Roles_By_PkArgs = {
  id: Scalars["uuid"]["input"];
};

export type Query_RootSso_User_TypeArgs = {
  distinct_on?: InputMaybe<Array<Sso_User_Type_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Sso_User_Type_Order_By>>;
  where?: InputMaybe<Sso_User_Type_Bool_Exp>;
};

export type Query_RootSso_User_Type_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Sso_User_Type_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Sso_User_Type_Order_By>>;
  where?: InputMaybe<Sso_User_Type_Bool_Exp>;
};

export type Query_RootSso_User_Type_By_PkArgs = {
  id: Scalars["uuid"]["input"];
};

export type Query_RootSso_User_Type_RolesArgs = {
  distinct_on?: InputMaybe<Array<Sso_User_Type_Roles_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Sso_User_Type_Roles_Order_By>>;
  where?: InputMaybe<Sso_User_Type_Roles_Bool_Exp>;
};

export type Query_RootSso_User_Type_Roles_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Sso_User_Type_Roles_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Sso_User_Type_Roles_Order_By>>;
  where?: InputMaybe<Sso_User_Type_Roles_Bool_Exp>;
};

export type Query_RootSso_User_Type_Roles_By_PkArgs = {
  id: Scalars["uuid"]["input"];
};

export type Query_RootSso_UsersArgs = {
  distinct_on?: InputMaybe<Array<Sso_Users_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Sso_Users_Order_By>>;
  where?: InputMaybe<Sso_Users_Bool_Exp>;
};

export type Query_RootSso_Users_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Sso_Users_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Sso_Users_Order_By>>;
  where?: InputMaybe<Sso_Users_Bool_Exp>;
};

export type Query_RootSso_Users_By_PkArgs = {
  id: Scalars["uuid"]["input"];
};

export type Query_RootTestArgs = {
  distinct_on?: InputMaybe<Array<Test_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Test_Order_By>>;
  where?: InputMaybe<Test_Bool_Exp>;
};

export type Query_RootTest_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Test_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Test_Order_By>>;
  where?: InputMaybe<Test_Bool_Exp>;
};

export type Query_RootTest_By_PkArgs = {
  id: Scalars["uuid"]["input"];
};

/** Available roles that can be given to a user */
export type Sso_Roles = {
  __typename?: "sso_roles";
  created_at: Scalars["timestamptz"]["output"];
  description: Scalars["String"]["output"];
  id: Scalars["uuid"]["output"];
  name: Scalars["String"]["output"];
  updated_at: Scalars["timestamptz"]["output"];
  /** An array relationship */
  user_roles: Array<Sso_User_Roles>;
  /** An aggregate relationship */
  user_roles_aggregate: Sso_User_Roles_Aggregate;
};

/** Available roles that can be given to a user */
export type Sso_RolesUser_RolesArgs = {
  distinct_on?: InputMaybe<Array<Sso_User_Roles_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Sso_User_Roles_Order_By>>;
  where?: InputMaybe<Sso_User_Roles_Bool_Exp>;
};

/** Available roles that can be given to a user */
export type Sso_RolesUser_Roles_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Sso_User_Roles_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Sso_User_Roles_Order_By>>;
  where?: InputMaybe<Sso_User_Roles_Bool_Exp>;
};

/** aggregated selection of "sso.roles" */
export type Sso_Roles_Aggregate = {
  __typename?: "sso_roles_aggregate";
  aggregate?: Maybe<Sso_Roles_Aggregate_Fields>;
  nodes: Array<Sso_Roles>;
};

/** aggregate fields of "sso.roles" */
export type Sso_Roles_Aggregate_Fields = {
  __typename?: "sso_roles_aggregate_fields";
  count: Scalars["Int"]["output"];
  max?: Maybe<Sso_Roles_Max_Fields>;
  min?: Maybe<Sso_Roles_Min_Fields>;
};

/** aggregate fields of "sso.roles" */
export type Sso_Roles_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Sso_Roles_Select_Column>>;
  distinct?: InputMaybe<Scalars["Boolean"]["input"]>;
};

/** Boolean expression to filter rows from the table "sso.roles". All fields are combined with a logical 'AND'. */
export type Sso_Roles_Bool_Exp = {
  _and?: InputMaybe<Array<Sso_Roles_Bool_Exp>>;
  _not?: InputMaybe<Sso_Roles_Bool_Exp>;
  _or?: InputMaybe<Array<Sso_Roles_Bool_Exp>>;
  created_at?: InputMaybe<Timestamptz_Comparison_Exp>;
  description?: InputMaybe<String_Comparison_Exp>;
  id?: InputMaybe<Uuid_Comparison_Exp>;
  name?: InputMaybe<String_Comparison_Exp>;
  updated_at?: InputMaybe<Timestamptz_Comparison_Exp>;
  user_roles?: InputMaybe<Sso_User_Roles_Bool_Exp>;
  user_roles_aggregate?: InputMaybe<Sso_User_Roles_Aggregate_Bool_Exp>;
};

/** unique or primary key constraints on table "sso.roles" */
export enum Sso_Roles_Constraint {
  /** unique or primary key constraint on columns "id" */
  RolesPkey = "roles_pkey",
  /** unique or primary key constraint on columns "name" */
  RolesRoleKey = "roles_role_key",
}

/** input type for inserting data into table "sso.roles" */
export type Sso_Roles_Insert_Input = {
  created_at?: InputMaybe<Scalars["timestamptz"]["input"]>;
  description?: InputMaybe<Scalars["String"]["input"]>;
  id?: InputMaybe<Scalars["uuid"]["input"]>;
  name?: InputMaybe<Scalars["String"]["input"]>;
  updated_at?: InputMaybe<Scalars["timestamptz"]["input"]>;
  user_roles?: InputMaybe<Sso_User_Roles_Arr_Rel_Insert_Input>;
};

/** aggregate max on columns */
export type Sso_Roles_Max_Fields = {
  __typename?: "sso_roles_max_fields";
  created_at?: Maybe<Scalars["timestamptz"]["output"]>;
  description?: Maybe<Scalars["String"]["output"]>;
  id?: Maybe<Scalars["uuid"]["output"]>;
  name?: Maybe<Scalars["String"]["output"]>;
  updated_at?: Maybe<Scalars["timestamptz"]["output"]>;
};

/** aggregate min on columns */
export type Sso_Roles_Min_Fields = {
  __typename?: "sso_roles_min_fields";
  created_at?: Maybe<Scalars["timestamptz"]["output"]>;
  description?: Maybe<Scalars["String"]["output"]>;
  id?: Maybe<Scalars["uuid"]["output"]>;
  name?: Maybe<Scalars["String"]["output"]>;
  updated_at?: Maybe<Scalars["timestamptz"]["output"]>;
};

/** response of any mutation on the table "sso.roles" */
export type Sso_Roles_Mutation_Response = {
  __typename?: "sso_roles_mutation_response";
  /** number of rows affected by the mutation */
  affected_rows: Scalars["Int"]["output"];
  /** data from the rows affected by the mutation */
  returning: Array<Sso_Roles>;
};

/** input type for inserting object relation for remote table "sso.roles" */
export type Sso_Roles_Obj_Rel_Insert_Input = {
  data: Sso_Roles_Insert_Input;
  /** upsert condition */
  on_conflict?: InputMaybe<Sso_Roles_On_Conflict>;
};

/** on_conflict condition type for table "sso.roles" */
export type Sso_Roles_On_Conflict = {
  constraint: Sso_Roles_Constraint;
  update_columns?: Array<Sso_Roles_Update_Column>;
  where?: InputMaybe<Sso_Roles_Bool_Exp>;
};

/** Ordering options when selecting data from "sso.roles". */
export type Sso_Roles_Order_By = {
  created_at?: InputMaybe<Order_By>;
  description?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  name?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
  user_roles_aggregate?: InputMaybe<Sso_User_Roles_Aggregate_Order_By>;
};

/** primary key columns input for table: sso.roles */
export type Sso_Roles_Pk_Columns_Input = {
  id: Scalars["uuid"]["input"];
};

/** select columns of table "sso.roles" */
export enum Sso_Roles_Select_Column {
  /** column name */
  CreatedAt = "created_at",
  /** column name */
  Description = "description",
  /** column name */
  Id = "id",
  /** column name */
  Name = "name",
  /** column name */
  UpdatedAt = "updated_at",
}

/** input type for updating data in table "sso.roles" */
export type Sso_Roles_Set_Input = {
  created_at?: InputMaybe<Scalars["timestamptz"]["input"]>;
  description?: InputMaybe<Scalars["String"]["input"]>;
  id?: InputMaybe<Scalars["uuid"]["input"]>;
  name?: InputMaybe<Scalars["String"]["input"]>;
  updated_at?: InputMaybe<Scalars["timestamptz"]["input"]>;
};

/** Streaming cursor of the table "sso_roles" */
export type Sso_Roles_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Sso_Roles_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Sso_Roles_Stream_Cursor_Value_Input = {
  created_at?: InputMaybe<Scalars["timestamptz"]["input"]>;
  description?: InputMaybe<Scalars["String"]["input"]>;
  id?: InputMaybe<Scalars["uuid"]["input"]>;
  name?: InputMaybe<Scalars["String"]["input"]>;
  updated_at?: InputMaybe<Scalars["timestamptz"]["input"]>;
};

/** update columns of table "sso.roles" */
export enum Sso_Roles_Update_Column {
  /** column name */
  CreatedAt = "created_at",
  /** column name */
  Description = "description",
  /** column name */
  Id = "id",
  /** column name */
  Name = "name",
  /** column name */
  UpdatedAt = "updated_at",
}

export type Sso_Roles_Updates = {
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Sso_Roles_Set_Input>;
  /** filter the rows which have to be updated */
  where: Sso_Roles_Bool_Exp;
};

/** Roles available to a user */
export type Sso_User_Roles = {
  __typename?: "sso_user_roles";
  id: Scalars["uuid"]["output"];
  /** An object relationship */
  role: Sso_Roles;
  role_id: Scalars["uuid"]["output"];
  /** An object relationship */
  user: Sso_Users;
  user_id: Scalars["uuid"]["output"];
};

/** aggregated selection of "sso.user_roles" */
export type Sso_User_Roles_Aggregate = {
  __typename?: "sso_user_roles_aggregate";
  aggregate?: Maybe<Sso_User_Roles_Aggregate_Fields>;
  nodes: Array<Sso_User_Roles>;
};

export type Sso_User_Roles_Aggregate_Bool_Exp = {
  count?: InputMaybe<Sso_User_Roles_Aggregate_Bool_Exp_Count>;
};

export type Sso_User_Roles_Aggregate_Bool_Exp_Count = {
  arguments?: InputMaybe<Array<Sso_User_Roles_Select_Column>>;
  distinct?: InputMaybe<Scalars["Boolean"]["input"]>;
  filter?: InputMaybe<Sso_User_Roles_Bool_Exp>;
  predicate: Int_Comparison_Exp;
};

/** aggregate fields of "sso.user_roles" */
export type Sso_User_Roles_Aggregate_Fields = {
  __typename?: "sso_user_roles_aggregate_fields";
  count: Scalars["Int"]["output"];
  max?: Maybe<Sso_User_Roles_Max_Fields>;
  min?: Maybe<Sso_User_Roles_Min_Fields>;
};

/** aggregate fields of "sso.user_roles" */
export type Sso_User_Roles_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Sso_User_Roles_Select_Column>>;
  distinct?: InputMaybe<Scalars["Boolean"]["input"]>;
};

/** order by aggregate values of table "sso.user_roles" */
export type Sso_User_Roles_Aggregate_Order_By = {
  count?: InputMaybe<Order_By>;
  max?: InputMaybe<Sso_User_Roles_Max_Order_By>;
  min?: InputMaybe<Sso_User_Roles_Min_Order_By>;
};

/** input type for inserting array relation for remote table "sso.user_roles" */
export type Sso_User_Roles_Arr_Rel_Insert_Input = {
  data: Array<Sso_User_Roles_Insert_Input>;
  /** upsert condition */
  on_conflict?: InputMaybe<Sso_User_Roles_On_Conflict>;
};

/** Boolean expression to filter rows from the table "sso.user_roles". All fields are combined with a logical 'AND'. */
export type Sso_User_Roles_Bool_Exp = {
  _and?: InputMaybe<Array<Sso_User_Roles_Bool_Exp>>;
  _not?: InputMaybe<Sso_User_Roles_Bool_Exp>;
  _or?: InputMaybe<Array<Sso_User_Roles_Bool_Exp>>;
  id?: InputMaybe<Uuid_Comparison_Exp>;
  role?: InputMaybe<Sso_Roles_Bool_Exp>;
  role_id?: InputMaybe<Uuid_Comparison_Exp>;
  user?: InputMaybe<Sso_Users_Bool_Exp>;
  user_id?: InputMaybe<Uuid_Comparison_Exp>;
};

/** unique or primary key constraints on table "sso.user_roles" */
export enum Sso_User_Roles_Constraint {
  /** unique or primary key constraint on columns "id" */
  UserRolesPkey = "user_roles_pkey",
}

/** input type for inserting data into table "sso.user_roles" */
export type Sso_User_Roles_Insert_Input = {
  id?: InputMaybe<Scalars["uuid"]["input"]>;
  role?: InputMaybe<Sso_Roles_Obj_Rel_Insert_Input>;
  role_id?: InputMaybe<Scalars["uuid"]["input"]>;
  user?: InputMaybe<Sso_Users_Obj_Rel_Insert_Input>;
  user_id?: InputMaybe<Scalars["uuid"]["input"]>;
};

/** aggregate max on columns */
export type Sso_User_Roles_Max_Fields = {
  __typename?: "sso_user_roles_max_fields";
  id?: Maybe<Scalars["uuid"]["output"]>;
  role_id?: Maybe<Scalars["uuid"]["output"]>;
  user_id?: Maybe<Scalars["uuid"]["output"]>;
};

/** order by max() on columns of table "sso.user_roles" */
export type Sso_User_Roles_Max_Order_By = {
  id?: InputMaybe<Order_By>;
  role_id?: InputMaybe<Order_By>;
  user_id?: InputMaybe<Order_By>;
};

/** aggregate min on columns */
export type Sso_User_Roles_Min_Fields = {
  __typename?: "sso_user_roles_min_fields";
  id?: Maybe<Scalars["uuid"]["output"]>;
  role_id?: Maybe<Scalars["uuid"]["output"]>;
  user_id?: Maybe<Scalars["uuid"]["output"]>;
};

/** order by min() on columns of table "sso.user_roles" */
export type Sso_User_Roles_Min_Order_By = {
  id?: InputMaybe<Order_By>;
  role_id?: InputMaybe<Order_By>;
  user_id?: InputMaybe<Order_By>;
};

/** response of any mutation on the table "sso.user_roles" */
export type Sso_User_Roles_Mutation_Response = {
  __typename?: "sso_user_roles_mutation_response";
  /** number of rows affected by the mutation */
  affected_rows: Scalars["Int"]["output"];
  /** data from the rows affected by the mutation */
  returning: Array<Sso_User_Roles>;
};

/** on_conflict condition type for table "sso.user_roles" */
export type Sso_User_Roles_On_Conflict = {
  constraint: Sso_User_Roles_Constraint;
  update_columns?: Array<Sso_User_Roles_Update_Column>;
  where?: InputMaybe<Sso_User_Roles_Bool_Exp>;
};

/** Ordering options when selecting data from "sso.user_roles". */
export type Sso_User_Roles_Order_By = {
  id?: InputMaybe<Order_By>;
  role?: InputMaybe<Sso_Roles_Order_By>;
  role_id?: InputMaybe<Order_By>;
  user?: InputMaybe<Sso_Users_Order_By>;
  user_id?: InputMaybe<Order_By>;
};

/** primary key columns input for table: sso.user_roles */
export type Sso_User_Roles_Pk_Columns_Input = {
  id: Scalars["uuid"]["input"];
};

/** select columns of table "sso.user_roles" */
export enum Sso_User_Roles_Select_Column {
  /** column name */
  Id = "id",
  /** column name */
  RoleId = "role_id",
  /** column name */
  UserId = "user_id",
}

/** input type for updating data in table "sso.user_roles" */
export type Sso_User_Roles_Set_Input = {
  id?: InputMaybe<Scalars["uuid"]["input"]>;
  role_id?: InputMaybe<Scalars["uuid"]["input"]>;
  user_id?: InputMaybe<Scalars["uuid"]["input"]>;
};

/** Streaming cursor of the table "sso_user_roles" */
export type Sso_User_Roles_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Sso_User_Roles_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Sso_User_Roles_Stream_Cursor_Value_Input = {
  id?: InputMaybe<Scalars["uuid"]["input"]>;
  role_id?: InputMaybe<Scalars["uuid"]["input"]>;
  user_id?: InputMaybe<Scalars["uuid"]["input"]>;
};

/** update columns of table "sso.user_roles" */
export enum Sso_User_Roles_Update_Column {
  /** column name */
  Id = "id",
  /** column name */
  RoleId = "role_id",
  /** column name */
  UserId = "user_id",
}

export type Sso_User_Roles_Updates = {
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Sso_User_Roles_Set_Input>;
  /** filter the rows which have to be updated */
  where: Sso_User_Roles_Bool_Exp;
};

/** This helps define a type of user. This is used to help assign initial roles to a newly created user type. This does NOT control roles a user has. A user can be generated as an initial user type, but as time progresses can be given any number of different roles. */
export type Sso_User_Type = {
  __typename?: "sso_user_type";
  created_at: Scalars["timestamptz"]["output"];
  id: Scalars["uuid"]["output"];
  name: Scalars["String"]["output"];
  updated_at: Scalars["timestamptz"]["output"];
  /** An array relationship */
  user_type_roles: Array<Sso_User_Type_Roles>;
  /** An aggregate relationship */
  user_type_roles_aggregate: Sso_User_Type_Roles_Aggregate;
};

/** This helps define a type of user. This is used to help assign initial roles to a newly created user type. This does NOT control roles a user has. A user can be generated as an initial user type, but as time progresses can be given any number of different roles. */
export type Sso_User_TypeUser_Type_RolesArgs = {
  distinct_on?: InputMaybe<Array<Sso_User_Type_Roles_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Sso_User_Type_Roles_Order_By>>;
  where?: InputMaybe<Sso_User_Type_Roles_Bool_Exp>;
};

/** This helps define a type of user. This is used to help assign initial roles to a newly created user type. This does NOT control roles a user has. A user can be generated as an initial user type, but as time progresses can be given any number of different roles. */
export type Sso_User_TypeUser_Type_Roles_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Sso_User_Type_Roles_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Sso_User_Type_Roles_Order_By>>;
  where?: InputMaybe<Sso_User_Type_Roles_Bool_Exp>;
};

/** aggregated selection of "sso.user_type" */
export type Sso_User_Type_Aggregate = {
  __typename?: "sso_user_type_aggregate";
  aggregate?: Maybe<Sso_User_Type_Aggregate_Fields>;
  nodes: Array<Sso_User_Type>;
};

/** aggregate fields of "sso.user_type" */
export type Sso_User_Type_Aggregate_Fields = {
  __typename?: "sso_user_type_aggregate_fields";
  count: Scalars["Int"]["output"];
  max?: Maybe<Sso_User_Type_Max_Fields>;
  min?: Maybe<Sso_User_Type_Min_Fields>;
};

/** aggregate fields of "sso.user_type" */
export type Sso_User_Type_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Sso_User_Type_Select_Column>>;
  distinct?: InputMaybe<Scalars["Boolean"]["input"]>;
};

/** Boolean expression to filter rows from the table "sso.user_type". All fields are combined with a logical 'AND'. */
export type Sso_User_Type_Bool_Exp = {
  _and?: InputMaybe<Array<Sso_User_Type_Bool_Exp>>;
  _not?: InputMaybe<Sso_User_Type_Bool_Exp>;
  _or?: InputMaybe<Array<Sso_User_Type_Bool_Exp>>;
  created_at?: InputMaybe<Timestamptz_Comparison_Exp>;
  id?: InputMaybe<Uuid_Comparison_Exp>;
  name?: InputMaybe<String_Comparison_Exp>;
  updated_at?: InputMaybe<Timestamptz_Comparison_Exp>;
  user_type_roles?: InputMaybe<Sso_User_Type_Roles_Bool_Exp>;
  user_type_roles_aggregate?: InputMaybe<Sso_User_Type_Roles_Aggregate_Bool_Exp>;
};

/** unique or primary key constraints on table "sso.user_type" */
export enum Sso_User_Type_Constraint {
  /** unique or primary key constraint on columns "name" */
  UserTypeNameKey = "user_type_name_key",
  /** unique or primary key constraint on columns "id" */
  UserTypePkey = "user_type_pkey",
}

/** input type for inserting data into table "sso.user_type" */
export type Sso_User_Type_Insert_Input = {
  created_at?: InputMaybe<Scalars["timestamptz"]["input"]>;
  id?: InputMaybe<Scalars["uuid"]["input"]>;
  name?: InputMaybe<Scalars["String"]["input"]>;
  updated_at?: InputMaybe<Scalars["timestamptz"]["input"]>;
  user_type_roles?: InputMaybe<Sso_User_Type_Roles_Arr_Rel_Insert_Input>;
};

/** aggregate max on columns */
export type Sso_User_Type_Max_Fields = {
  __typename?: "sso_user_type_max_fields";
  created_at?: Maybe<Scalars["timestamptz"]["output"]>;
  id?: Maybe<Scalars["uuid"]["output"]>;
  name?: Maybe<Scalars["String"]["output"]>;
  updated_at?: Maybe<Scalars["timestamptz"]["output"]>;
};

/** aggregate min on columns */
export type Sso_User_Type_Min_Fields = {
  __typename?: "sso_user_type_min_fields";
  created_at?: Maybe<Scalars["timestamptz"]["output"]>;
  id?: Maybe<Scalars["uuid"]["output"]>;
  name?: Maybe<Scalars["String"]["output"]>;
  updated_at?: Maybe<Scalars["timestamptz"]["output"]>;
};

/** response of any mutation on the table "sso.user_type" */
export type Sso_User_Type_Mutation_Response = {
  __typename?: "sso_user_type_mutation_response";
  /** number of rows affected by the mutation */
  affected_rows: Scalars["Int"]["output"];
  /** data from the rows affected by the mutation */
  returning: Array<Sso_User_Type>;
};

/** input type for inserting object relation for remote table "sso.user_type" */
export type Sso_User_Type_Obj_Rel_Insert_Input = {
  data: Sso_User_Type_Insert_Input;
  /** upsert condition */
  on_conflict?: InputMaybe<Sso_User_Type_On_Conflict>;
};

/** on_conflict condition type for table "sso.user_type" */
export type Sso_User_Type_On_Conflict = {
  constraint: Sso_User_Type_Constraint;
  update_columns?: Array<Sso_User_Type_Update_Column>;
  where?: InputMaybe<Sso_User_Type_Bool_Exp>;
};

/** Ordering options when selecting data from "sso.user_type". */
export type Sso_User_Type_Order_By = {
  created_at?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  name?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
  user_type_roles_aggregate?: InputMaybe<Sso_User_Type_Roles_Aggregate_Order_By>;
};

/** primary key columns input for table: sso.user_type */
export type Sso_User_Type_Pk_Columns_Input = {
  id: Scalars["uuid"]["input"];
};

/** Roles associated with a user type. This does NOT control the roles a user may have at anytime. These are just a way to categorize role expectations for common user types that can be generated. */
export type Sso_User_Type_Roles = {
  __typename?: "sso_user_type_roles";
  id: Scalars["uuid"]["output"];
  /** An object relationship */
  role: Sso_Roles;
  role_id: Scalars["uuid"]["output"];
  /** An object relationship */
  user_type: Sso_User_Type;
  user_type_id: Scalars["uuid"]["output"];
};

/** aggregated selection of "sso.user_type_roles" */
export type Sso_User_Type_Roles_Aggregate = {
  __typename?: "sso_user_type_roles_aggregate";
  aggregate?: Maybe<Sso_User_Type_Roles_Aggregate_Fields>;
  nodes: Array<Sso_User_Type_Roles>;
};

export type Sso_User_Type_Roles_Aggregate_Bool_Exp = {
  count?: InputMaybe<Sso_User_Type_Roles_Aggregate_Bool_Exp_Count>;
};

export type Sso_User_Type_Roles_Aggregate_Bool_Exp_Count = {
  arguments?: InputMaybe<Array<Sso_User_Type_Roles_Select_Column>>;
  distinct?: InputMaybe<Scalars["Boolean"]["input"]>;
  filter?: InputMaybe<Sso_User_Type_Roles_Bool_Exp>;
  predicate: Int_Comparison_Exp;
};

/** aggregate fields of "sso.user_type_roles" */
export type Sso_User_Type_Roles_Aggregate_Fields = {
  __typename?: "sso_user_type_roles_aggregate_fields";
  count: Scalars["Int"]["output"];
  max?: Maybe<Sso_User_Type_Roles_Max_Fields>;
  min?: Maybe<Sso_User_Type_Roles_Min_Fields>;
};

/** aggregate fields of "sso.user_type_roles" */
export type Sso_User_Type_Roles_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Sso_User_Type_Roles_Select_Column>>;
  distinct?: InputMaybe<Scalars["Boolean"]["input"]>;
};

/** order by aggregate values of table "sso.user_type_roles" */
export type Sso_User_Type_Roles_Aggregate_Order_By = {
  count?: InputMaybe<Order_By>;
  max?: InputMaybe<Sso_User_Type_Roles_Max_Order_By>;
  min?: InputMaybe<Sso_User_Type_Roles_Min_Order_By>;
};

/** input type for inserting array relation for remote table "sso.user_type_roles" */
export type Sso_User_Type_Roles_Arr_Rel_Insert_Input = {
  data: Array<Sso_User_Type_Roles_Insert_Input>;
  /** upsert condition */
  on_conflict?: InputMaybe<Sso_User_Type_Roles_On_Conflict>;
};

/** Boolean expression to filter rows from the table "sso.user_type_roles". All fields are combined with a logical 'AND'. */
export type Sso_User_Type_Roles_Bool_Exp = {
  _and?: InputMaybe<Array<Sso_User_Type_Roles_Bool_Exp>>;
  _not?: InputMaybe<Sso_User_Type_Roles_Bool_Exp>;
  _or?: InputMaybe<Array<Sso_User_Type_Roles_Bool_Exp>>;
  id?: InputMaybe<Uuid_Comparison_Exp>;
  role?: InputMaybe<Sso_Roles_Bool_Exp>;
  role_id?: InputMaybe<Uuid_Comparison_Exp>;
  user_type?: InputMaybe<Sso_User_Type_Bool_Exp>;
  user_type_id?: InputMaybe<Uuid_Comparison_Exp>;
};

/** unique or primary key constraints on table "sso.user_type_roles" */
export enum Sso_User_Type_Roles_Constraint {
  /** unique or primary key constraint on columns "id" */
  UserTypeRolesPkey = "user_type_roles_pkey",
}

/** input type for inserting data into table "sso.user_type_roles" */
export type Sso_User_Type_Roles_Insert_Input = {
  id?: InputMaybe<Scalars["uuid"]["input"]>;
  role?: InputMaybe<Sso_Roles_Obj_Rel_Insert_Input>;
  role_id?: InputMaybe<Scalars["uuid"]["input"]>;
  user_type?: InputMaybe<Sso_User_Type_Obj_Rel_Insert_Input>;
  user_type_id?: InputMaybe<Scalars["uuid"]["input"]>;
};

/** aggregate max on columns */
export type Sso_User_Type_Roles_Max_Fields = {
  __typename?: "sso_user_type_roles_max_fields";
  id?: Maybe<Scalars["uuid"]["output"]>;
  role_id?: Maybe<Scalars["uuid"]["output"]>;
  user_type_id?: Maybe<Scalars["uuid"]["output"]>;
};

/** order by max() on columns of table "sso.user_type_roles" */
export type Sso_User_Type_Roles_Max_Order_By = {
  id?: InputMaybe<Order_By>;
  role_id?: InputMaybe<Order_By>;
  user_type_id?: InputMaybe<Order_By>;
};

/** aggregate min on columns */
export type Sso_User_Type_Roles_Min_Fields = {
  __typename?: "sso_user_type_roles_min_fields";
  id?: Maybe<Scalars["uuid"]["output"]>;
  role_id?: Maybe<Scalars["uuid"]["output"]>;
  user_type_id?: Maybe<Scalars["uuid"]["output"]>;
};

/** order by min() on columns of table "sso.user_type_roles" */
export type Sso_User_Type_Roles_Min_Order_By = {
  id?: InputMaybe<Order_By>;
  role_id?: InputMaybe<Order_By>;
  user_type_id?: InputMaybe<Order_By>;
};

/** response of any mutation on the table "sso.user_type_roles" */
export type Sso_User_Type_Roles_Mutation_Response = {
  __typename?: "sso_user_type_roles_mutation_response";
  /** number of rows affected by the mutation */
  affected_rows: Scalars["Int"]["output"];
  /** data from the rows affected by the mutation */
  returning: Array<Sso_User_Type_Roles>;
};

/** on_conflict condition type for table "sso.user_type_roles" */
export type Sso_User_Type_Roles_On_Conflict = {
  constraint: Sso_User_Type_Roles_Constraint;
  update_columns?: Array<Sso_User_Type_Roles_Update_Column>;
  where?: InputMaybe<Sso_User_Type_Roles_Bool_Exp>;
};

/** Ordering options when selecting data from "sso.user_type_roles". */
export type Sso_User_Type_Roles_Order_By = {
  id?: InputMaybe<Order_By>;
  role?: InputMaybe<Sso_Roles_Order_By>;
  role_id?: InputMaybe<Order_By>;
  user_type?: InputMaybe<Sso_User_Type_Order_By>;
  user_type_id?: InputMaybe<Order_By>;
};

/** primary key columns input for table: sso.user_type_roles */
export type Sso_User_Type_Roles_Pk_Columns_Input = {
  id: Scalars["uuid"]["input"];
};

/** select columns of table "sso.user_type_roles" */
export enum Sso_User_Type_Roles_Select_Column {
  /** column name */
  Id = "id",
  /** column name */
  RoleId = "role_id",
  /** column name */
  UserTypeId = "user_type_id",
}

/** input type for updating data in table "sso.user_type_roles" */
export type Sso_User_Type_Roles_Set_Input = {
  id?: InputMaybe<Scalars["uuid"]["input"]>;
  role_id?: InputMaybe<Scalars["uuid"]["input"]>;
  user_type_id?: InputMaybe<Scalars["uuid"]["input"]>;
};

/** Streaming cursor of the table "sso_user_type_roles" */
export type Sso_User_Type_Roles_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Sso_User_Type_Roles_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Sso_User_Type_Roles_Stream_Cursor_Value_Input = {
  id?: InputMaybe<Scalars["uuid"]["input"]>;
  role_id?: InputMaybe<Scalars["uuid"]["input"]>;
  user_type_id?: InputMaybe<Scalars["uuid"]["input"]>;
};

/** update columns of table "sso.user_type_roles" */
export enum Sso_User_Type_Roles_Update_Column {
  /** column name */
  Id = "id",
  /** column name */
  RoleId = "role_id",
  /** column name */
  UserTypeId = "user_type_id",
}

export type Sso_User_Type_Roles_Updates = {
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Sso_User_Type_Roles_Set_Input>;
  /** filter the rows which have to be updated */
  where: Sso_User_Type_Roles_Bool_Exp;
};

/** select columns of table "sso.user_type" */
export enum Sso_User_Type_Select_Column {
  /** column name */
  CreatedAt = "created_at",
  /** column name */
  Id = "id",
  /** column name */
  Name = "name",
  /** column name */
  UpdatedAt = "updated_at",
}

/** input type for updating data in table "sso.user_type" */
export type Sso_User_Type_Set_Input = {
  created_at?: InputMaybe<Scalars["timestamptz"]["input"]>;
  id?: InputMaybe<Scalars["uuid"]["input"]>;
  name?: InputMaybe<Scalars["String"]["input"]>;
  updated_at?: InputMaybe<Scalars["timestamptz"]["input"]>;
};

/** Streaming cursor of the table "sso_user_type" */
export type Sso_User_Type_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Sso_User_Type_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Sso_User_Type_Stream_Cursor_Value_Input = {
  created_at?: InputMaybe<Scalars["timestamptz"]["input"]>;
  id?: InputMaybe<Scalars["uuid"]["input"]>;
  name?: InputMaybe<Scalars["String"]["input"]>;
  updated_at?: InputMaybe<Scalars["timestamptz"]["input"]>;
};

/** update columns of table "sso.user_type" */
export enum Sso_User_Type_Update_Column {
  /** column name */
  CreatedAt = "created_at",
  /** column name */
  Id = "id",
  /** column name */
  Name = "name",
  /** column name */
  UpdatedAt = "updated_at",
}

export type Sso_User_Type_Updates = {
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Sso_User_Type_Set_Input>;
  /** filter the rows which have to be updated */
  where: Sso_User_Type_Bool_Exp;
};

/** List of registered users in the system */
export type Sso_Users = {
  __typename?: "sso_users";
  address_1?: Maybe<Scalars["String"]["output"]>;
  address_2?: Maybe<Scalars["String"]["output"]>;
  country?: Maybe<Scalars["String"]["output"]>;
  created_at: Scalars["timestamptz"]["output"];
  email: Scalars["String"]["output"];
  id: Scalars["uuid"]["output"];
  name?: Maybe<Scalars["String"]["output"]>;
  password: Scalars["String"]["output"];
  phone?: Maybe<Scalars["String"]["output"]>;
  state?: Maybe<Scalars["String"]["output"]>;
  updated_at: Scalars["timestamptz"]["output"];
  /** An array relationship */
  user_roles: Array<Sso_User_Roles>;
  /** An aggregate relationship */
  user_roles_aggregate: Sso_User_Roles_Aggregate;
  zip?: Maybe<Scalars["String"]["output"]>;
};

/** List of registered users in the system */
export type Sso_UsersUser_RolesArgs = {
  distinct_on?: InputMaybe<Array<Sso_User_Roles_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Sso_User_Roles_Order_By>>;
  where?: InputMaybe<Sso_User_Roles_Bool_Exp>;
};

/** List of registered users in the system */
export type Sso_UsersUser_Roles_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Sso_User_Roles_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Sso_User_Roles_Order_By>>;
  where?: InputMaybe<Sso_User_Roles_Bool_Exp>;
};

/** aggregated selection of "sso.users" */
export type Sso_Users_Aggregate = {
  __typename?: "sso_users_aggregate";
  aggregate?: Maybe<Sso_Users_Aggregate_Fields>;
  nodes: Array<Sso_Users>;
};

/** aggregate fields of "sso.users" */
export type Sso_Users_Aggregate_Fields = {
  __typename?: "sso_users_aggregate_fields";
  count: Scalars["Int"]["output"];
  max?: Maybe<Sso_Users_Max_Fields>;
  min?: Maybe<Sso_Users_Min_Fields>;
};

/** aggregate fields of "sso.users" */
export type Sso_Users_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Sso_Users_Select_Column>>;
  distinct?: InputMaybe<Scalars["Boolean"]["input"]>;
};

/** Boolean expression to filter rows from the table "sso.users". All fields are combined with a logical 'AND'. */
export type Sso_Users_Bool_Exp = {
  _and?: InputMaybe<Array<Sso_Users_Bool_Exp>>;
  _not?: InputMaybe<Sso_Users_Bool_Exp>;
  _or?: InputMaybe<Array<Sso_Users_Bool_Exp>>;
  address_1?: InputMaybe<String_Comparison_Exp>;
  address_2?: InputMaybe<String_Comparison_Exp>;
  country?: InputMaybe<String_Comparison_Exp>;
  created_at?: InputMaybe<Timestamptz_Comparison_Exp>;
  email?: InputMaybe<String_Comparison_Exp>;
  id?: InputMaybe<Uuid_Comparison_Exp>;
  name?: InputMaybe<String_Comparison_Exp>;
  password?: InputMaybe<String_Comparison_Exp>;
  phone?: InputMaybe<String_Comparison_Exp>;
  state?: InputMaybe<String_Comparison_Exp>;
  updated_at?: InputMaybe<Timestamptz_Comparison_Exp>;
  user_roles?: InputMaybe<Sso_User_Roles_Bool_Exp>;
  user_roles_aggregate?: InputMaybe<Sso_User_Roles_Aggregate_Bool_Exp>;
  zip?: InputMaybe<String_Comparison_Exp>;
};

/** unique or primary key constraints on table "sso.users" */
export enum Sso_Users_Constraint {
  /** unique or primary key constraint on columns "email" */
  UsersEmailKey = "users_email_key",
  /** unique or primary key constraint on columns "phone" */
  UsersPhoneKey = "users_phone_key",
  /** unique or primary key constraint on columns "id" */
  UsersPkey = "users_pkey",
}

/** input type for inserting data into table "sso.users" */
export type Sso_Users_Insert_Input = {
  address_1?: InputMaybe<Scalars["String"]["input"]>;
  address_2?: InputMaybe<Scalars["String"]["input"]>;
  country?: InputMaybe<Scalars["String"]["input"]>;
  created_at?: InputMaybe<Scalars["timestamptz"]["input"]>;
  email?: InputMaybe<Scalars["String"]["input"]>;
  id?: InputMaybe<Scalars["uuid"]["input"]>;
  name?: InputMaybe<Scalars["String"]["input"]>;
  password?: InputMaybe<Scalars["String"]["input"]>;
  phone?: InputMaybe<Scalars["String"]["input"]>;
  state?: InputMaybe<Scalars["String"]["input"]>;
  updated_at?: InputMaybe<Scalars["timestamptz"]["input"]>;
  user_roles?: InputMaybe<Sso_User_Roles_Arr_Rel_Insert_Input>;
  zip?: InputMaybe<Scalars["String"]["input"]>;
};

/** aggregate max on columns */
export type Sso_Users_Max_Fields = {
  __typename?: "sso_users_max_fields";
  address_1?: Maybe<Scalars["String"]["output"]>;
  address_2?: Maybe<Scalars["String"]["output"]>;
  country?: Maybe<Scalars["String"]["output"]>;
  created_at?: Maybe<Scalars["timestamptz"]["output"]>;
  email?: Maybe<Scalars["String"]["output"]>;
  id?: Maybe<Scalars["uuid"]["output"]>;
  name?: Maybe<Scalars["String"]["output"]>;
  password?: Maybe<Scalars["String"]["output"]>;
  phone?: Maybe<Scalars["String"]["output"]>;
  state?: Maybe<Scalars["String"]["output"]>;
  updated_at?: Maybe<Scalars["timestamptz"]["output"]>;
  zip?: Maybe<Scalars["String"]["output"]>;
};

/** aggregate min on columns */
export type Sso_Users_Min_Fields = {
  __typename?: "sso_users_min_fields";
  address_1?: Maybe<Scalars["String"]["output"]>;
  address_2?: Maybe<Scalars["String"]["output"]>;
  country?: Maybe<Scalars["String"]["output"]>;
  created_at?: Maybe<Scalars["timestamptz"]["output"]>;
  email?: Maybe<Scalars["String"]["output"]>;
  id?: Maybe<Scalars["uuid"]["output"]>;
  name?: Maybe<Scalars["String"]["output"]>;
  password?: Maybe<Scalars["String"]["output"]>;
  phone?: Maybe<Scalars["String"]["output"]>;
  state?: Maybe<Scalars["String"]["output"]>;
  updated_at?: Maybe<Scalars["timestamptz"]["output"]>;
  zip?: Maybe<Scalars["String"]["output"]>;
};

/** response of any mutation on the table "sso.users" */
export type Sso_Users_Mutation_Response = {
  __typename?: "sso_users_mutation_response";
  /** number of rows affected by the mutation */
  affected_rows: Scalars["Int"]["output"];
  /** data from the rows affected by the mutation */
  returning: Array<Sso_Users>;
};

/** input type for inserting object relation for remote table "sso.users" */
export type Sso_Users_Obj_Rel_Insert_Input = {
  data: Sso_Users_Insert_Input;
  /** upsert condition */
  on_conflict?: InputMaybe<Sso_Users_On_Conflict>;
};

/** on_conflict condition type for table "sso.users" */
export type Sso_Users_On_Conflict = {
  constraint: Sso_Users_Constraint;
  update_columns?: Array<Sso_Users_Update_Column>;
  where?: InputMaybe<Sso_Users_Bool_Exp>;
};

/** Ordering options when selecting data from "sso.users". */
export type Sso_Users_Order_By = {
  address_1?: InputMaybe<Order_By>;
  address_2?: InputMaybe<Order_By>;
  country?: InputMaybe<Order_By>;
  created_at?: InputMaybe<Order_By>;
  email?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  name?: InputMaybe<Order_By>;
  password?: InputMaybe<Order_By>;
  phone?: InputMaybe<Order_By>;
  state?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
  user_roles_aggregate?: InputMaybe<Sso_User_Roles_Aggregate_Order_By>;
  zip?: InputMaybe<Order_By>;
};

/** primary key columns input for table: sso.users */
export type Sso_Users_Pk_Columns_Input = {
  id: Scalars["uuid"]["input"];
};

/** select columns of table "sso.users" */
export enum Sso_Users_Select_Column {
  /** column name */
  Address_1 = "address_1",
  /** column name */
  Address_2 = "address_2",
  /** column name */
  Country = "country",
  /** column name */
  CreatedAt = "created_at",
  /** column name */
  Email = "email",
  /** column name */
  Id = "id",
  /** column name */
  Name = "name",
  /** column name */
  Password = "password",
  /** column name */
  Phone = "phone",
  /** column name */
  State = "state",
  /** column name */
  UpdatedAt = "updated_at",
  /** column name */
  Zip = "zip",
}

/** input type for updating data in table "sso.users" */
export type Sso_Users_Set_Input = {
  address_1?: InputMaybe<Scalars["String"]["input"]>;
  address_2?: InputMaybe<Scalars["String"]["input"]>;
  country?: InputMaybe<Scalars["String"]["input"]>;
  created_at?: InputMaybe<Scalars["timestamptz"]["input"]>;
  email?: InputMaybe<Scalars["String"]["input"]>;
  id?: InputMaybe<Scalars["uuid"]["input"]>;
  name?: InputMaybe<Scalars["String"]["input"]>;
  password?: InputMaybe<Scalars["String"]["input"]>;
  phone?: InputMaybe<Scalars["String"]["input"]>;
  state?: InputMaybe<Scalars["String"]["input"]>;
  updated_at?: InputMaybe<Scalars["timestamptz"]["input"]>;
  zip?: InputMaybe<Scalars["String"]["input"]>;
};

/** Streaming cursor of the table "sso_users" */
export type Sso_Users_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Sso_Users_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Sso_Users_Stream_Cursor_Value_Input = {
  address_1?: InputMaybe<Scalars["String"]["input"]>;
  address_2?: InputMaybe<Scalars["String"]["input"]>;
  country?: InputMaybe<Scalars["String"]["input"]>;
  created_at?: InputMaybe<Scalars["timestamptz"]["input"]>;
  email?: InputMaybe<Scalars["String"]["input"]>;
  id?: InputMaybe<Scalars["uuid"]["input"]>;
  name?: InputMaybe<Scalars["String"]["input"]>;
  password?: InputMaybe<Scalars["String"]["input"]>;
  phone?: InputMaybe<Scalars["String"]["input"]>;
  state?: InputMaybe<Scalars["String"]["input"]>;
  updated_at?: InputMaybe<Scalars["timestamptz"]["input"]>;
  zip?: InputMaybe<Scalars["String"]["input"]>;
};

/** update columns of table "sso.users" */
export enum Sso_Users_Update_Column {
  /** column name */
  Address_1 = "address_1",
  /** column name */
  Address_2 = "address_2",
  /** column name */
  Country = "country",
  /** column name */
  CreatedAt = "created_at",
  /** column name */
  Email = "email",
  /** column name */
  Id = "id",
  /** column name */
  Name = "name",
  /** column name */
  Password = "password",
  /** column name */
  Phone = "phone",
  /** column name */
  State = "state",
  /** column name */
  UpdatedAt = "updated_at",
  /** column name */
  Zip = "zip",
}

export type Sso_Users_Updates = {
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Sso_Users_Set_Input>;
  /** filter the rows which have to be updated */
  where: Sso_Users_Bool_Exp;
};

export type Subscription_Root = {
  __typename?: "subscription_root";
  /** fetch data from the table: "sso.roles" */
  sso_roles: Array<Sso_Roles>;
  /** fetch aggregated fields from the table: "sso.roles" */
  sso_roles_aggregate: Sso_Roles_Aggregate;
  /** fetch data from the table: "sso.roles" using primary key columns */
  sso_roles_by_pk?: Maybe<Sso_Roles>;
  /** fetch data from the table in a streaming manner: "sso.roles" */
  sso_roles_stream: Array<Sso_Roles>;
  /** fetch data from the table: "sso.user_roles" */
  sso_user_roles: Array<Sso_User_Roles>;
  /** fetch aggregated fields from the table: "sso.user_roles" */
  sso_user_roles_aggregate: Sso_User_Roles_Aggregate;
  /** fetch data from the table: "sso.user_roles" using primary key columns */
  sso_user_roles_by_pk?: Maybe<Sso_User_Roles>;
  /** fetch data from the table in a streaming manner: "sso.user_roles" */
  sso_user_roles_stream: Array<Sso_User_Roles>;
  /** fetch data from the table: "sso.user_type" */
  sso_user_type: Array<Sso_User_Type>;
  /** fetch aggregated fields from the table: "sso.user_type" */
  sso_user_type_aggregate: Sso_User_Type_Aggregate;
  /** fetch data from the table: "sso.user_type" using primary key columns */
  sso_user_type_by_pk?: Maybe<Sso_User_Type>;
  /** fetch data from the table: "sso.user_type_roles" */
  sso_user_type_roles: Array<Sso_User_Type_Roles>;
  /** fetch aggregated fields from the table: "sso.user_type_roles" */
  sso_user_type_roles_aggregate: Sso_User_Type_Roles_Aggregate;
  /** fetch data from the table: "sso.user_type_roles" using primary key columns */
  sso_user_type_roles_by_pk?: Maybe<Sso_User_Type_Roles>;
  /** fetch data from the table in a streaming manner: "sso.user_type_roles" */
  sso_user_type_roles_stream: Array<Sso_User_Type_Roles>;
  /** fetch data from the table in a streaming manner: "sso.user_type" */
  sso_user_type_stream: Array<Sso_User_Type>;
  /** fetch data from the table: "sso.users" */
  sso_users: Array<Sso_Users>;
  /** fetch aggregated fields from the table: "sso.users" */
  sso_users_aggregate: Sso_Users_Aggregate;
  /** fetch data from the table: "sso.users" using primary key columns */
  sso_users_by_pk?: Maybe<Sso_Users>;
  /** fetch data from the table in a streaming manner: "sso.users" */
  sso_users_stream: Array<Sso_Users>;
  /** fetch data from the table: "test" */
  test: Array<Test>;
  /** fetch aggregated fields from the table: "test" */
  test_aggregate: Test_Aggregate;
  /** fetch data from the table: "test" using primary key columns */
  test_by_pk?: Maybe<Test>;
  /** fetch data from the table in a streaming manner: "test" */
  test_stream: Array<Test>;
};

export type Subscription_RootSso_RolesArgs = {
  distinct_on?: InputMaybe<Array<Sso_Roles_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Sso_Roles_Order_By>>;
  where?: InputMaybe<Sso_Roles_Bool_Exp>;
};

export type Subscription_RootSso_Roles_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Sso_Roles_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Sso_Roles_Order_By>>;
  where?: InputMaybe<Sso_Roles_Bool_Exp>;
};

export type Subscription_RootSso_Roles_By_PkArgs = {
  id: Scalars["uuid"]["input"];
};

export type Subscription_RootSso_Roles_StreamArgs = {
  batch_size: Scalars["Int"]["input"];
  cursor: Array<InputMaybe<Sso_Roles_Stream_Cursor_Input>>;
  where?: InputMaybe<Sso_Roles_Bool_Exp>;
};

export type Subscription_RootSso_User_RolesArgs = {
  distinct_on?: InputMaybe<Array<Sso_User_Roles_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Sso_User_Roles_Order_By>>;
  where?: InputMaybe<Sso_User_Roles_Bool_Exp>;
};

export type Subscription_RootSso_User_Roles_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Sso_User_Roles_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Sso_User_Roles_Order_By>>;
  where?: InputMaybe<Sso_User_Roles_Bool_Exp>;
};

export type Subscription_RootSso_User_Roles_By_PkArgs = {
  id: Scalars["uuid"]["input"];
};

export type Subscription_RootSso_User_Roles_StreamArgs = {
  batch_size: Scalars["Int"]["input"];
  cursor: Array<InputMaybe<Sso_User_Roles_Stream_Cursor_Input>>;
  where?: InputMaybe<Sso_User_Roles_Bool_Exp>;
};

export type Subscription_RootSso_User_TypeArgs = {
  distinct_on?: InputMaybe<Array<Sso_User_Type_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Sso_User_Type_Order_By>>;
  where?: InputMaybe<Sso_User_Type_Bool_Exp>;
};

export type Subscription_RootSso_User_Type_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Sso_User_Type_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Sso_User_Type_Order_By>>;
  where?: InputMaybe<Sso_User_Type_Bool_Exp>;
};

export type Subscription_RootSso_User_Type_By_PkArgs = {
  id: Scalars["uuid"]["input"];
};

export type Subscription_RootSso_User_Type_RolesArgs = {
  distinct_on?: InputMaybe<Array<Sso_User_Type_Roles_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Sso_User_Type_Roles_Order_By>>;
  where?: InputMaybe<Sso_User_Type_Roles_Bool_Exp>;
};

export type Subscription_RootSso_User_Type_Roles_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Sso_User_Type_Roles_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Sso_User_Type_Roles_Order_By>>;
  where?: InputMaybe<Sso_User_Type_Roles_Bool_Exp>;
};

export type Subscription_RootSso_User_Type_Roles_By_PkArgs = {
  id: Scalars["uuid"]["input"];
};

export type Subscription_RootSso_User_Type_Roles_StreamArgs = {
  batch_size: Scalars["Int"]["input"];
  cursor: Array<InputMaybe<Sso_User_Type_Roles_Stream_Cursor_Input>>;
  where?: InputMaybe<Sso_User_Type_Roles_Bool_Exp>;
};

export type Subscription_RootSso_User_Type_StreamArgs = {
  batch_size: Scalars["Int"]["input"];
  cursor: Array<InputMaybe<Sso_User_Type_Stream_Cursor_Input>>;
  where?: InputMaybe<Sso_User_Type_Bool_Exp>;
};

export type Subscription_RootSso_UsersArgs = {
  distinct_on?: InputMaybe<Array<Sso_Users_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Sso_Users_Order_By>>;
  where?: InputMaybe<Sso_Users_Bool_Exp>;
};

export type Subscription_RootSso_Users_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Sso_Users_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Sso_Users_Order_By>>;
  where?: InputMaybe<Sso_Users_Bool_Exp>;
};

export type Subscription_RootSso_Users_By_PkArgs = {
  id: Scalars["uuid"]["input"];
};

export type Subscription_RootSso_Users_StreamArgs = {
  batch_size: Scalars["Int"]["input"];
  cursor: Array<InputMaybe<Sso_Users_Stream_Cursor_Input>>;
  where?: InputMaybe<Sso_Users_Bool_Exp>;
};

export type Subscription_RootTestArgs = {
  distinct_on?: InputMaybe<Array<Test_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Test_Order_By>>;
  where?: InputMaybe<Test_Bool_Exp>;
};

export type Subscription_RootTest_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Test_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Test_Order_By>>;
  where?: InputMaybe<Test_Bool_Exp>;
};

export type Subscription_RootTest_By_PkArgs = {
  id: Scalars["uuid"]["input"];
};

export type Subscription_RootTest_StreamArgs = {
  batch_size: Scalars["Int"]["input"];
  cursor: Array<InputMaybe<Test_Stream_Cursor_Input>>;
  where?: InputMaybe<Test_Bool_Exp>;
};

/** testing permissions */
export type Test = {
  __typename?: "test";
  data1: Scalars["String"]["output"];
  data2: Scalars["numeric"]["output"];
  data3: Scalars["timetz"]["output"];
  id: Scalars["uuid"]["output"];
  user_id: Scalars["uuid"]["output"];
  /** An object relationship */
  user_messages: Sso_Users;
};

/** aggregated selection of "test" */
export type Test_Aggregate = {
  __typename?: "test_aggregate";
  aggregate?: Maybe<Test_Aggregate_Fields>;
  nodes: Array<Test>;
};

/** aggregate fields of "test" */
export type Test_Aggregate_Fields = {
  __typename?: "test_aggregate_fields";
  avg?: Maybe<Test_Avg_Fields>;
  count: Scalars["Int"]["output"];
  max?: Maybe<Test_Max_Fields>;
  min?: Maybe<Test_Min_Fields>;
  stddev?: Maybe<Test_Stddev_Fields>;
  stddev_pop?: Maybe<Test_Stddev_Pop_Fields>;
  stddev_samp?: Maybe<Test_Stddev_Samp_Fields>;
  sum?: Maybe<Test_Sum_Fields>;
  var_pop?: Maybe<Test_Var_Pop_Fields>;
  var_samp?: Maybe<Test_Var_Samp_Fields>;
  variance?: Maybe<Test_Variance_Fields>;
};

/** aggregate fields of "test" */
export type Test_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Test_Select_Column>>;
  distinct?: InputMaybe<Scalars["Boolean"]["input"]>;
};

/** aggregate avg on columns */
export type Test_Avg_Fields = {
  __typename?: "test_avg_fields";
  data2?: Maybe<Scalars["Float"]["output"]>;
};

/** Boolean expression to filter rows from the table "test". All fields are combined with a logical 'AND'. */
export type Test_Bool_Exp = {
  _and?: InputMaybe<Array<Test_Bool_Exp>>;
  _not?: InputMaybe<Test_Bool_Exp>;
  _or?: InputMaybe<Array<Test_Bool_Exp>>;
  data1?: InputMaybe<String_Comparison_Exp>;
  data2?: InputMaybe<Numeric_Comparison_Exp>;
  data3?: InputMaybe<Timetz_Comparison_Exp>;
  id?: InputMaybe<Uuid_Comparison_Exp>;
  user_id?: InputMaybe<Uuid_Comparison_Exp>;
  user_messages?: InputMaybe<Sso_Users_Bool_Exp>;
};

/** unique or primary key constraints on table "test" */
export enum Test_Constraint {
  /** unique or primary key constraint on columns "id" */
  TestPkey = "test_pkey",
  /** unique or primary key constraint on columns "user_id" */
  TestUserIdKey = "test_user_id_key",
}

/** input type for incrementing numeric columns in table "test" */
export type Test_Inc_Input = {
  data2?: InputMaybe<Scalars["numeric"]["input"]>;
};

/** input type for inserting data into table "test" */
export type Test_Insert_Input = {
  data1?: InputMaybe<Scalars["String"]["input"]>;
  data2?: InputMaybe<Scalars["numeric"]["input"]>;
  data3?: InputMaybe<Scalars["timetz"]["input"]>;
  id?: InputMaybe<Scalars["uuid"]["input"]>;
  user_id?: InputMaybe<Scalars["uuid"]["input"]>;
  user_messages?: InputMaybe<Sso_Users_Obj_Rel_Insert_Input>;
};

/** aggregate max on columns */
export type Test_Max_Fields = {
  __typename?: "test_max_fields";
  data1?: Maybe<Scalars["String"]["output"]>;
  data2?: Maybe<Scalars["numeric"]["output"]>;
  data3?: Maybe<Scalars["timetz"]["output"]>;
  id?: Maybe<Scalars["uuid"]["output"]>;
  user_id?: Maybe<Scalars["uuid"]["output"]>;
};

/** aggregate min on columns */
export type Test_Min_Fields = {
  __typename?: "test_min_fields";
  data1?: Maybe<Scalars["String"]["output"]>;
  data2?: Maybe<Scalars["numeric"]["output"]>;
  data3?: Maybe<Scalars["timetz"]["output"]>;
  id?: Maybe<Scalars["uuid"]["output"]>;
  user_id?: Maybe<Scalars["uuid"]["output"]>;
};

/** response of any mutation on the table "test" */
export type Test_Mutation_Response = {
  __typename?: "test_mutation_response";
  /** number of rows affected by the mutation */
  affected_rows: Scalars["Int"]["output"];
  /** data from the rows affected by the mutation */
  returning: Array<Test>;
};

/** on_conflict condition type for table "test" */
export type Test_On_Conflict = {
  constraint: Test_Constraint;
  update_columns?: Array<Test_Update_Column>;
  where?: InputMaybe<Test_Bool_Exp>;
};

/** Ordering options when selecting data from "test". */
export type Test_Order_By = {
  data1?: InputMaybe<Order_By>;
  data2?: InputMaybe<Order_By>;
  data3?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  user_id?: InputMaybe<Order_By>;
  user_messages?: InputMaybe<Sso_Users_Order_By>;
};

/** primary key columns input for table: test */
export type Test_Pk_Columns_Input = {
  id: Scalars["uuid"]["input"];
};

/** select columns of table "test" */
export enum Test_Select_Column {
  /** column name */
  Data1 = "data1",
  /** column name */
  Data2 = "data2",
  /** column name */
  Data3 = "data3",
  /** column name */
  Id = "id",
  /** column name */
  UserId = "user_id",
}

/** input type for updating data in table "test" */
export type Test_Set_Input = {
  data1?: InputMaybe<Scalars["String"]["input"]>;
  data2?: InputMaybe<Scalars["numeric"]["input"]>;
  data3?: InputMaybe<Scalars["timetz"]["input"]>;
  id?: InputMaybe<Scalars["uuid"]["input"]>;
  user_id?: InputMaybe<Scalars["uuid"]["input"]>;
};

/** aggregate stddev on columns */
export type Test_Stddev_Fields = {
  __typename?: "test_stddev_fields";
  data2?: Maybe<Scalars["Float"]["output"]>;
};

/** aggregate stddev_pop on columns */
export type Test_Stddev_Pop_Fields = {
  __typename?: "test_stddev_pop_fields";
  data2?: Maybe<Scalars["Float"]["output"]>;
};

/** aggregate stddev_samp on columns */
export type Test_Stddev_Samp_Fields = {
  __typename?: "test_stddev_samp_fields";
  data2?: Maybe<Scalars["Float"]["output"]>;
};

/** Streaming cursor of the table "test" */
export type Test_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Test_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Test_Stream_Cursor_Value_Input = {
  data1?: InputMaybe<Scalars["String"]["input"]>;
  data2?: InputMaybe<Scalars["numeric"]["input"]>;
  data3?: InputMaybe<Scalars["timetz"]["input"]>;
  id?: InputMaybe<Scalars["uuid"]["input"]>;
  user_id?: InputMaybe<Scalars["uuid"]["input"]>;
};

/** aggregate sum on columns */
export type Test_Sum_Fields = {
  __typename?: "test_sum_fields";
  data2?: Maybe<Scalars["numeric"]["output"]>;
};

/** update columns of table "test" */
export enum Test_Update_Column {
  /** column name */
  Data1 = "data1",
  /** column name */
  Data2 = "data2",
  /** column name */
  Data3 = "data3",
  /** column name */
  Id = "id",
  /** column name */
  UserId = "user_id",
}

export type Test_Updates = {
  /** increments the numeric columns with given value of the filtered values */
  _inc?: InputMaybe<Test_Inc_Input>;
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Test_Set_Input>;
  /** filter the rows which have to be updated */
  where: Test_Bool_Exp;
};

/** aggregate var_pop on columns */
export type Test_Var_Pop_Fields = {
  __typename?: "test_var_pop_fields";
  data2?: Maybe<Scalars["Float"]["output"]>;
};

/** aggregate var_samp on columns */
export type Test_Var_Samp_Fields = {
  __typename?: "test_var_samp_fields";
  data2?: Maybe<Scalars["Float"]["output"]>;
};

/** aggregate variance on columns */
export type Test_Variance_Fields = {
  __typename?: "test_variance_fields";
  data2?: Maybe<Scalars["Float"]["output"]>;
};

/** Boolean expression to compare columns of type "timestamptz". All fields are combined with logical 'AND'. */
export type Timestamptz_Comparison_Exp = {
  _eq?: InputMaybe<Scalars["timestamptz"]["input"]>;
  _gt?: InputMaybe<Scalars["timestamptz"]["input"]>;
  _gte?: InputMaybe<Scalars["timestamptz"]["input"]>;
  _in?: InputMaybe<Array<Scalars["timestamptz"]["input"]>>;
  _is_null?: InputMaybe<Scalars["Boolean"]["input"]>;
  _lt?: InputMaybe<Scalars["timestamptz"]["input"]>;
  _lte?: InputMaybe<Scalars["timestamptz"]["input"]>;
  _neq?: InputMaybe<Scalars["timestamptz"]["input"]>;
  _nin?: InputMaybe<Array<Scalars["timestamptz"]["input"]>>;
};

/** Boolean expression to compare columns of type "timetz". All fields are combined with logical 'AND'. */
export type Timetz_Comparison_Exp = {
  _eq?: InputMaybe<Scalars["timetz"]["input"]>;
  _gt?: InputMaybe<Scalars["timetz"]["input"]>;
  _gte?: InputMaybe<Scalars["timetz"]["input"]>;
  _in?: InputMaybe<Array<Scalars["timetz"]["input"]>>;
  _is_null?: InputMaybe<Scalars["Boolean"]["input"]>;
  _lt?: InputMaybe<Scalars["timetz"]["input"]>;
  _lte?: InputMaybe<Scalars["timetz"]["input"]>;
  _neq?: InputMaybe<Scalars["timetz"]["input"]>;
  _nin?: InputMaybe<Array<Scalars["timetz"]["input"]>>;
};

/** Boolean expression to compare columns of type "uuid". All fields are combined with logical 'AND'. */
export type Uuid_Comparison_Exp = {
  _eq?: InputMaybe<Scalars["uuid"]["input"]>;
  _gt?: InputMaybe<Scalars["uuid"]["input"]>;
  _gte?: InputMaybe<Scalars["uuid"]["input"]>;
  _in?: InputMaybe<Array<Scalars["uuid"]["input"]>>;
  _is_null?: InputMaybe<Scalars["Boolean"]["input"]>;
  _lt?: InputMaybe<Scalars["uuid"]["input"]>;
  _lte?: InputMaybe<Scalars["uuid"]["input"]>;
  _neq?: InputMaybe<Scalars["uuid"]["input"]>;
  _nin?: InputMaybe<Array<Scalars["uuid"]["input"]>>;
};

export type Roles_For_User_QueryQueryVariables = Exact<{
  id: Scalars["uuid"]["input"];
}>;

export type Roles_For_User_QueryQuery = {
  __typename?: "query_root";
  sso_users_by_pk?: {
    __typename?: "sso_users";
    user_roles: Array<{
      __typename?: "sso_user_roles";
      role: { __typename?: "sso_roles"; name: string };
    }>;
  } | null;
};

export type Default_User_Roles_QueryQueryVariables = Exact<{
  userTypeName: Scalars["String"]["input"];
}>;

export type Default_User_Roles_QueryQuery = {
  __typename?: "query_root";
  sso_user_type: Array<{
    __typename?: "sso_user_type";
    user_type_roles: Array<{
      __typename?: "sso_user_type_roles";
      role: { __typename?: "sso_roles"; id: any; name: string };
    }>;
  }>;
};

export type Find_Admin_RoleQueryVariables = Exact<{
  roleName: Scalars["String"]["input"];
}>;

export type Find_Admin_RoleQuery = {
  __typename?: "query_root";
  sso_roles: Array<{ __typename?: "sso_roles"; id: any }>;
};

export type Add_Role_MutationMutationVariables = Exact<{
  roleName: Scalars["String"]["input"];
  description: Scalars["String"]["input"];
}>;

export type Add_Role_MutationMutation = {
  __typename?: "mutation_root";
  insert_sso_roles_one?: { __typename?: "sso_roles"; id: any } | null;
};

export type Add_User_Roles_MutationMutationVariables = Exact<{
  userRolePairs:
    | Array<Sso_User_Roles_Insert_Input>
    | Sso_User_Roles_Insert_Input;
}>;

export type Add_User_Roles_MutationMutation = {
  __typename?: "mutation_root";
  insert_sso_user_roles?: {
    __typename?: "sso_user_roles_mutation_response";
    returning: Array<{ __typename?: "sso_user_roles"; id: any }>;
  } | null;
};

export type Login_QueryQueryVariables = Exact<{
  email?: InputMaybe<Scalars["String"]["input"]>;
}>;

export type Login_QueryQuery = {
  __typename?: "query_root";
  sso_users: Array<{
    __typename?: "sso_users";
    id: any;
    password: string;
    email: string;
    name?: string | null;
    user_roles: Array<{
      __typename?: "sso_user_roles";
      role: { __typename?: "sso_roles"; name: string };
    }>;
  }>;
};

export type User_By_Email_QueryQueryVariables = Exact<{
  email?: InputMaybe<Scalars["String"]["input"]>;
}>;

export type User_By_Email_QueryQuery = {
  __typename?: "query_root";
  sso_users: Array<{
    __typename?: "sso_users";
    email: string;
    name?: string | null;
  }>;
};

export type User_By_IdQueryVariables = Exact<{
  id: Scalars["uuid"]["input"];
}>;

export type User_By_IdQuery = {
  __typename?: "query_root";
  sso_users: Array<{
    __typename?: "sso_users";
    id: any;
    email: string;
    name?: string | null;
    user_roles: Array<{
      __typename?: "sso_user_roles";
      role: { __typename?: "sso_roles"; name: string };
    }>;
  }>;
};

export type Add_User_MutationMutationVariables = Exact<{
  email: Scalars["String"]["input"];
  password: Scalars["String"]["input"];
}>;

export type Add_User_MutationMutation = {
  __typename?: "mutation_root";
  insert_sso_users_one?: { __typename?: "sso_users"; id: any } | null;
};

export type Find_Users_By_Role_Name_QueryQueryVariables = Exact<{
  roleName?: InputMaybe<Scalars["String"]["input"]>;
}>;

export type Find_Users_By_Role_Name_QueryQuery = {
  __typename?: "query_root";
  sso_users: Array<{
    __typename?: "sso_users";
    id: any;
    name?: string | null;
    email: string;
    user_roles: Array<{
      __typename?: "sso_user_roles";
      role: { __typename?: "sso_roles"; name: string };
    }>;
  }>;
};

export const Roles_For_User_QueryDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "query",
      name: { kind: "Name", value: "ROLES_FOR_USER_QUERY" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "id" } },
          type: {
            kind: "NonNullType",
            type: { kind: "NamedType", name: { kind: "Name", value: "uuid" } },
          },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "sso_users_by_pk" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "id" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "id" },
                },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                {
                  kind: "Field",
                  name: { kind: "Name", value: "user_roles" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "role" },
                        selectionSet: {
                          kind: "SelectionSet",
                          selections: [
                            {
                              kind: "Field",
                              name: { kind: "Name", value: "name" },
                            },
                          ],
                        },
                      },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<
  Roles_For_User_QueryQuery,
  Roles_For_User_QueryQueryVariables
>;
export const Default_User_Roles_QueryDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "query",
      name: { kind: "Name", value: "DEFAULT_USER_ROLES_QUERY" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "userTypeName" },
          },
          type: {
            kind: "NonNullType",
            type: {
              kind: "NamedType",
              name: { kind: "Name", value: "String" },
            },
          },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "sso_user_type" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "where" },
                value: {
                  kind: "ObjectValue",
                  fields: [
                    {
                      kind: "ObjectField",
                      name: { kind: "Name", value: "name" },
                      value: {
                        kind: "ObjectValue",
                        fields: [
                          {
                            kind: "ObjectField",
                            name: { kind: "Name", value: "_eq" },
                            value: {
                              kind: "Variable",
                              name: { kind: "Name", value: "userTypeName" },
                            },
                          },
                        ],
                      },
                    },
                  ],
                },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                {
                  kind: "Field",
                  name: { kind: "Name", value: "user_type_roles" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "role" },
                        selectionSet: {
                          kind: "SelectionSet",
                          selections: [
                            {
                              kind: "Field",
                              name: { kind: "Name", value: "id" },
                            },
                            {
                              kind: "Field",
                              name: { kind: "Name", value: "name" },
                            },
                          ],
                        },
                      },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<
  Default_User_Roles_QueryQuery,
  Default_User_Roles_QueryQueryVariables
>;
export const Find_Admin_RoleDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "query",
      name: { kind: "Name", value: "FIND_ADMIN_ROLE" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "roleName" },
          },
          type: {
            kind: "NonNullType",
            type: {
              kind: "NamedType",
              name: { kind: "Name", value: "String" },
            },
          },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "sso_roles" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "where" },
                value: {
                  kind: "ObjectValue",
                  fields: [
                    {
                      kind: "ObjectField",
                      name: { kind: "Name", value: "name" },
                      value: {
                        kind: "ObjectValue",
                        fields: [
                          {
                            kind: "ObjectField",
                            name: { kind: "Name", value: "_eq" },
                            value: {
                              kind: "Variable",
                              name: { kind: "Name", value: "roleName" },
                            },
                          },
                        ],
                      },
                    },
                  ],
                },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "id" } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<
  Find_Admin_RoleQuery,
  Find_Admin_RoleQueryVariables
>;
export const Add_Role_MutationDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "mutation",
      name: { kind: "Name", value: "ADD_ROLE_MUTATION" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "roleName" },
          },
          type: {
            kind: "NonNullType",
            type: {
              kind: "NamedType",
              name: { kind: "Name", value: "String" },
            },
          },
        },
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "description" },
          },
          type: {
            kind: "NonNullType",
            type: {
              kind: "NamedType",
              name: { kind: "Name", value: "String" },
            },
          },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "insert_sso_roles_one" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "object" },
                value: {
                  kind: "ObjectValue",
                  fields: [
                    {
                      kind: "ObjectField",
                      name: { kind: "Name", value: "name" },
                      value: {
                        kind: "Variable",
                        name: { kind: "Name", value: "roleName" },
                      },
                    },
                    {
                      kind: "ObjectField",
                      name: { kind: "Name", value: "description" },
                      value: {
                        kind: "Variable",
                        name: { kind: "Name", value: "description" },
                      },
                    },
                  ],
                },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "id" } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<
  Add_Role_MutationMutation,
  Add_Role_MutationMutationVariables
>;
export const Add_User_Roles_MutationDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "mutation",
      name: { kind: "Name", value: "ADD_USER_ROLES_MUTATION" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "userRolePairs" },
          },
          type: {
            kind: "NonNullType",
            type: {
              kind: "ListType",
              type: {
                kind: "NonNullType",
                type: {
                  kind: "NamedType",
                  name: { kind: "Name", value: "sso_user_roles_insert_input" },
                },
              },
            },
          },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "insert_sso_user_roles" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "objects" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "userRolePairs" },
                },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                {
                  kind: "Field",
                  name: { kind: "Name", value: "returning" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      { kind: "Field", name: { kind: "Name", value: "id" } },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<
  Add_User_Roles_MutationMutation,
  Add_User_Roles_MutationMutationVariables
>;
export const Login_QueryDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "query",
      name: { kind: "Name", value: "LOGIN_QUERY" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "email" },
          },
          type: { kind: "NamedType", name: { kind: "Name", value: "String" } },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "sso_users" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "where" },
                value: {
                  kind: "ObjectValue",
                  fields: [
                    {
                      kind: "ObjectField",
                      name: { kind: "Name", value: "email" },
                      value: {
                        kind: "ObjectValue",
                        fields: [
                          {
                            kind: "ObjectField",
                            name: { kind: "Name", value: "_eq" },
                            value: {
                              kind: "Variable",
                              name: { kind: "Name", value: "email" },
                            },
                          },
                        ],
                      },
                    },
                  ],
                },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "id" } },
                { kind: "Field", name: { kind: "Name", value: "password" } },
                { kind: "Field", name: { kind: "Name", value: "email" } },
                { kind: "Field", name: { kind: "Name", value: "name" } },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "user_roles" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "role" },
                        selectionSet: {
                          kind: "SelectionSet",
                          selections: [
                            {
                              kind: "Field",
                              name: { kind: "Name", value: "name" },
                            },
                          ],
                        },
                      },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<Login_QueryQuery, Login_QueryQueryVariables>;
export const User_By_Email_QueryDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "query",
      name: { kind: "Name", value: "USER_BY_EMAIL_QUERY" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "email" },
          },
          type: { kind: "NamedType", name: { kind: "Name", value: "String" } },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "sso_users" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "where" },
                value: {
                  kind: "ObjectValue",
                  fields: [
                    {
                      kind: "ObjectField",
                      name: { kind: "Name", value: "email" },
                      value: {
                        kind: "ObjectValue",
                        fields: [
                          {
                            kind: "ObjectField",
                            name: { kind: "Name", value: "_eq" },
                            value: {
                              kind: "Variable",
                              name: { kind: "Name", value: "email" },
                            },
                          },
                        ],
                      },
                    },
                  ],
                },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "email" } },
                { kind: "Field", name: { kind: "Name", value: "name" } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<
  User_By_Email_QueryQuery,
  User_By_Email_QueryQueryVariables
>;
export const User_By_IdDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "query",
      name: { kind: "Name", value: "USER_BY_ID" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "id" } },
          type: {
            kind: "NonNullType",
            type: { kind: "NamedType", name: { kind: "Name", value: "uuid" } },
          },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "sso_users" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "where" },
                value: {
                  kind: "ObjectValue",
                  fields: [
                    {
                      kind: "ObjectField",
                      name: { kind: "Name", value: "id" },
                      value: {
                        kind: "ObjectValue",
                        fields: [
                          {
                            kind: "ObjectField",
                            name: { kind: "Name", value: "_eq" },
                            value: {
                              kind: "Variable",
                              name: { kind: "Name", value: "id" },
                            },
                          },
                        ],
                      },
                    },
                  ],
                },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "id" } },
                { kind: "Field", name: { kind: "Name", value: "email" } },
                { kind: "Field", name: { kind: "Name", value: "name" } },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "user_roles" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "role" },
                        selectionSet: {
                          kind: "SelectionSet",
                          selections: [
                            {
                              kind: "Field",
                              name: { kind: "Name", value: "name" },
                            },
                          ],
                        },
                      },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<User_By_IdQuery, User_By_IdQueryVariables>;
export const Add_User_MutationDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "mutation",
      name: { kind: "Name", value: "ADD_USER_MUTATION" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "email" },
          },
          type: {
            kind: "NonNullType",
            type: {
              kind: "NamedType",
              name: { kind: "Name", value: "String" },
            },
          },
        },
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "password" },
          },
          type: {
            kind: "NonNullType",
            type: {
              kind: "NamedType",
              name: { kind: "Name", value: "String" },
            },
          },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "insert_sso_users_one" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "object" },
                value: {
                  kind: "ObjectValue",
                  fields: [
                    {
                      kind: "ObjectField",
                      name: { kind: "Name", value: "email" },
                      value: {
                        kind: "Variable",
                        name: { kind: "Name", value: "email" },
                      },
                    },
                    {
                      kind: "ObjectField",
                      name: { kind: "Name", value: "password" },
                      value: {
                        kind: "Variable",
                        name: { kind: "Name", value: "password" },
                      },
                    },
                  ],
                },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "id" } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<
  Add_User_MutationMutation,
  Add_User_MutationMutationVariables
>;
export const Find_Users_By_Role_Name_QueryDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "query",
      name: { kind: "Name", value: "FIND_USERS_BY_ROLE_NAME_QUERY" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "roleName" },
          },
          type: { kind: "NamedType", name: { kind: "Name", value: "String" } },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "sso_users" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "where" },
                value: {
                  kind: "ObjectValue",
                  fields: [
                    {
                      kind: "ObjectField",
                      name: { kind: "Name", value: "user_roles" },
                      value: {
                        kind: "ObjectValue",
                        fields: [
                          {
                            kind: "ObjectField",
                            name: { kind: "Name", value: "role" },
                            value: {
                              kind: "ObjectValue",
                              fields: [
                                {
                                  kind: "ObjectField",
                                  name: { kind: "Name", value: "name" },
                                  value: {
                                    kind: "ObjectValue",
                                    fields: [
                                      {
                                        kind: "ObjectField",
                                        name: { kind: "Name", value: "_eq" },
                                        value: {
                                          kind: "Variable",
                                          name: {
                                            kind: "Name",
                                            value: "roleName",
                                          },
                                        },
                                      },
                                    ],
                                  },
                                },
                              ],
                            },
                          },
                        ],
                      },
                    },
                  ],
                },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "id" } },
                { kind: "Field", name: { kind: "Name", value: "name" } },
                { kind: "Field", name: { kind: "Name", value: "email" } },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "user_roles" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "role" },
                        selectionSet: {
                          kind: "SelectionSet",
                          selections: [
                            {
                              kind: "Field",
                              name: { kind: "Name", value: "name" },
                            },
                          ],
                        },
                      },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<
  Find_Users_By_Role_Name_QueryQuery,
  Find_Users_By_Role_Name_QueryQueryVariables
>;
