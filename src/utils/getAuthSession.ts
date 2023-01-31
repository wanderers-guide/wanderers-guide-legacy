import { createRouteData } from "solid-start";

export const getAuthSession = () => {
  return createRouteData(
    async (_, {}) => {
      return { user: { name: "fez" } };
    },
    { key: () => ["auth_user"] },
  );
};
