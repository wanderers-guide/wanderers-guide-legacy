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
    <main class="mx-auto mb-32 max-w-7xl md:mt-20">
      <div class="mb-6 px-4 pt-8">
        <h1 class="mb-2">Characters</h1>
        <hr class="border-zinc-600" />
      </div>
      <ul class="mx-auto flex flex-col gap-8 px-4 md:max-w-lg">
        <For each={characters()}>{CharacterCard}</For>
      </ul>
    </main>
  );
}

const CharacterCard: Component<CharacterListDetails> = (props) => {
  return (
    <li class="grid grid-cols-3 justify-start">
      <div class="relative col-span-1 col-start-1 row-span-3 row-start-1 ">
        <img
          class="h-24 w-24 overflow-hidden rounded-full object-cover ring-4 ring-zinc-700 ring-offset-4 ring-offset-zinc-800"
          src={props.imageUrl ?? "/images/fb_profile_pic.png"}
          width={96}
          height={96}
        />
        <div class="absolute -bottom-2 -left-2 flex h-6 w-6 items-center justify-center rounded-full bg-sky-600">
          <span class="text-sm">{props.level}</span>
        </div>
      </div>
      <div class="col-start-1 col-end-4 row-span-1 row-start-2 ml-12 rounded-md bg-zinc-700 py-2 pr-4 pl-16">
        <h2 class="text-lg">{props.name}</h2>
        <h3 class="text-sm text-zinc-300">
          {props.heratige ?? " - "} | {props.className ?? " - "}
        </h3>
        <div class="mt-1 flex flex-row justify-end gap-4">
          <button>Edit</button>
          <button>Options</button>
          <button>Open</button>
        </div>
      </div>
    </li>
  );
};
