import { StackContext, StaticSite, Api } from "sst/constructs";

export function Frontend({ stack }: StackContext) {
  const api = new Api(stack, "Api", {
    defaults: {},
    routes: {
      "GET /": "services/functions/src/lambda.handler",
    },
  });

  const site = new StaticSite(stack, "Site", {
    path: "services/webapp/",
    buildOutput: "dist",
    buildCommand: "npm run build",
    environment: {
      VITE_API_URL: api.url,
    },
  });

  // Add the site's URL to stack output
  stack.addOutputs({
    AppURL: site.url ?? "http://localhost:5173",
    ApiURL: api.url,
  });
}
