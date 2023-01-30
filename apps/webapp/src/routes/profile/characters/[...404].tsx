import { A } from "solid-start";

export default function NotFound() {
  return (
    <main class="text-center mx-auto text-white p-4">
      <h1 class="max-6-xs text-6xl text-sky-400 font-thin uppercase my-16">
        Not Found
      </h1>
      <p class="mt-8">
        Visit{" "}
        <a
          href="https://solidjs.com"
          target="_blank"
          class="text-sky-400 hover:underline"
        >
          solidjs.com
        </a>{" "}
        to learn how to build Solid apps.
      </p>
    </main>
  );
}
