import { A, createRouteData, useRouteData } from "solid-start";

export const routeData = () => {
  return createRouteData(
    async () => {
      const result = await fetch("/api/profile/characters");
      const data = await result.json();
      return data;
    },
    {
      key: ["characters"],
    },
  );
};

export default function Home() {
  const characters = useRouteData<typeof routeData>();

  return (
    <main class="flex flex-col items-center mx-auto text-white p-4">
      <h1 class="max-6-xs text-6xl text-sky-400 font-thin uppercase my-16">
        Hello world!
      </h1>

      <div class="mt-8">
        {characters.loading && (
          <>
            <span>Loading...</span>
          </>
        )}
        <pre class="font-mono">{JSON.stringify(characters(), null, 2)}</pre>
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
      </p>
    </main>
  );
}
