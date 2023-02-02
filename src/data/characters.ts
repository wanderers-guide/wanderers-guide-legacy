import { createRouteData } from "solid-start";

export interface Character {
  id: number;
  userId: number;
  name: string;
  level: number;
  isPlayable: boolean;
  heritageName: string;
  className: string;
}

export const getCharactersData = () => {
  return createRouteData(async () => {
    const result = await fetch("/api/profile/characters");
    const data = await result.json();

    return data as Character[];
  });
};
