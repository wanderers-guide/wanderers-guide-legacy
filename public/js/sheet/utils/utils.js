/* Copyright (C) 2021, Wanderer's Guide, all rights reserved.
    By Aaron Cassar.
*/

function getCharIDFromURL(){
    return window.location.pathname.split("characters/")[1];
}

function getBulmaTextColorFromCurrentHP(currentHP, maxHP) {
  if(currentHP >= maxHP*0.8){
    return "has-text-success";
  } else if(currentHP >= maxHP*0.5){
    return "has-text-warning";
  } else {
    return "has-text-danger";
  }
}

function dieTypeToNum(dieType){
  switch(dieType) {
    case '':
      return 1;
    case 'd2':
      return 2;
    case 'd4':
      return 4;
    case 'd6':
      return 6;
    case 'd8':
      return 8;
    case 'd10':
      return 10;
    case 'd12':
      return 12;
    case 'd20':
      return 20;
    default:
      return 0;
  }
}

