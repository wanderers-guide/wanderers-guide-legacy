import { App } from "sst/constructs";

const protectedStages = ["dev", "prod"];

export const isPersonalStack = (app: App) => {
  if (protectedStages.includes(app.stage)) return false;
  return true;
};
