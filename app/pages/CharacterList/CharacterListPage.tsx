import * as React from "react";
import { Header } from "../../components";
import { CharacterCard } from "./components/CharacterCard";
import { UserPlusIcon, ArrowUpTrayIcon } from "@heroicons/react/24/solid";

export function CharacterList() {
  const [state, setState] = React.useState<any>({
    status: "idle",
    characters: [],
  });

  console.log("satte: ", state);

  React.useEffect(() => {
    setState({
      ...state,
      status: "loading",
    });

    fetch("/api/profile/characters")
      .then((res) => res.json())
      .then((data) => {
        console.log("data: ", data);
        setState({
          ...state,
          status: "success",
          characters: data,
        });
      });
  }, []);

  return (
    <div className="bg-zinc-900 h-full min-h-screen px-4 text-zinc-200">
      <Header />

      <main>
        <section className="flex justify-between border-b border-zinc-600 items-center py-3">
          <h1 className="text-3xl">Characters</h1>

          <div className="flex gap-2">
            <a
              className="is-size-3 is-pulled-right"
              href="/profile/characters/add"
            >
              <UserPlusIcon height={32} />
            </a>
            <button>
              <ArrowUpTrayIcon height={32} />
            </button>
          </div>
        </section>

        <section>
          {state.status === "loading" && <div>Loading...</div>}

          {state.status === "success" && state.characters.length === 0 && (
            <div>No characters found</div>
          )}

          {state.status === "success" && state.characters.length > 0 && (
            <div className="flex flex-wrap gap-3 py-4">
              {state.characters.map((character: any) => {
                return (
                  <CharacterCard key={character.id} character={character} />
                );
              })}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
