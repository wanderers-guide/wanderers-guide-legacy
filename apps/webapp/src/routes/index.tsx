import { A } from "solid-start";
import Counter from "~/components/Counter";
import { signIn, signOut } from "@auth/solid-start/client";
import { getAuthSession } from "~/utils/getAuthSession";

const logout = () => signOut();
const login = () => signIn("github");

export default function Home() {
  const session = getAuthSession();
  const user = () => session()?.user;

  return (
    <main class="text-center mx-auto text-white p-4">
      <h1 class="max-6-xs text-6xl text-sky-400 font-thin uppercase my-16">
        Hello world!
      </h1>
      <Counter />

      <div class="mt-8">
        {user() && (
          <p class="text-lg">
            Logged in as <span class="text-teal-400"> {user()?.name} </span>
          </p>
        )}
      </div>

      <p class="mt-8">
        Visit{" "}
        <a
          href="https://solidjs.com"
          target="_blank"
          class="text-sky-600 hover:underline"
        >
          solidjs.com
        </a>{" "}
        to learn how to build Solid apps.
      </p>
      <p class="my-4">
        <span>Home</span>
        {" - "}
        <A href="/about" class="text-sky-600 hover:underline">
          About Page
        </A>{" "}
      </p>
    </main>
  );
}
