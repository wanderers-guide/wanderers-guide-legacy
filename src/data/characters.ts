import { createServerData$ } from "solid-start/server";
import { prismaClient } from "~/components/clients/prisma";
import { type characters } from "@prisma/client";

const isCharacterPlayable = (
  character: Pick<
    characters,
    "name" | "ancestryID" | "backgroundID" | "classID"
  >,
) => {
  return (
    character.name != null &&
    character.ancestryID != null &&
    character.backgroundID != null &&
    character.classID != null
  );
};

export interface CharacterListDetails {
  id: number;
  name: string | null;
  ancestry: string | null;
  heratige: string | null;
  background: string | null;
  className: string | null;
  level: number | null;
  imageUrl: string | null;
  isPlayable: boolean;
}

export const getUserCharList$ = () => {
  return createServerData$(
    async (
      _,
      { request },
    ): Promise<{
      isPatreonMember: boolean;
      characters: CharacterListDetails[];
      characterLimit: number | null;
    }> => {
      const user = await prismaClient.users.findUnique({
        where: { id: 1 },
        select: {
          id: true,
          isPatreonMember: true,
          characters: {
            select: {
              id: true,
              name: true,
              level: true,
              ancestryID: true,
              backgroundID: true,
              classID: true,
              ancestries: { select: { name: true } },
              heritages: { select: { name: true } },
              backgrounds: { select: { name: true } },
              infoJSON: true,
              classes: {
                select: {
                  name: true,
                },
              },
            },
          },
        },
      });

      return {
        isPatreonMember: !!user?.isPatreonMember,
        characterLimit: user?.isPatreonMember ? 6 : null,
        characters:
          user?.characters?.map((char) => {
            const { imageURL } = JSON.parse(char.infoJSON ?? "{}");

            return {
              id: char.id,
              name: char.name,
              ancestry: char.ancestries?.name ?? null,
              heratige: char.heritages?.name ?? null,
              background: char.backgrounds?.name ?? null,
              level: char.level,
              className: char.classes?.name ?? null,
              imageUrl: imageURL,
              isPlayable: isCharacterPlayable(char),
            };
          }) ?? [],
      };
    },
  );
};
