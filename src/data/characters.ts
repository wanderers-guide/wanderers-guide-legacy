import { createServerData$ } from "solid-start/server";
import { prismaClient } from "~/components/clients/prisma";

export interface CharacterListDetails {
  id: number;
  name: string | null;
  ancestry: string | null;
  heratige: string | null;
  background: string | null;
  className: string | null;
  level: number | null;
  imageUrl: string | null;
}

export const getUserCharList$ = () => {
  return createServerData$(
    async (_, { request }): Promise<CharacterListDetails[]> => {
      const characters = await prismaClient.characters.findMany({
        where: { userID: 1 },
        select: {
          id: true,
          name: true,
          level: true,
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
      });

      return characters.map(
        ({
          id,
          name,
          ancestries,
          heritages,
          backgrounds,
          classes,
          level,
          infoJSON,
        }) => {
          const { imageURL } = JSON.parse(infoJSON ?? "{}");

          return {
            id,
            name,
            ancestry: ancestries?.name ?? null,
            heratige: heritages?.name ?? null,
            background: backgrounds?.name ?? null,
            level,
            className: classes?.name ?? null,
            imageUrl: imageURL,
          };
        },
      );
    },
  );
};
