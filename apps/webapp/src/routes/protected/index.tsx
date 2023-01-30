import { useRouteData } from "solid-start";
import { getAuthSession } from "~/utils/getAuthSession";

export function routeData() {
  const session = getAuthSession();

  return { session };
}

export default function Protected() {
  const { session } = useRouteData<typeof routeData>();

  return (
    <div>
      <h1>This is a protected session!</h1>
      <div>You are logged in as {session()?.user?.name}</div>
    </div>
  );
}
