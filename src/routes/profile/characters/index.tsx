import { Component, For } from "solid-js";
import { createRouteData, useRouteData } from "solid-start";
import { CharacterListDetails, getUserCharList$ } from "~/data/characters";

export const routeData = () => {
  const characters = getUserCharList$();

  const user = createRouteData(
    async () => {
      return { isPatreonMember: false };
    },
    {
      key: ["user"],
    },
  );
  return { characters, user, canMakeCharacter: true, characterLimit: 6 };
};

export default function CharacterNew() {
  const { characters } = useRouteData<typeof routeData>();

  return (
    <main class="mx-auto max-w-7xl">
      <div class="mt-4 mb-6 px-4">
        <h1 class="mb-2">Characters</h1>
        <hr class="border-zinc-600" />
      </div>
      <ul class="flex flex-col gap-4 px-4">
        <For each={characters()}>{CharacterCard}</For>
      </ul>
    </main>
  );
}

const CharacterCard: Component<CharacterListDetails> = (props) => {
  return (
    <li class="flex flex-col flex-nowrap gap-4 rounded border border-zinc-600 px-3 pt-4 pb-2 md:max-w-lg">
      <div class="flex flex-row flex-nowrap">
        <div class="flex-1">
          <h2 class="text-lg font-semibold">{props.name}</h2>
          <h3 class="text-sm text-zinc-400">
            <span>
              Lvl {props.level} | {props.heratige} {props.ancestry}{" "}
              {props.className}
            </span>
          </h3>
        </div>
      </div>
      <div class="flex flex-row flex-nowrap justify-between gap-3">
        <a
          href={`/profile/characters/builder/basics/?id=${props.id}`}
          class="flex-1 hover:font-semibold hover:underline"
        >
          Continue
        </a>
        <button class="text-zinc-400 hover:font-semibold hover:underline">
          Options
        </button>
        <a href="" class="text-zinc-400 hover:font-semibold hover:underline">
          Delete
        </a>
      </div>
    </li>
  );
};
