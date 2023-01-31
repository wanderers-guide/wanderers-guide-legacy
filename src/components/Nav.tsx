import { A } from "solid-start";
import { getAuthSession } from "~/utils/getAuthSession";

export default function Nav() {
  const session = getAuthSession();
  const user = () => session()?.user;

  return (
    <nav class="bg-zinc-900 flex flex-row flex-nowrap gap-4 items-center px-8 py-3">
      <h1 class="text-lg text-white mr-8">Wanderer's Guide</h1>

      <ul class="flex-1 container flex items-center gap-4">
        <li>
          <a href="/" class="text-zinc-400 hover:text-white">
            Home
          </a>
        </li>

        {user() ? (
          <>
            <li>
              <A
                href="/profile/characters"
                class="text-zinc-400 hover:text-white"
              >
                My Charaters
              </A>
            </li>
            <li>
              <a href="/gm-tools" class="text-zinc-400 hover:text-white">
                GM Tools
              </a>
            </li>
            <li class="ml-auto">
              <button class="text-zinc-400 hover:text-white" onClick={() => {}}>
                Logout
              </button>
            </li>
          </>
        ) : (
          <>
            <li class="ml-auto">
              <button class="text-zinc-400 hover:text-white" onClick={() => {}}>
                Login
              </button>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
}
