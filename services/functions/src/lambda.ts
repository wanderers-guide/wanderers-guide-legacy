import { ApiHandler } from "sst/node/api";

export const handler = ApiHandler(async (event) => {
  console.log("Hello world!");
  return {
    body: JSON.stringify({
      hello: "world",
      time: new Date().toString(),
    }),
    statusCode: 200,
    isBase64Encoded: false,
    cookies: [],
    headers: { "content-type": "application/json" },
  };
});
