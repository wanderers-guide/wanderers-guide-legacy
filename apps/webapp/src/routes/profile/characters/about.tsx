import { A } from "solid-start";
import Counter from "~/components/Counter";
import { getAuthSession } from "~/utils/getAuthSession";

export default function Home() {
  return (
    <main class="text-center mx-auto text-white p-4">
      <h1 class="max-6-xs text-6xl text-sky-400 font-thin uppercase my-16">
        Hello about!
      </h1>
      <Counter />

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
        <A href=".." class="text-sky-600 hover:underline">
          Home
        </A>
        {" - "}
        <span>About Page</span>
      </p>
    </main>
  );
}
