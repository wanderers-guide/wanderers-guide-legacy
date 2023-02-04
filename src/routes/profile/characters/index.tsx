import classname from "classnames";
import { Component, For } from "solid-js";
import { createRouteData, useRouteData } from "solid-start";
import { type CharacterListDetails } from "~/data/characters";

export const routeData = () => {
  return createRouteData(async () => {
    const result = await fetch("/api/profile/characters");
    const data = await result.json();
    return data as {
      isPatreonMember: boolean;
      characters: CharacterListDetails[];
      characterLimit: number | null;
    };
  }, {});
};

export default function CharacterNew() {
  const characterList = useRouteData<typeof routeData>();

  return (
    <main class="mx-auto mb-32 max-w-7xl md:mt-20">
      <div class="mx-auto mb-6 max-w-xl px-4 pt-8">
        <div class="mb-2 flex flex-row">
          <h1 class="text-xl">Characters</h1>
          <span class="ml-auto text-xl">
            {characterList()?.characters.length} /{" "}
            {characterList()?.characterLimit === null
              ? "∞"
              : characterList()?.characterLimit}
          </span>
        </div>
        <hr class="border-zinc-600" />
      </div>
      <ul class="mx-auto flex flex-col gap-8 px-4 md:max-w-lg">
        <For each={characterList()?.characters}>{CharacterCard}</For>
      </ul>
    </main>
  );
}

const CharacterCard: Component<CharacterListDetails> = (props) => {
  let continueLinkRef: HTMLLinkElement | undefined = undefined;
  let editLinkRef: HTMLLinkElement | undefined = undefined;
  let optionsButtonRef: Element | undefined = undefined;
  let openLinkRef: HTMLLinkElement | undefined = undefined;

  return (
    <li
      class="group grid cursor-pointer grid-cols-3 justify-start"
      onClick={(e) => {
        if (
          [
            continueLinkRef,
            editLinkRef,
            optionsButtonRef,
            openLinkRef,
          ].includes(e.target)
        ) {
          return;
        }

        props.isPlayable ? openLinkRef?.click() : continueLinkRef?.click();
      }}
    >
      <div class="relative z-10 col-span-1 col-start-1 row-span-3 row-start-1 transition-all group-hover:scale-110">
        <img
          class={classname(
            "h-24 w-24 overflow-hidden rounded-full bg-zinc-700 object-cover ring-4 ring-zinc-700 ring-offset-4 ring-offset-zinc-800 group-hover:ring-sky-400",
            { grayscale: !props.isPlayable },
          )}
          src={props.imageUrl ?? "/images/fb_profile_pic.png"}
          width={96}
          height={96}
        />
        <div class="absolute -bottom-2 -left-2 flex h-8 w-8 items-center justify-center rounded-full bg-sky-600">
          <span class="text-sm">{props.level}</span>
        </div>
      </div>
      <div class="col-start-1 col-end-4 row-span-1 row-start-2 ml-14 rounded-md bg-zinc-700 py-2 pr-4 pl-16">
        <h2 class="overflow-hidden text-ellipsis whitespace-nowrap text-lg">
          {props.name}
        </h2>
        <h3 class="text-sm text-zinc-300">
          {(props.heratige || props.ancestry) ?? (
            <span class="italic">Ancestry</span>
          )}{" "}
          | {props.className ?? <span class="italic">Class</span>}
        </h3>
        <div class="mt-1 flex flex-row justify-end gap-4">
          {props.isPlayable && (
            <a
              class="text-zinc-300 hover:font-semibold hover:text-zinc-100 hover:underline"
              href={`/profile/characters/builder/basics/?id=${props.id}`}
              ref={editLinkRef}
            >
              Edit
            </a>
          )}

          <button
            class="text-zinc-300 hover:font-semibold hover:text-zinc-100 hover:underline"
            ref={optionsButtonRef}
          >
            Options
          </button>

          {props.isPlayable ? (
            <a
              href={`/profile/characters/${props.id}`}
              ref={openLinkRef}
              class="hover:font-semibold hover:text-sky-400 hover:underline"
            >
              Open
            </a>
          ) : (
            <a
              href={`/profile/characters/builder/basics/?id=${props.id}`}
              ref={continueLinkRef}
              class="hover:font-semibold hover:text-sky-400 hover:underline"
            >
              Continue
            </a>
          )}
        </div>
      </div>
    </li>
  );
};
