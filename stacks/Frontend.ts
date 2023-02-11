import { StackContext, StaticSite, Api } from "sst/constructs";

export function Frontend({ stack }: StackContext) {
  const api = new Api(stack, "Api", {
    routes: {
      "GET /": "services/functions/src/lambda.handler",
    },
  });

  const site = new StaticSite(stack, "Site", {
    path: "services/webapp/",
    environment: {
      VITE_API_URL: api.url,
    },
  });

  // Add the site's URL to stack output
  stack.addOutputs({
    APP_URL: site.url ?? "http://localhost:5173",
    API_URL: api.url,
  });
}
