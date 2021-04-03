/* Copyright (C) 2020, Wanderer's Guide, all rights reserved.
    By Aaron Cassar.
*/

let g_rollHistory = [];

function initDiceRoller(){

  if(gOption_hasDiceRoller){
    // Stat Roller Btns //
    refreshStatRollButtons();

    // Dice Notation Btns //
    refreshDiceNotationButtons();
  }

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
  
        let lastPartResult = parseInt(math.evaluate(parts[1].replace(/[^(\d|\W)]/g,'')));
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


function refreshDiceNotationButtons(){
  window.setTimeout(() => {
    $('.dice-roll-btn').off();
    $('.dice-roll-btn').click(function() {
      let diceNum = $(this).attr('data-dice-num');
      let diceType = $(this).attr('data-dice-type');
      let bonus = parseInt(math.evaluate($(this).attr('data-dice-bonus').replace(/[^(\d|\W)]/g,'')));
      if(isNaN(bonus)) { bonus = 0; }

      makeDiceRoll(diceNum, diceType, bonus);
      $(this).blur();
    });
  }, 100);
}

function processDiceNotation(text){

  let notationRegex = /(^| )(\d+)+d(\d+)((\s*[+-]\s*\d+)*)/g;
  return text.replace(notationRegex, function(match, startSpace, diceNum, diceType, bonus) {
    return `${startSpace}<button class="button dice-roll-btn is-paddingless px-2 is-marginless mt-1 is-very-small is-outlined is-info"
                data-dice-num="${diceNum}"
                data-dice-type="${diceType}"
                data-dice-bonus="${bonus}"
            >${match}</button>`;
  });

}


function makeDiceRoll(diceNum, dieType, bonus){
  let rollStruct = diceRoller_getDiceRoll(diceNum, dieType, bonus);
  g_rollHistory.push(rollStruct);
  openLeftQuickView('Dice Roller');
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

