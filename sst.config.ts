import { SSTConfig } from "sst";

export default {
  config(_input) {
    return {
      name: "wanderers-guide",
      region: "us-east-1",
    };
  },
  stacks(app) {},
} satisfies SSTConfig;
