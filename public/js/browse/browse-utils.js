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