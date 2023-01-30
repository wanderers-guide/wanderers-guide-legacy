import { SolidAuth, type SolidAuthConfig } from "@auth/solid-start";
import Reddit from "@auth/core/providers/reddit";
import GitHub from "@auth/core/providers/github";

export const authOpts: SolidAuthConfig = {
  providers: [
    // Something is wrong here, not sure what
    // @ts-ignore
    Reddit({
      clientId: process.env.REDDIT_AUTH_CLIENT_ID!,
      clientSecret: process.env.REDDIT_AUTH_CLIENT_SECRET!,
    }),
    // @ts-ignore
    GitHub({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    }),
  ],
  debug: false,
};

export const { GET, POST } = SolidAuth(authOpts);
