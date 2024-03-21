import { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "${{appId}}",
  appName: "${{appName}}",
  webDir: "build/client",

  // Unlike android, iOS for Capacitor can not mimick a domain host for the
  // browser because of platform limitations. Thus, to bypass CORs issues for
  // the native browser, we simply enable native fetch calls for iOS which
  // causes a fetch to get hijacked by the native platform and use a native
  // method to make the call.
  server: {},
  plugins: {
    CapacitorHttp: {
      enabled: true,
    },
  },
};

export default config;
