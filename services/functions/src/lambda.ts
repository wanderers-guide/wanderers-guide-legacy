import { ApiHandler } from "sst/node/api";

export const handler = ApiHandler(async (_evt) => {
  console.log("Hello world!");
  return {
    body: `Hello world. The time is ${new Date().toString()}`,
  };
});
