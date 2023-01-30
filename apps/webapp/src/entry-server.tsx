import { getSession } from "@auth/solid-start";
import { redirect } from "solid-start";
import {
  StartServer,
  createHandler,
  renderAsync,
} from "solid-start/entry-server";
import { authOpts } from "./routes/api/auth/[...solidAuth]";

const protectedPaths = ["/protected"]; // add any route you wish in here

export default createHandler(
  ({ forward }) => {
    return async (event) => {
      if (protectedPaths.includes(new URL(event.request.url).pathname)) {
        const session = await getSession(event.request, authOpts);
        if (!session) {
          return redirect("/");
        }
      }
      return forward(event);
    };
  },
  renderAsync((event) => <StartServer event={event} />),
);
