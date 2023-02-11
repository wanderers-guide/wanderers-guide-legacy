import { SSTConfig } from "sst";
import { Frontend } from "./stacks/Frontend";

export default {
  config(_input) {
    return {
      name: "wanderers-guide",
    };
  },
  stacks(app) {
    app.stack(Frontend);
  },
} satisfies SSTConfig;
