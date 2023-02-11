import { StackContext, StaticSite } from "sst/constructs";

export function Frontend({ stack }: StackContext) {
  const site = new StaticSite(stack, "Site", {
    path: "services/webapp/",
  });

  // Add the site's URL to stack output
  stack.addOutputs({
    URL: site.url ?? "http://localhost:5173",
  });
}
