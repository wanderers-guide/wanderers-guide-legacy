/* Copyright (C) 2021, Wanderer's Guide, all rights reserved.
    By Aaron Cassar.
*/

/* Dice Loader */
let g_diceLoaderPercentage = 0;

function startDiceLoader(){
  $('.ldBar').removeClass('is-hidden');
  
  $('.dice-pageloader').removeClass("fadeout");
  $('html').addClass('is-clipped');

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
  $('html').removeClass('is-clipped');
}


/* Spinner Loader */
function startSpinnerLoader(){
  $('.pageloader').removeClass('is-hidden');
}

function stopSpinnerLoader(){
  setTimeout(() => {
    $('.pageloader').addClass('is-hidden');
  }, 500);// After 1/2 second
}

/* Spinner Sub-Loader */
function startSpinnerSubLoader(loaderClass=null){
  if(loaderClass != null){
    $('.'+loaderClass).removeClass('is-hidden');
  } else {
    $('.subpageloader').removeClass('is-hidden');
  }
}

function stopSpinnerSubLoader(loaderClass=null){
  setTimeout(() => {
    if(loaderClass != null){
      $('.'+loaderClass).addClass('is-hidden');
    } else {
      $('.subpageloader').addClass('is-hidden');
    }
  }, 500);// After 1/2 second
}