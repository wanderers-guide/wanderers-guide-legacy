/* Copyright (C) 2020, Wanderer's Guide, all rights reserved.
    By Aaron Cassar.
*/

/* Dice Loader */
let g_diceLoaderPercentage = 0;

function startDiceLoader(){
  $('.ldBar').removeClass('is-hidden');
  $('.pageloader').removeClass("fadeout");
  setDiceLoaderPercentage(5);
}

function upTickDiceLoaderToPercentage(maxPercentage, estimatedTime){
  //$('.ldBar').attr('data-duration', estimatedTime);
  setDiceLoaderPercentage(maxPercentage);
}

function setDiceLoaderPercentage(percentage){
  let bar = new ldBar('.ldBar');
  bar.set(percentage, true);
  g_diceLoaderPercentage = percentage;
}

function getDiceLoaderPercentage(){
  return g_diceLoaderPercentage;
}

function stopDiceLoader(){
  $('.pageloader').addClass("fadeout");
}


/* Spinner Loader */
function startSpinnerLoader(){
  $('.pageloader').removeClass('is-hidden');
}

function stopSpinnerLoader(){
  $('.pageloader').addClass('is-hidden');
}

/* Spinner Sub-Loader */
function startSpinnerSubLoader(){
  $('.subpageloader').removeClass('is-hidden');
}

function stopSpinnerSubLoader(){
  $('.subpageloader').addClass('is-hidden');
}