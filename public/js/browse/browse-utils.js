/* Copyright (C) 2020, Wanderer's Guide, all rights reserved.
    By Aaron Cassar.
*/

function getFirstSentence(text){
  let rSent = text.match(/^.*?[\.!\?](?:\s|$)/);
  if(rSent != null){
    return rSent[0];
  } else {
    return '';
  }
}

function textContainsWords(text, wordArray){
  if(text == null) {return false;}
  text = text.toUpperCase();
  for(let word of wordArray){
    if(!text.includes(word)){
      return false;
    }
  }
  return true;
}