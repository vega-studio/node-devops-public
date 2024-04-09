/**
 * This file expresses the necessary environment variables that need to be set
 * in order for the server or other parts of this application work correctly.
 */
export default [
  {
    required: false,
    warn: false,
    name: "BUILD_MODE",
    description: `
      This causes the server to run with the specified build configuration files.
      All files under app/config will load in the specified build mode in their
      given folders:

      config/env/env.ts -> config/env/env.BUILD_MODE.ts
      config/theme/theme.ts -> config/theme/theme.BUILD_MODE.ts

      etc.

      Not specifying a build mode typically means that the server will run in
      development mode, targetting config files with no build mode modifier in
      their file path.
    `,
  },
  {
    required: true,
    name: "HASURA_GRAPHQL_ADMIN_SECRET",
    description: `
      This is the ADMIN secret that Hasura uses to authenticate it's graphql
      endpoint. This allows our server to query and mutate the DB through hasura.
      The client should NEVER be aware of this secret.
    `,
  },
  {
    required: true,
    name: "JWT_SECRET",
    description: `
      This is the secret that is used to sign JWT tokens. This secret should be
      kept private and should be unique for each environment.
    `,
  },
  {
    required: false,
    warn: false,
    name: "PORT",
    description: `
      Port this server will bind to. Defaults to normal http(s) protocol ports
      when not provided.
    `,
  },
  {
    required: false,
    warn: false,
    name: "DEFAULT_ADMIN_EMAIL",
    description: `
      Email for the default admin account to be created if none is present. This
      will NOT generate an admin account if the target instance already has a
      user with an admin defined role.
    `,
  },
  {
    required: false,
    warn: false,
    name: "DEFAULT_ADMIN_PASSWORD",
    description: `
      Password for the default admin account to be created if none is present.
      This will NOT generate an admin account if the target instance already has
      a user with an admin defined role. It is HIGHLY recommended to use the UI
      to change the admin's password from this provided default after the
      instance is established.
    `,
  },
  {
    required: false,
    warn: false,
    name: "WRITE_API_LOGS_TO_FILE",
    description: `
      When set explicitly to 'true', this will cause the logs for the API
      Logging to be written to logs/api.log. This is recommended to be set for
      production environments to help with debugging, as well as provide an
      audit that can be examined for security purposes.

      Logs written to this file ignore log levels and write all logs that could
      be logged.
    `,
  },
  {
    required: false,
    warn: false,
    name: "WRITE_SYSTEM_LOGS_TO_FILE",
    description: `
      When set explicitly to 'true', this will cause the logs for the System
      Logging to be written to logs/system.log. This is recommended to be set
      for production environments to help with debugging, as well as provide an
      audit that can be examined for security purposes.

      Logs written to this file ignore log levels and write all logs that could
      be logged.
    `,
  },
] as {
  required: boolean;
  name: string;
  description: string;
}[];
