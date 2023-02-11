import { RemovalPolicy } from "aws-cdk-lib";
import { SSTConfig } from "sst";
import { Frontend } from "./stacks/Frontend";
import { isPersonalStack } from "./stacks/utils";

export default {
  config(_input) {
    return {
      name: "wanderers-guide",
      region: "us-east-1",
    };
  },
  stacks(app) {
    if (isPersonalStack(app)) {
      app.setDefaultRemovalPolicy(RemovalPolicy.DESTROY);
    }

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
