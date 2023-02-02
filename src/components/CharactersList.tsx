import { For, Portal, Show } from "solid-js/web";
import { Link, Stylesheet } from "solid-start";
import { Character } from "~/data/characters";
import BulmaAssets from "./static/BulmaAssets";

export default function CharactersList(props: {
  isPatreonMember: boolean;
  canMakeCharacter: boolean;
  characters: Character[];
  characterLimit: number;
}) {
  return (
    <>
      <main class="container">
        <div class="columns is-mobile is-centered is-vcentered is-marginless pt-3">
          <div class="column is-5 is-paddingless" style="white-space: nowrap;">
            <h1 class="is-size-2 is-inline-block has-txt-value-string title-font">
              Characters
            </h1>
            {!props.isPatreonMember && (
              <span
                class="is-size-5 has-tooltip-bottom has-tooltip-multiline has-txt-listing ml-3"
                data-tooltip="You can only have up to six characters at once. To get unlimited characters, support us and what we're doing on Patreon!"
              >
                ({props.characters.length ?? "-"}/{props.characterLimit})
              </span>
            )}
          </div>
          <div class="column is-5 is-paddingless">
            <Show
              when={props.canMakeCharacter}
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
                    class="button is-rounded is-small is-hidden-mobile is-pulled-right mx-3 mt-2"
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
            when={props.characters.length}
            fallback={
              <div class="column">
                <p class="has-text-centered is-italic">
                  You have no characters.
                </p>
              </div>
            }
          >
            <For each={props.characters}>
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
                        <p class="is-size-7 text-overflow-ellipsis pl-4">
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
            <footer class="modal-card-foot is-paddingless field is-grouped is-grouped-centered p-3">
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
                {props.canMakeCharacter ? (
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

      {/* <Portal mount={document.head}> */}
      <BulmaAssets />

      {/* Bootstrap-Core */}
      <Stylesheet
        href="https://cdn.jsdelivr.net/npm/bootstrap@4.6.2/dist/css/bootstrap.min.css"
        integrity="sha384-xOolHFLEh07PJGoPkLv1IbcEPTNtaed2xpHsD9ESMhqIYd0nLMwNLD69Npy4HI+N"
        crossorigin="anonymous"
      />
      <Stylesheet href="/css/bootstrap-4-utilities.min.css" />

      {/* Font-Awesome-Icons */}
      <script
        defer
        type="text/javascript"
        src="https://pro.fontawesome.com/releases/v5.12.1/js/all.js"
      ></script>

      {/* General Styles */}
      <Stylesheet
        href="/css/core/site-themes-dark.css"
        type="text/css"
        media="all"
      />
      {/* <Stylesheet
          href="/css/core/site-themes-light.css"
          type="text/css"
          media="all"
        /> */}

      <Stylesheet
        href="/css/core/system-styles.css"
        type="text/css"
        media="all"
      />
      <Stylesheet href="/css/pageloader.css" type="text/css" media="all" />
      <Stylesheet href="/css/chosen/chosen.css" type="text/css" media="all" />
      <Stylesheet
        href="/css/core/bulma-extension.css"
        type="text/css"
        media="all"
      />
      <Stylesheet href="/css/core/fonts.css" type="text/css" media="all" />
      <Stylesheet href="/css/core/modals.css" type="text/css" media="all" />
      <Stylesheet href="/css/core/quickviews.css" type="text/css" media="all" />

      {/* General Utils */}
      <script type="text/javascript" src="/js/general-utils.js"></script>
      <script type="text/javascript" src="/js/cache-storing.js"></script>
      <script
        type="text/javascript"
        src="https://cdnjs.cloudflare.com/ajax/libs/mathjs/9.3.0/math.js"
      ></script>

      {/* Loading Bars/Spinners  */}
      <Stylesheet href="/css/loading-bar.css" />
      <script
        type="text/javascript"
        src="/js/loading_bar/loadingHandler.js"
      ></script>
      <script
        type="text/javascript"
        src="/js/loading_bar/loading-bar.js"
      ></script>

      {/* Quill JS  */}
      <Stylesheet href="https://cdn.quilljs.com/1.3.6/quill.snow.css" />
      <Stylesheet href="/css/quill.css" />
      <script
        type="text/javascript"
        src="https://cdn.quilljs.com/1.3.6/quill.js"
      ></script>

      {/* Web-Fonts */}
      <Link rel="preconnect" href="https://fonts.googleapis.com" />
      <Link
        rel="preconnect"
        href="https://fonts.gstatic.com"
        crossorigin="anonymous"
      />
      <Stylesheet href="https://fonts.googleapis.com/css?family=Nunito+Sans:200,200i,300,300i,400,400i,600,600i,700,700i,800,800i,900,900i&amp;subset=latin-ext,vietnamese" />
      <Stylesheet href="https://fonts.googleapis.com/css?family=Roboto+Condensed:300,300i,400,400i,700,700i&amp;subset=cyrillic,cyrillic-ext,greek,greek-ext,latin-ext,vietnamese" />
      <Stylesheet href="https://fonts.googleapis.com/css?family=Noto+Sans&display=swap" />
      <Stylesheet href="https://fonts.googleapis.com/css?family=Bebas+Neue&display=swap" />
      <Stylesheet href="https://fonts.googleapis.com/css2?family=Nanum+Gothic+Coding&display=swap" />
      <Stylesheet href="https://fonts.googleapis.com/css2?family=Proza+Libre&display=swap" />
      <Stylesheet href="https://fonts.googleapis.com/css2?family=Open+Sans&display=swap" />

      {/* Socket IO */}
      <script type="text/javascript" src="/socket.io/socket.io.js"></script>

      {/* jQuery */}
      <script
        type="text/javascript"
        src="https://ajax.googleapis.com/ajax/libs/jquery/3.4.0/jquery.min.js"
      ></script>
      <script
        type="text/javascript"
        src="https://code.jquery.com/ui/1.12.1/jquery-ui.min.js"
      ></script>
      <script
        type="text/javascript"
        src="/js/jQuery/jquery.ui.touch-punch.min.js"
      ></script>
      <script
        type="text/javascript"
        src="/js/jQuery/chosen.jquery.min.js"
      ></script>

      {/* Mobile View Message  */}
      <script type="text/javascript" src="/js/mobile-view.js"></script>

      {/* Misc Scripts  */}
      <script type="text/javascript" src="/js/back-to-top.js"></script>
      <script type="text/javascript" src="/js/show-more.js"></script>

      <script
        type="text/javascript"
        src="https://unpkg.com/pdf-lib/dist/pdf-lib.min.js"
      />
      <script type="text/javascript" src="https://unpkg.com/downloadjs@1.4.7" />
      <script
        type="text/javascript"
        src="https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.8.0/html2pdf.bundle.min.js"
      />

      <script type="text/javascript" src="/js/character-list.js" />

      <script type="text/javascript" src="/js/require-signin.js" />

      <script type="text/javascript" src="/js/char_export/export-handler.js" />
      <script
        async
        type="text/javascript"
        src="/js/char_export/populate-pdf.js"
      />
      <script type="application/pdf" src="/pdf/character_sheet.pdf"></script>
      {/* </Portal> */}
    </>
  );
}
