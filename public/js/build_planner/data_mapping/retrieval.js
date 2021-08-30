
function getProfMap(){

  let profMap = new Map();
  for(const profData of getDataAllProficiencies()){

    // Convert lores to be the same
    if(profData.To.includes('_LORE')){
      profData.To = capitalizeWords(profData.To.replace('_LORE',' Lore'));
    }

    let profMapValue = profMap.get(profData.To);
    if(profMapValue != null){
      profMapValue.push(profData);
      profMap.set(profData.To, profMapValue);
    } else {
      profMap.set(profData.To, [profData]);
    }

  }
  return profMap;

}

function getUnselectedData(){

  

}

function getCharClass(){
  return g_classMap.get(g_character.classID+'');
}
function getCharAncestry(){
  return g_ancestryMap.get(g_character.ancestryID+'');
}
function getCharHeritage(){
  if(g_character.heritageID != null){
    let ancestry = getCharAncestry();
    if(ancestry != null){
      return ancestry.Heritages.find(heritage => {
        return heritage.id == g_character.heritageID;
      });
    } else {
      return null;
    }
  } else if(g_character.uniHeritageID != null){
    return g_uniHeritages.find(uniHeritage => {
      return uniHeritage.id == g_character.uniHeritageID;
    });
  } else {
    return null;
  }
}
function getCharBackground(){
  if(g_character.backgroundID == null) { return null; }
  return g_backgrounds.find(background => {
    return background.id == g_character.backgroundID;
  });
}



