import { Component, JSX } from "solid-js";
import { Dynamic } from "solid-js/web";
import { A } from "solid-start";
import { BuildsSolidIcon } from "./icons/Builds";
import { CharactersSolidIcon } from "./icons/Characters";
import { GMToolsSolidIcon } from "./icons/GMTools";
import { HomebrewSolidIcon } from "./icons/Homebrew";
import { SearchSolidIcon } from "./icons/Search";

const NavButton: Component<{
  href: string;
  children: JSX.Element;
  internal?: boolean;
}> = (props) => {
  const Tag = props.internal ? A : "a";
  return (
    <Dynamic
      component={Tag}
      href={props.href}
      class={`group outline-none hover:text-sky-400`}
      inactiveClass="text-zinc-400"
      activeClass="text-white font-semibold"
    >
      <div class="flex flex-col flex-nowrap items-center gap-1 rounded-sm p-1 group-focus:bg-zinc-700 group-focus:text-sky-300 sm:p-2 md:rounded lg:flex-row lg:gap-3 lg:px-3">
        {props.children}
      </div>
    </Dynamic>
  );
};

export default function SolidNav() {
  return (
    <header class="fixed bottom-0 left-0 right-0 bg-zinc-900 md:top-0 md:bottom-auto">
      <div class="mx-auto flex max-w-7xl flex-row flex-nowrap items-center justify-between px-4 py-3 text-white sm:gap-8 lg:px-8">
        <div>
          <a href="/" class="flex flex-row flex-nowrap items-center gap-3">
            <img
              src="/images/favicon.svg"
              alt="wanderer's guide home"
              class="h-10 w-10"
              height={40}
              width={40}
            />
            <h1 class="hidden font-serif text-lg font-bold md:block lg:text-xl">
              Wanderer's Guide
            </h1>
          </a>
        </div>
        <nav class="flex-1 sm:flex-initial md:ml-auto">
          <ul class="flex flex-row flex-nowrap items-center justify-center gap-3 sm:gap-4">
            <li>
              <NavButton href="/profile/characters" internal>
                <CharactersSolidIcon class="h-6 w-6" />
                <span class="hidden text-xs sm:block lg:text-sm">
                  Characters
                </span>
              </NavButton>
            </li>
            <li>
              <NavButton href="/builds">
                <BuildsSolidIcon class="h-6 w-6" />
                <span class="hidden text-xs sm:block lg:text-sm">Builds</span>
              </NavButton>
            </li>
            <li>
              <NavButton href="/homebrew">
                <HomebrewSolidIcon class="h-6 w-6" />
                <span class="hidden text-xs sm:block lg:text-sm">Homebrew</span>
              </NavButton>
            </li>
            <li>
              <NavButton href="/gm-tools">
                <GMToolsSolidIcon class="h-6 w-6" />
                <span class="hidden text-xs sm:block lg:text-sm">GM Tools</span>
              </NavButton>
            </li>
            <li>
              <NavButton href="/browse">
                <SearchSolidIcon class="h-6 w-6" />
                <span class="hidden text-xs sm:block lg:text-sm">Search</span>
              </NavButton>
            </li>
          </ul>
        </nav>
        <div>
          <div class="h-10 w-10 rounded-full bg-white"></div>
        </div>
      </div>
    </header>
  );
}
