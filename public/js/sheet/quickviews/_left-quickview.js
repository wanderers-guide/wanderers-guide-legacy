/* Copyright (C) 2021, Wanderer's Guide, all rights reserved.
    By Aaron Cassar.
*/

function openLeftQuickView(subtabName) {

  $('#quickViewLeftTitle').html('Sheet Tools');

  $('#quickViewLeftTitleClose').html('<a id="quickViewLeftClose" class="delete"></a>');
  $('#quickViewLeftClose').click(function(){
    $('#quickviewLeftDefault').removeClass('is-active');
  });

  $('#quickviewLeftDefault').addClass('is-active');

  // Listeners to open tabs
  $('#quickViewLeftTab-DiceRoller').click(function(){
    setLeftQuickViewTab('Dice Roller');
  });

  $('#quickViewLeftTab-Toggleables').click(function(){
    setLeftQuickViewTab('Toggleables');
  });

  // Open tab 
  setLeftQuickViewTab(subtabName);

}

function setLeftQuickViewTab(subtabName){

  $('#quickViewLeftTitle').html('Sheet Tools - '+subtabName);
  $('#quickViewLeftContent').html('');
  $('#quickViewLeftContent').scrollTop(0);

  $('#quickViewLeftTab-DiceRoller').parent().removeClass("is-active");
  $('#quickViewLeftTab-Toggleables').parent().removeClass("is-active");
  $('#quickViewLeftTab-'+(subtabName.replace(' ',''))).parent().addClass("is-active");

  if(subtabName == 'Toggleables'){
    leftQuickview_OpenToggleables();
  } else if (subtabName == 'Dice Roller') {
    leftQuickview_OpenDiceRoller();
  }

}






function leftQuickview_OpenToggleables(){

  let qContent = $('#quickViewLeftContent');

  qContent.append(`
    <div class="mb-3">
      <p>The following are toggleable buttons that apply certain effects to the sheet when enabled. They can be useful for some abilities that tend to be either active or inactive.</p>
    </div>
  `);
  
  for(const sheetState of getSheetStates()){

    let stateBtnID = 'sheetStateBtnID'+sheetState.id;
    qContent.append(`<button id="${stateBtnID}" class="button is-info is-fullwidth is-outlined has-tooltip-bottom" style="margin-bottom: 0.8rem;"
            data-tooltip="${processTextRemoveIndexing(sheetState.description)}"
        >${sheetState.name}</button>`);

    if(sheetState.isActive){
      $('#'+stateBtnID).addClass('is-focused');
    }

    $('#'+stateBtnID).click(function() {
      setSheetStateActive(sheetState.id, !sheetState.isActive);
      openLeftQuickView('Toggleables');
      reloadCharSheet();
    });


  }

}



function leftQuickview_OpenDiceRoller() {

  let qContent = $('#quickViewLeftContent');

  // Set HTML
  qContent.append(`

      <div class="columns is-mobile is-narrow is-centered is-gapless mt-2">
        <div class="column is-1"></div>
        <div class="column is-2">
          <div class="control">
            <a id="dice-roller-input-roll" class="button is-outlined is-info">Roll</a>
          </div>
        </div>
        <div class="column is-8">
          <div class="field has-addons">
            <p class="control">
              <input id="dice-roller-input-dice-amt" class="input is-info" type="number" value="1" min="1" max="99">
            </p>
            <p class="control">
              <span class="select is-info">
                <select id="dice-roller-input-die-size">
                  <option value="2">d2</option>
                  <option value="4">d4</option>
                  <option value="6">d6</option>
                  <option value="8">d8</option>
                  <option value="10">d10</option>
                  <option value="12">d12</option>
                  <option value="20" selected>d20</option>
                  <option value="100">d100</option>
                </select>
              </span>
            </p>
            <p class="control">
              <a class="button is-static has-text-grey-light has-background-grey-darkest is-info is-outlined">+</a>
            </p>
            <p class="control">
              <input id="dice-roller-input-bonus" class="input is-info" type="number" value="0" min="0" max="999">
            </p>
          </div>
        </div>
        <div class="column is-1"></div>
      </div>
      <hr class="m-2">
      <div class="pos-relative">
        <span id="dice-roller-clear-btn" class="icon is-small has-text-danger pos-absolute pos-t-2 pos-r-15 has-tooltip-left" data-tooltip="Clear History"><i class="fas fa-eraser"></i></span>
        <div id="dice-roller-output-container" class="px-5 use-custom-scrollbar" style="height: 70vh; max-height: 70vh; overflow-y: auto;"></div>
      </div>

  `);

  // Display Roll History
  if(g_rollHistory.length > 0){
    for (let i = 0; i < g_rollHistory.length; i++) {
      let rollStruct = g_rollHistory[i];

      if(i == g_rollHistory.length-1 && g_rollHistory.length > 1){
        $('#dice-roller-output-container').append('<hr class="m-2">');
      }

      // Display Roll //
      let resultLine = '<span class="has-text-grey-light">'+rollStruct.RollData.DiceNum+'</span><span class="has-text-grey is-thin">d</span><span class="has-text-grey-light">'+rollStruct.RollData.DieType+'</span>';
      if(rollStruct.RollData.Bonus != 0){
        resultLine += '<span class="has-text-grey">+</span><span class="has-text-grey-light">'+rollStruct.RollData.Bonus+'</span>';
      }

      if(rollStruct.RollData.DiceNum != 1 || rollStruct.RollData.Bonus != 0) {
        resultLine += '<i class="fas fa-caret-right has-text-grey mx-2"></i>';
        let resultSubParts = '';
        let firstResult = true;
        for(let result of rollStruct.ResultData){
          if(firstResult) { firstResult = false; } else { resultSubParts += '<span class="has-text-grey">+</span>'; }
  
          let bulmaColor = 'has-text-grey-light';
          if(result == rollStruct.RollData.DieType) { bulmaColor = 'has-text-success'; }
          else if (result == 1) { bulmaColor = 'has-text-danger'; }
  
          resultSubParts += '<span class="has-text-grey">(</span><span class="'+bulmaColor+'">'+result+'</span><span class="has-text-grey">)</span>';
        }
        if(rollStruct.RollData.Bonus != 0){
          resultSubParts += '<span class="has-text-grey">+</span><span class="has-text-grey-light">'+rollStruct.RollData.Bonus+'</span>';
        }
        resultLine += '<span class="is-size-5 is-thin">'+resultSubParts+'</span>';
      }

      resultLine += '<i class="fas fa-caret-right has-text-grey mx-2"></i><span class="has-text-info is-bold">'+rollStruct.Total+'</span>';
      $('#dice-roller-output-container').append(`
          <div class="pos-relative">
            <p class="is-size-4 negative-indent">${resultLine}</p>
            <p class="pos-absolute pos-t-10 pos-r-1 is-size-8 has-text-grey">${rollStruct.Label.Name}</p>
            <p class="pos-absolute pos-b-1 pos-r-1 is-size-8 has-text-grey-dark is-italic">${rollStruct.Timestamp.Time}</p>
          </div>
      `);
    }
  } else {
    $('#dice-roller-output-container').html('<p class="is-size-5 is-italic">No roll history.</p>');
  }

  // Scroll to Bottom
  $('#dice-roller-output-container').scrollTop($('#dice-roller-output-container')[0].scrollHeight);

  // Roll Btn Listener //
  $('#dice-roller-input-roll').click(function() {
    let diceAmtStr = $('#dice-roller-input-dice-amt').val();
    let dieSizeStr = $('#dice-roller-input-die-size').val();
    let bonusStr = $('#dice-roller-input-bonus').val();
    if(diceAmtStr != ''){
      let diceAmt = parseInt(diceAmtStr);
      let dieSize = parseInt(dieSizeStr);
      let bonus = (bonusStr != '') ? parseInt(bonusStr) : 0;
      makeDiceRoll(diceAmt, dieSize, bonus, '');
    }
  });

  // Clear History Listener //
  $('#dice-roller-clear-btn').click(function() {
    g_rollHistory = [];
    openLeftQuickView('Dice Roller');

    socket.emit("requestRollHistorySave",
        getCharIDFromURL(),
        JSON.stringify(g_rollHistory));
  });

}




