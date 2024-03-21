import { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "${{appId}}",
  appName: "${{appName}}",
  webDir: "build/client",

  // Android has issues with calling out via native fetch calls. So we instead
  // use the strategy of mimicking the same host for the browser to match the
  // domain to where the app is normally hosted on the web. This properly
  // bypasses CORs issues.
  server: {
    androidScheme: "https",
    iosScheme: "https",
    hostname: "${{appHost}}",
  },
  plugins: {
    CapacitorHttp: {
      enabled: false,
    },
  },
};

export default config;
