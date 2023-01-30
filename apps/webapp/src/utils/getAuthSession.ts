import { createRouteData } from "solid-start";

export const getAuthSession = () => {
  return createRouteData(
    async (_, {}) => {
      return { user: { name: "Ben Chidlow" } };
    },
    { key: () => ["auth_user"] },
  );
};
