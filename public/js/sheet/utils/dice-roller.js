/* Copyright (C) 2020, Wanderer's Guide, all rights reserved.
    By Aaron Cassar.
*/

let g_rollHistory = [];

function initDiceRoller(){

  $('#dice-roller-btn-container').removeClass('is-hidden');

  $('#dice-roller-modal-background,#dice-roller-modal-close').click(function() {
    $('#dice-roller-modal').removeClass('is-active');
    $('html').removeClass('is-clipped');
  });

  // Init Roller Btn //
  let drag = false;
  document.addEventListener('mousedown', () => drag = false);
  document.addEventListener('mousemove', () => drag = true);

  $('#dice-roller-btn').click(function() {
    if(!drag){
      openDiceRoller();
    }
  });

  $("#dice-roller-btn").draggable();

  // Roll Btn //
  $('#dice-roller-input-roll').click(function() {
    let diceAmtStr = $('#dice-roller-input-dice-amt').val();
    let dieSizeStr = $('#dice-roller-input-die-size').val();
    let bonusStr = $('#dice-roller-input-bonus').val();
    if(diceAmtStr != ''){
      let diceAmt = parseInt(diceAmtStr);
      let dieSize = parseInt(dieSizeStr);
      let bonus = (bonusStr != '') ? parseInt(bonusStr) : 0;
      makeDiceRoll(diceAmt, dieSize, bonus);
    }
  });

  // Stat Roller Btns //
  refreshStatRollButtons();

}

function refreshStatRollButtons() {
  window.setTimeout(() => {
    $('.stat-roll-btn').removeClass('pr-1');
    $('.stat-roll-btn').addClass('button is-outlined is-info is-small');
    $('.stat-roll-btn').click(function() {
      let bonus = parseInt($(this).text());
      makeDiceRoll(1, 20, bonus);
    });

    $('.damage-roll-btn').addClass('button is-outlined is-info is-small');
    $('.damage-roll-btn').click(function() {
      let damageText = $(this).text().toUpperCase();
      if(damageText.includes('D')){
        let parts = damageText.split('D');

        let diceNum = parseInt(parts[0]);
        let dieSize = null;
        let bonus = null;
  
        let lastPartResult = evalString(parts[1]);
        if(lastPartResult == parts[1]){
          dieSize = lastPartResult;
          bonus = 0;
        } else {
          dieSize = parseInt(parts[1]);
          bonus = lastPartResult-dieSize;
        }
        
        makeDiceRoll(diceNum, dieSize, bonus);
      }
    });
  }, 100);
}

function openDiceRoller(){
  $('#dice-roller-output-container').html('');

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
      $('#dice-roller-output-container').append('<p class="is-size-4 negative-indent">'+resultLine+'</p>');
    }
  } else {
    $('#dice-roller-output-container').html('<p class="is-size-5 is-italic">No roll history.</p>');
  }

  // Scroll to Bottom
  $('#dice-roller-modal').addClass('is-active');
  $('html').addClass('is-clipped');
  $('#dice-roller-output-container').scrollTop($('#dice-roller-output-container')[0].scrollHeight);
}

function makeDiceRoll(diceNum, dieType, bonus){
  let rollStruct = diceRoller_getDiceRoll(diceNum, dieType, bonus);
  g_rollHistory.push(rollStruct);
  openDiceRoller();
}

//// Math Rands ////
function diceRoller_getDiceRoll(diceNum, dieType, bonus){
  let rollStruct = {Total: null, ResultData: null, RollData: {DiceNum: diceNum, DieType: dieType, Bonus: bonus} };
  let total = 0; let resultData = [];
  for (let i = 0; i < diceNum; i++) {
    let result = diceRoller_getRandomNumber(dieType);
    resultData.push(result);
    total += result;
  }
  total += bonus;
  rollStruct.Total = total;
  rollStruct.ResultData = resultData;
  return rollStruct;
}

function diceRoller_getRandomNumber(max) {
  return Math.floor(Math.random()*Math.floor(max))+1;
}

