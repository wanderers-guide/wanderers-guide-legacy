/* Copyright (C) 2021, Wanderer's Guide, all rights reserved.
    By Aaron Cassar.
*/

/* Dice Loader */
let g_diceLoaderPercentage = 0;

function startDiceLoader(){
  $('.ldBar').removeClass('is-hidden');
  $('.dice-pageloader').removeClass("fadeout");

  $('.ldBar-message').text('Initializing Load');
  setDiceLoaderPercentage(5);

  socket.off("updateLoadProgess");
  socket.on("updateLoadProgess", function(data){

    $('.ldBar-message').text(data.message+'...');
    setDiceLoaderPercentage(g_diceLoaderPercentage+data.upVal);

  });

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
  $('.dice-pageloader').addClass("fadeout");
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