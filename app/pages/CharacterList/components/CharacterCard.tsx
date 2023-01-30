import * as React from "react";
import {
  PencilIcon,
  WrenchIcon,
  EllipsisHorizontalIcon,
  TrashIcon,
} from "@heroicons/react/24/solid";

function CardTab({ href, onClick, children }: any) {
  if (href) {
    return (
      <a
        href={href}
        className="flex justify-center flex-1 py-2 px-4 hover:bg-zinc-700"
      >
        {children}
      </a>
    );
  }

  return (
    <button
      onClick={onClick}
      className="flex justify-center flex-1 py-2 px-4 hover:bg-zinc-700"
    >
      {children}
    </button>
  );
}

export function CharacterCard({ character }: any) {
  return (
    <div className="w-full sm:max-w-[300px] bg-neutral-800">
      <a
        href={`/profile/characters/${character.id}`}
        className="flex flex-col p-4 gap-3 hover:bg-zinc-700"
      >
        <p className="text-xl">{character.name}</p>
        <div className="flex items-center gap-2 text-opacity-75 text-sm">
          <p>Lvl {character.level}</p>
          {character.heritageName && (
            <>
              <span>|</span>
              <p>{character.heritageName}</p>
            </>
          )}
          {character.className && (
            <>
              <span>|</span>
              <p>{character.className}</p>
            </>
          )}
        </div>
      </a>
      <div className="flex bg-neutral-800 border-t border-zinc-700">
        <CardTab
          href={`/profile/characters/builder/basics/?id=${character.id}`}
        >
          {character.isPlayable ? (
            <span className="flex gap-2 items-center">
              <p className="text-sm">Edit</p>
              <PencilIcon height={16} />
            </span>
          ) : (
            <span className="flex gap-2 items-center">
              <p className="text-sm">Continue</p>
              <WrenchIcon height={16} />
            </span>
          )}
        </CardTab>
        <CardTab onClick={() => {}}>
          <EllipsisHorizontalIcon height={16} />
        </CardTab>
        <CardTab onClick={() => {}}>
          <TrashIcon height={16} />
        </CardTab>
      </div>
    </div>
  );
}
