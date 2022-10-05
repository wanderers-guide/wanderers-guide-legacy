/* Copyright (C) 2022, Wanderer's Guide, all rights reserved.
    By Aaron Cassar.
*/
class DisplayCampaign {
  constructor(containerID, campaignID, backButton = true, addToEncounterBtn = false) {
    startSpinnerSubLoader();

    let campaignDisplayContainerID = 'campaign-container-' + campaignID;
    $('#' + containerID).parent().append('<div id="' + campaignDisplayContainerID + '" class="generated-display-container m-4 is-hidden"></div>');
    $('#' + containerID).addClass('is-hidden');

    socket.emit('requestCampaignDetails', campaignID);
    socket.off('returnCampaignDetails');
    socket.on("returnCampaignDetails", function (campaignStruct, allConditions) {
      $('#' + campaignDisplayContainerID).load("/templates/display-campaign.html");
      $.ajax({
        type: "GET",
        url: "/templates/display-campaign.html",
        success: function (text) {
          stopSpinnerSubLoader();

          g_allConditions = allConditions.sort(
            function (a, b) {
              return a.name > b.name ? 1 : -1;
            }
          );

          if (backButton) {
            $('#campaign-back-btn').removeClass('is-hidden');
            $('#campaign-back-btn').click(function () {
              $('#' + campaignDisplayContainerID).remove();
              $('#' + containerID).removeClass('is-hidden');
            });
            $('.category-tabs li').click(function () {
              $('#' + campaignDisplayContainerID).remove();
              $('#' + containerID).removeClass('is-hidden');
            });
          }

          console.log(campaignStruct);

          $('#campaign-name').html(campaignStruct.campaign.name);

          textProcess_warningOnUnknown = true;
          $('#campaign-description').html(processText(campaignStruct.campaign.description, false, false, 'MEDIUM', false));
          textProcess_warningOnUnknown = false;

          if (campaignStruct.campaign.imageURL != null) {
            $('#campaign-artwork-img').removeClass('is-hidden');
            $('#campaign-artwork-img').attr('src', campaignStruct.campaign.imageURL);
          } else {
            $('#campaign-artwork-img').addClass('is-hidden');
            $('#campaign-artwork-img').attr('src', '');
          }

          let sourceStr = '<span class="has-txt-faded">#' + campaignStruct.campaign.id + '</span>';
          $('#campaign-source').html(sourceStr);

          $('#campaign-access-code').html(campaignStruct.campaign.accessID);

          ///

          for (const accessToken of campaignStruct.accessTokens) {

            $('#campaign-players').append(`
              <div id="campaign-player-entry-${accessToken.charID}"></div>
            `);

            // If has no calculatedStats, give temp details
            if (!accessToken.calculatedStat) {
              accessToken.calculatedStat = {
                maxHP: 9999,
                maxStamina: 9999,
                maxResolve: 99,
              };
            }
            if (!accessToken.calculatedStat.generalInfo) {
              accessToken.calculatedStat.generalInfo = {
                className: 'Unknown',
                heritageAncestryName: 'Unknown',
                backgroundName: 'Unknown',
                size: null,
                traits: [],
              };
            } else {
              accessToken.calculatedStat.generalInfo = JSON.parse(accessToken.calculatedStat.generalInfo);
            }
            if (!accessToken.calculatedStat.conditions) {
              accessToken.calculatedStat.conditions = [];
            } else {
              accessToken.calculatedStat.conditions = JSON.parse(accessToken.calculatedStat.conditions);
            }
            if (!accessToken.calculatedStat.totalSkills) {
              accessToken.calculatedStat.totalSkills = [];
            } else {
              accessToken.calculatedStat.totalSkills = JSON.parse(accessToken.calculatedStat.totalSkills);
            }
            if (!accessToken.calculatedStat.totalSaves) {
              accessToken.calculatedStat.totalSaves = [];
            } else {
              accessToken.calculatedStat.totalSaves = JSON.parse(accessToken.calculatedStat.totalSaves);
            }
            if (!accessToken.calculatedStat.totalAbilityScores) {
              accessToken.calculatedStat.totalAbilityScores = [];
            } else {
              accessToken.calculatedStat.totalAbilityScores = JSON.parse(accessToken.calculatedStat.totalAbilityScores);
            }
            if (!accessToken.calculatedStat.weapons) {
              accessToken.calculatedStat.weapons = [];
            } else {
              accessToken.calculatedStat.weapons = JSON.parse(accessToken.calculatedStat.weapons);
            }

            generateCharacterEntry(accessToken);

          }

          $('#' + campaignDisplayContainerID).removeClass('is-hidden');


          // Handle Character Updates //

          socket.on("sendCharacterUpdateToGM", function (charID, updates) {

            let accessToken = campaignStruct.accessTokens.find(accessToken => {
              return charID == accessToken.charID;
            });
            if (!accessToken) { return; }

            /* Data: (copy from remote-updates.js)
              hp - { value }
              temp-hp - { value }
              exp - { value }
              stamina - { value }
              resolve - { value }
              hero-points - { value }
              calculated-stats - g_calculatedStats
              char-info - charInfoJSON
              roll-history - rollHistoryJSON
            */

            for (let update of updates) {

              if (update.type == 'hp') {
                accessToken.character.currentHealth = update.data.value;
              } else if (update.type == 'temp-hp') {
                accessToken.character.tempHealth = update.data.value;
              } else if (update.type == 'exp') {
                accessToken.character.experience = update.data.value;
              } else if (update.type == 'stamina') {
                accessToken.character.currentStamina = update.data.value;
              } else if (update.type == 'resolve') {
                accessToken.character.currentResolve = update.data.value;
              } else if (update.type == 'hero-points') {
                accessToken.character.heroPoints = update.data.value;
              } else if (update.type == 'calculated-stats') {
                accessToken.calculatedStat = update.data;
              } else if (update.type == 'char-info') {
                accessToken.character.infoJSON = update.data;
              } else if (update.type == 'roll-history') {
                accessToken.character.rollHistoryJSON = update.data;
              }

            }

            generateCharacterEntry(accessToken);

            refreshQuickView(accessToken);

          });

        }
      });
    });
  }
}

function generateCharacterEntry(accessToken) {

  let input_characterCurrentHP = `character-input-hp-${accessToken.charID}`;

  let btn_characterAddCondition = `character-btn-condition-add-${accessToken.charID}`;
  let btn_characterView = `character-btn-view-${accessToken.charID}`;
  let btn_characterSheet = `character-btn-sheet-${accessToken.charID}`;
  let btn_characterDelete = `character-btn-delete-${accessToken.charID}`;

  let container_characterConditions = `character-container-conditions-${accessToken.charID}`;

  $(`#campaign-player-entry-${accessToken.charID}`).html(`
    <div class="columns is-marginless is-tablet p-2">
      <div class="column is-1 is-paddingless">
        <div class="" style="padding-left: 0.15rem; padding-right: 0.15rem; padding-top: 0.35rem; padding-bottom: 0.35rem;">
          <a href="/profile/characters/${accessToken.charID}" target="_blank" id="${btn_characterSheet}" class="button is-info is-very-small is-fullwidth is-outlined">
              <span class="">
                  Open Sheet
              </span>
              <sup class="icon is-small">
                <i class="fas fa-xs fa-external-link-alt"></i>
              </sup>
          </a>
        </div>
      </div>
      <div class="column is-3 text-left is-paddingless">
          <div style="padding-left: 0.15rem; padding-right: 0.15rem; padding-top: 0.2rem; padding-bottom: 0.2rem;">
              <p class="pl-2">${accessToken.character.name}</p>
          </div>
      </div>
      <div class="column is-1 is-paddingless">
          <div class="" style="padding-left: 0.15rem; padding-right: 0.15rem; padding-top: 0.35rem; padding-bottom: 0.35rem;">
              <button id="${btn_characterView}" class="button is-info is-very-small is-fullwidth">
                  <span class="">
                      Quick View
                  </span>
              </button>
          </div>
      </div>
      <div class="column is-2 text-center is-paddingless">
          <div class="field has-addons has-addons-centered" style="padding-left: 0.15rem; padding-right: 0.15rem; padding-top: 0.2rem; padding-bottom: 0.2rem;">
              <p class="control"><input id="${input_characterCurrentHP}" class="input is-small text-center" type="text"
                      min="0" max="${accessToken.calculatedStat.maxHP}" autocomplete="off" value="${accessToken.character.currentHealth}"></p>
              <p class="control"><a class="button is-static is-small border-darker">/</a></p>
              <p class="control"><a class="button is-static is-extra is-small border-darker">${accessToken.calculatedStat.maxHP}</a>
              </p>
          </div>
      </div>
      <div class="column is-4 text-left is-paddingless">
          <div class="is-inline-flex" style="padding-left: 0.15rem; padding-right: 0.15rem; padding-top: 0.07rem; padding-bottom: 0.07rem;">
            <div>
              <span id="${btn_characterAddCondition}" class="icon is-small has-text-info cursor-clickable my-2 ml-3 mr-2">
                <i class="fal fa-plus-circle"></i>
              </span>
            </div>
            <div id="${container_characterConditions}" class="is-flex" style="flex-wrap: wrap; padding-top: 0.3rem;">
            </div>
          </div>
      </div>
      <div class="column is-1 is-paddingless">
          <span id="${btn_characterDelete}" class="is-pulled-right icon is-medium has-text-danger mt-1 ml-2 cursor-clickable">
              <i class="fas fa-minus-circle"></i>
          </span>
      </div>
    </div>
    <hr class="my-0">
  `);


  // View //
  $(`#${btn_characterView}`).click(function () {
    g_characterViewOpenedTab_rollHistory = false;
    g_characterViewOpenedTab_charInfo = false;
    openQuickView('characterView', accessToken);
  });

  // HP //
  $(`#${input_characterCurrentHP}`).on('keypress', function (e) {
    if (e.which == 13) {
      $(`#${input_characterCurrentHP}`).blur();
    }
  });
  $(`#${input_characterCurrentHP}`).blur(function () {
    let newHP;
    try {
      newHP = parseInt(math.evaluate($(this).val()));
      if (newHP > accessToken.calculatedStat.maxHP) { newHP = accessToken.calculatedStat.maxHP; }
      if (newHP < 0) { newHP = 0; }
      if (isNaN(newHP)) { newHP = 0; }
    } catch (err) {
      newHP = 0;
    }
    $(this).val(newHP);
    socket.emit(`requestCharacterUpdate-Health`, accessToken.charID, newHP);
  });
  $(`#${input_characterCurrentHP}`).click(function (event) {
    event.stopImmediatePropagation();
  });

  // Delete //
  $(`#${btn_characterDelete}`).click(function () {
    new ConfirmMessage('Remove Character', `Are you sure you want to remove "${accessToken.character.name}" from the campaign?`, 'Remove', 'modal-char-leave-campaign', 'modal-char-leave-campaign-btn');
    $('#modal-char-leave-campaign-btn').click(function () {
      socket.emit("requestLeaveCampaign", accessToken.charID);
      $(`#campaign-player-entry-${accessToken.charID}`).remove();
    });
  });

  // Conditions //
  populateConditions(accessToken);

  $(`#${btn_characterAddCondition}`).click(function () {
    openSelectConditionsModal(accessToken);
  });

}

function populateConditions(accessToken) {

  let container_characterConditions = `character-container-conditions-${accessToken.charID}`;

  $(`#${container_characterConditions}`).html('');

  // Convert character conditions data to encounter conditions data format
  let convertedConditions = [];
  for (let condition of accessToken.calculatedStat.conditions) {
    convertedConditions.push({
      name: condition.name,
      value: condition.value,
      parentSource: condition.sourceText,
    });
  }

  for (let condition of getAppliedConditions(convertedConditions)) {
    let conditionDisplayName = capitalizeWords(condition.name);
    if (condition.value != null) { conditionDisplayName += ` ${condition.value}`; }

    let btn_characterConditionView = `character-btn-condition-view-${accessToken.charID}-${condition.name.replace(/\W/g, '_')}`;
    let btn_characterConditionDelete = `character-btn-condition-delete-${accessToken.charID}-${condition.name.replace(/\W/g, '_')}`;

    if (condition.parentSource) {
      $(`#${container_characterConditions}`).append(`
        <div class="field has-addons is-marginless" style="padding-right: 0.25rem;">
          <p class="control">
            <button id="${btn_characterConditionView}" class="button is-very-small is-danger is-outlined">
              <span>${conditionDisplayName}</span>
            </button>
          </p>
        </div>
      `);
    } else {
      $(`#${container_characterConditions}`).append(`
        <div class="field has-addons is-marginless" style="padding-right: 0.25rem;">
          <p class="control">
            <button id="${btn_characterConditionView}" class="button is-very-small is-danger is-outlined">
              <span>${conditionDisplayName}</span>
            </button>
          </p>
          <p class="control">
            <button id="${btn_characterConditionDelete}" class="button is-very-small is-danger is-outlined">
              <span class="icon is-small">
                <i class="fas fa-minus-circle"></i>
              </span>
            </button>
          </p>
        </div>
      `);
    }

    $(`#${btn_characterConditionView}`).click(function () {
      openConditionsModal(accessToken, condition);
    });

    $(`#${btn_characterConditionDelete}`).click(function () {
      removeCondition(accessToken, condition.name);
    });

  }

}
