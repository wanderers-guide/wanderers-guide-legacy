import { createRouteData } from "solid-start";

interface Character {
  id: number;
  userId: number;
  name: string;
  level: number;
  isPlayable: boolean;
  heritageName: string;
  className: string;
}

export const charactersData = () => {
  return createRouteData(async () => {
    const result = await fetch("/api/profile/characters");
    const data = await result.json();

    return data as Character[];
  });
};
