import { HttpStatusCode } from "solid-start/server";

export default function NotFound() {
  return (
    <main class="mx-auto p-4 text-center text-white">
      <HttpStatusCode code={404} />
      <h1 class="max-6-xs my-16 text-6xl font-thin uppercase text-sky-400">
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
