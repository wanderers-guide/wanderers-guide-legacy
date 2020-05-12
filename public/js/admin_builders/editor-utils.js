
function getAncestryEditorIDFromURL(){
    let spl1 = window.location.pathname.split("ancestry/");
    return parseInt(spl1[1]);
}

function getFeatEditorIDFromURL(){
  let spl1 = window.location.pathname.split("feat-action/");
  return parseInt(spl1[1]);
}

function objToMap(obj) {
    let strMap = new Map();
    for (let k of Object.keys(obj)) {
      strMap.set(k, obj[k]);
    }
    return strMap;
}