import { createRouteData, Stylesheet, useRouteData } from "solid-start";
import CharactersList from "~/components/CharactersList";
import { getCharactersData } from "~/data/characters";

export const routeData = () => {
  const characters = getCharactersData();

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

export default function Home() {
  const { characters, user, canMakeCharacter, characterLimit } =
    useRouteData<typeof routeData>();

  return (
    <>
      {/* HEAD */}
      <Stylesheet href="/css/character-list.css" />

      <div class="subpageloader is-hidden">
        <div class="lds-roller">
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
        </div>
      </div>

      {characters() && (
        <CharactersList
          characters={characters()!}
          canMakeCharacter={canMakeCharacter}
          characterLimit={characters()?.length ?? 0}
          isPatreonMember={user()?.isPatreonMember ?? false}
        />
      )}
    </>
  );
}
