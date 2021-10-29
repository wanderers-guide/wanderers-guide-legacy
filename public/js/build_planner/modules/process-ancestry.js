/* Copyright (C) 2021, Wanderer's Guide, all rights reserved.
    By Aaron Cassar.
*/

function processAncestry() {

  const charAncestry = getCharAncestry();
  if(charAncestry != null){

    // Process initial ancestry stats //
    $(`#initial-stats-ancestry`).append(`
    
      <div class="pt-1">
        <div class="pos-relative">
          <div class="">
            <p class="text-center"><span class="is-size-4 has-text-weight-semibold">Ancestry</span></p>
            <div class="ability-text-section px-1">
              <p class="p-1 pl-2 has-text-center-justified is-size-6">These are the initial options given by your ancestry.</p>
            </div>
          </div>
        </div>

        <div class="columns is-tablet">
          <div class="column text-center">
            <p class="title-font is-bold">Boosts</p>
            <p id="ancestry-initial-stats-display-boosts"></p>
          </div>
          <div class="column text-center">
            <p class="title-font is-bold">Flaws</p>
            <p id="ancestry-initial-stats-display-flaws"></p>
          </div>
        </div>
        <div class="columns is-tablet">
          <div class="column text-center">
            <p class="title-font is-bold">Hit Points</p>
            <p id="ancestry-initial-stats-display-hitPoints"></p>
          </div>
          <div class="column text-center">
            <p class="title-font is-bold">Size</p>
            <p id="ancestry-initial-stats-display-size"></p>
          </div>
        </div>
        <div class="columns is-tablet">
          <div class="column text-center">
            <p class="title-font is-bold">Speed</p>
            <p id="ancestry-initial-stats-display-speed"></p>
          </div>
          <div class="column text-center">
            <p class="title-font is-bold">Languages</p>
            <p id="ancestry-initial-stats-display-languages"></p>
          </div>
        </div>
        <div class="columns is-tablet">
          <div class="column text-center">
            <p class="title-font is-bold">Senses</p>
            <p id="ancestry-initial-stats-display-senses"></p>
          </div>
          <div class="column text-center">
            <p class="title-font is-bold">Extra Features</p>
            <p id="ancestry-initial-stats-display-physicalFeatures"></p>
          </div>
        </div>

        <hr class="mt-1 mb-0 mx-5">
        <div class="mx-5 my-1">
          <div id="ancestry-initial-stats-code-boosts"></div>
          <div id="ancestry-initial-stats-code-flaws"></div>
          <div id="ancestry-initial-stats-code-hitPoints"></div>
          <div id="ancestry-initial-stats-code-size"></div>
          <div id="ancestry-initial-stats-code-speed"></div>
          <div id="ancestry-initial-stats-code-languages"></div>
          <div id="ancestry-initial-stats-code-senses"></div>
          <div id="ancestry-initial-stats-code-physicalFeatures"></div>
        </div>
        <hr class="mt-0 mb-1 mx-0" style="height: 1px;">
      </div>
    
    `);
    processAncestryStats(charAncestry, {

      boosts: {
        displayID: 'ancestry-initial-stats-display-boosts',
        codeID: 'ancestry-initial-stats-code-boosts',
      },
      flaws: {
        displayID: 'ancestry-initial-stats-display-flaws',
        codeID: 'ancestry-initial-stats-code-flaws',
      },
  
      hitPoints: {
        displayID: 'ancestry-initial-stats-display-hitPoints',
        codeID: 'ancestry-initial-stats-code-hitPoints',
      },
      size: {
        displayID: 'ancestry-initial-stats-display-size',
        codeID: 'ancestry-initial-stats-code-size',
      },
      speed: {
        displayID: 'ancestry-initial-stats-display-speed',
        codeID: 'ancestry-initial-stats-code-speed',
      },

      languages: {
        displayID: 'ancestry-initial-stats-display-languages',
        codeID: 'ancestry-initial-stats-code-languages',
      },
      senses: {
        displayID: 'ancestry-initial-stats-display-senses',
        codeID: 'ancestry-initial-stats-code-senses',
      },
      physicalFeatures: {
        displayID: 'ancestry-initial-stats-display-physicalFeatures',
        codeID: 'ancestry-initial-stats-code-physicalFeatures',
      },
  
    }, PROCESS_ANCESTRY_STATS_TYPE.BOTH);

  }

}