
function getClassEditorIDFromURL(){
  let spl1 = window.location.pathname.split("class/");
  return parseInt(spl1[1]);
}

function getAncestryEditorIDFromURL(){
    let spl1 = window.location.pathname.split("ancestry/");
    return parseInt(spl1[1]);
}

function getBackgroundEditorIDFromURL(){
  let spl1 = window.location.pathname.split("background/");
  return parseInt(spl1[1]);
}

function getFeatEditorIDFromURL(){
  let spl1 = window.location.pathname.split("feat-action/");
  return parseInt(spl1[1]);
}

function getItemEditorIDFromURL(){
  let spl1 = window.location.pathname.split("item/");
  return parseInt(spl1[1]);
}

function getSpellEditorIDFromURL(){
  let spl1 = window.location.pathname.split("spell/");
  return parseInt(spl1[1]);
}

function objToMap(obj) {
    let strMap = new Map();
    for (let k of Object.keys(obj)) {
      strMap.set(k, obj[k]);
    }
    return strMap;
}