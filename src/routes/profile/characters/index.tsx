import { For, Show } from "solid-js";
import { Portal } from "solid-js/web";
import { createRouteData, Stylesheet, useRouteData } from "solid-start";
import { charactersData } from "~/data/characters";

export const routeData = () => {
  const characters = charactersData();

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

      <main class="container">
        <div class="columns is-mobile is-centered is-vcentered pt-3 is-marginless">
          <div class="column is-5 is-paddingless" style="white-space: nowrap;">
            <h1 class="is-size-2 is-inline-block has-txt-value-string title-font">
              Characters
            </h1>
            {!user()?.isPatreonMember && (
              <span
                class="is-size-5 ml-3 has-tooltip-bottom has-tooltip-multiline has-txt-listing"
                data-tooltip="You can only have up to six characters at once. To get unlimited characters, support us and what we're doing on Patreon!"
              >
                ({characters()?.length ?? "-"}/{characterLimit})
              </span>
            )}
          </div>
          <div class="column is-5 is-paddingless">
            <Show
              when={canMakeCharacter}
              fallback={
                <>
                  <a class="is-size-3-5 is-pulled-right">
                    <label for="input-character-import">
                      <span
                        class="icon is-large has-text-danger has-tooltip-bottom"
                        data-tooltip="Import Character"
                      >
                        <i class="fas fa-upload cursor-clickable"></i>
                      </span>
                    </label>
                  </a>
                  <a class="is-size-3 is-pulled-right">
                    <span
                      class="icon is-large has-text-danger has-tooltip-bottom"
                      data-tooltip="Create Character"
                    >
                      <i class="fas fa-user-times"></i>
                    </span>
                  </a>

                  <a
                    href="https://www.patreon.com/bePatron?u=32932027"
                    target="_blank"
                    class="button is-rounded is-small is-hidden-mobile mt-2 mx-3 is-pulled-right"
                    style="background-color: rgb(255, 66, 77);color: white;"
                  >
                    <span class="icon is-small">
                      <i class="fab fa-patreon"></i>
                    </span>
                    <span>Become a patron</span>
                  </a>
                </>
              }
            >
              <a id="icon-character-import" class="is-size-3-5 is-pulled-right">
                <label for="input-character-import">
                  <span
                    class="icon is-large has-text-info has-tooltip-bottom"
                    data-tooltip="Import Character"
                  >
                    <i class="fas fa-upload cursor-clickable"></i>
                  </span>
                </label>
                <input
                  id="input-character-import"
                  type="file"
                  accept=".guidechar"
                />
              </a>
              <a
                class="is-size-3 is-pulled-right"
                href="/profile/characters/add"
              >
                <span
                  class="icon is-large has-text-info has-tooltip-bottom"
                  data-tooltip="Create Character"
                >
                  <i class="fas fa-user-plus"></i>
                </span>
              </a>
            </Show>
          </div>
        </div>
        <hr />

        <div class="columns is-centered is-multiline is-marginless mb-2">
          <Show
            when={characters()?.length}
            fallback={
              <div class="column">
                <p class="has-text-centered is-italic">
                  You have no characters.
                </p>
              </div>
            }
          >
            <For each={characters()}>
              {({ id, name, level, isPlayable, heritageName, className }) => (
                <div class="column is-4">
                  <div
                    class="card character-card is-unselectable"
                    data-char-id={id}
                    data-char-name={name}
                  >
                    <div class="card-content cursor-clickable pt-2">
                      <a href={`/profile/characters/${id}`}>
                        <span class="is-size-8 has-txt-noted char-id">
                          # {id}
                        </span>
                        <p class="is-size-5 has-txt-value-number text-overflow-ellipsis">
                          {name}
                        </p>
                        <p class="is-size-7 pl-4 text-overflow-ellipsis">
                          {" "}
                          Lvl {level} | {heritageName} {className}
                        </p>
                      </a>
                    </div>
                    <div class="card-footer is-paddingless">
                      <a class="card-footer-item character-card-edit has-txt-listing">
                        {isPlayable ? (
                          <>
                            <span class="character-card-edit-text is-size-6 pr-1">
                              Edit
                            </span>
                            <span class="icon is-small">
                              <i class="fas fa-sm fa-edit"></i>
                            </span>
                          </>
                        ) : (
                          <>
                            <span class="character-card-edit-text is-size-6 pr-1">
                              Continue
                            </span>
                            <span class="icon is-small">
                              <i class="fas fa-sm fa-wrench"></i>
                            </span>
                          </>
                        )}
                      </a>
                      <a class="card-footer-item character-card-options has-txt-listing">
                        <span class="character-card-options-text is-size-6 pr-1">
                          Options
                        </span>
                        <span class="icon is-small">
                          <i class="fas fa-sm fa-ellipsis-h"></i>
                        </span>
                      </a>
                      <a
                        class="card-footer-item character-card-delete has-txt-listing"
                        style="overflow: hidden;"
                      >
                        <span class="character-card-delete-text is-size-6 pr-1">
                          Delete
                        </span>
                        <span class="icon is-small">
                          <i class="fas fa-sm fa-trash"></i>
                        </span>
                      </a>
                    </div>
                  </div>
                </div>
              )}
            </For>
          </Show>
        </div>
      </main>

      <Portal>
        {/* Character Delete Modal */}
        <div class="modal modal-char-delete">
          <div class="modal-background"></div>
          <div class="modal-card">
            <header class="modal-card-head">
              <p
                id="modal-char-delete-title"
                class="modal-card-title is-size-4 has-txt-value-string"
              >
                Delete Character
              </p>
              <button
                class="delete modal-card-close"
                aria-label="close"
              ></button>
            </header>
            <section class="modal-card-body">
              <p class="has-txt-value-string has-text-centered">
                Are you sure you want to delete this character?
              </p>
            </section>
            <footer class="modal-card-foot is-paddingless p-3 field is-grouped is-grouped-centered">
              <p class="control">
                <a
                  class="button is-danger is-outlined"
                  id="delete-confirmation-btn"
                >
                  Delete
                </a>
              </p>
            </footer>
          </div>
        </div>
      </Portal>
      <Portal>
        {/* Character Options Modal */}
        <div class="modal modal-char-options">
          <div class="modal-background"></div>
          <div class="modal-card">
            <header class="modal-card-head">
              <p class="modal-card-title is-size-4 has-txt-value-number">
                Character Options
              </p>
              <button
                class="delete modal-card-close"
                aria-label="close"
              ></button>
            </header>
            <section class="modal-card-body pb-3">
              <div class="buttons is-centered">
                {canMakeCharacter ? (
                  <button id="btn-duplicate-character" class="button is-info">
                    <span>Create Copy</span>
                    <span class="icon">
                      <i class="fas fa-user-friends"></i>
                    </span>
                  </button>
                ) : (
                  <button class="button is-danger">
                    <span>Create Copy</span>
                    <span class="icon">
                      <i class="fas fa-user-friends"></i>
                    </span>
                  </button>
                )}
                <button id="btn-export-character" class="button is-info">
                  <span>Export</span>
                  <span class="icon">
                    <i class="fas fa-download"></i>
                  </span>
                </button>
                <button id="btn-export-to-pdf" class="button is-info">
                  <span>Export to PDF</span>
                  <span class="icon">
                    <i class="fas fa-file-pdf"></i>
                  </span>
                </button>
              </div>
            </section>
            <footer class="modal-card-foot"></footer>
          </div>
        </div>
      </Portal>
      <div id="character-pdf-container" class="is-hidden"></div>
    </>
  );
}
