import { SSTConfig } from "sst";
import { Frontend } from "./stacks/Frontend";

export default {
  config(_input) {
    return {
      name: "wanderers-guide",
      region: "us-east-1",
    };
  },
  stacks(app) {
    app.setDefaultFunctionProps({
      architecture: "arm_64",
      runtime: "nodejs18.x",
      nodejs: {
        format: "esm",
      },
    });

    app.stack(Frontend);
  },
} satisfies SSTConfig;
