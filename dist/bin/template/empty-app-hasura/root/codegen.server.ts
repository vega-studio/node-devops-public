import path from "path";
import { CodegenConfig } from "@graphql-codegen/cli";

const genPath = `${path.resolve("app/server/api/gql/gen/")}/`;

const config: CodegenConfig = {
  schema: [
    {
      "http://localhost:8080/v1/graphql": {
        headers: {
          "x-hasura-admin-secret":
            process.env.HASURA_GRAPHQL_ADMIN_SECRET || "",
        },
      },
    },
  ],
  documents: ["app/server/**/*.{ts,tsx}"],
  emitLegacyCommonJSImports: false,
  generates: {
    [genPath]: {
      preset: "client",
      plugins: [],
      presetConfig: {
        gqlTagName: "gql",
      },
    },
  },
  // ignoreNoDocuments: true,
};

export default config;
