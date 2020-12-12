/* Copyright (C) 2020, Wanderer's Guide, all rights reserved.
    By Aaron Cassar.
*/

function getSkillArray() {
  let skillArray = []; // Hardcoded - Skill IDs
  skillArray.push({ id: 1, name: 'Acrobatics', ability: 'DEX' });
  skillArray.push({ id: 3, name: 'Arcana', ability: 'INT' });
  skillArray.push({ id: 4, name: 'Athletics', ability: 'STR' });
  skillArray.push({ id: 5, name: 'Crafting', ability: 'INT' });
  skillArray.push({ id: 6, name: 'Deception', ability: 'CHA' });
  skillArray.push({ id: 7, name: 'Diplomacy', ability: 'CHA' });
  skillArray.push({ id: 8, name: 'Intimidation', ability: 'CHA' });
  skillArray.push({ id: 9, name: 'Lore', ability: 'INT' });
  skillArray.push({ id: 10, name: 'Medicine', ability: 'WIS' });
  skillArray.push({ id: 11, name: 'Nature', ability: 'WIS' });
  skillArray.push({ id: 12, name: 'Occultism', ability: 'INT' });
  skillArray.push({ id: 14, name: 'Performance', ability: 'CHA' });
  skillArray.push({ id: 15, name: 'Religion', ability: 'WIS' });
  skillArray.push({ id: 16, name: 'Society', ability: 'INT' });
  skillArray.push({ id: 17, name: 'Stealth', ability: 'DEX' });
  skillArray.push({ id: 18, name: 'Survival', ability: 'WIS' });
  skillArray.push({ id: 19, name: 'Thievery', ability: 'DEX' });
  return skillArray;
}

function getSkillIDToName(skillID){
  switch(skillID) { // Hardcoded - Skill IDs
    case 1: return 'Acrobatics';
    case 3: return 'Arcana';
    case 4: return 'Athletics';
    case 5: return 'Crafting';
    case 6: return 'Deception';
    case 7: return 'Diplomacy';
    case 8: return 'Intimidation';
    case 9: return 'Lore';
    case 10: return 'Medicine';
    case 11: return 'Nature';
    case 12: return 'Occultism';
    case 14: return 'Performance';
    case 15: return 'Religion';
    case 16: return 'Society';
    case 17: return 'Stealth';
    case 18: return 'Survival';
    case 19: return 'Thievery';
    default: return 'Unknown';
  }
}

function getSkillNameAbbrev(skillName){
  skillName = skillName.toUpperCase();
  switch(skillName) {
    case 'ACROBATICS': return 'Acro.';
    case 'ARCANA': return 'Arcana';
    case 'ATHLETICS': return 'Athletics';
    case 'CRAFTING': return 'Crafting';
    case 'DECEPTION': return 'Deception';
    case 'DIPLOMACY': return 'Diplomacy';
    case 'INTIMIDATION': return 'Intim.';
    case 'LORE': return 'Lore';
    case 'MEDICINE': return 'Medicine';
    case 'NATURE': return 'Nature';
    case 'OCCULTISM': return 'Occultism';
    case 'PERFORMANCE': return 'Perform.';
    case 'RELIGION': return 'Religion';
    case 'SOCIETY': return 'Society';
    case 'STEALTH': return 'Stealth';
    case 'SURVIVAL': return 'Survival';
    case 'THIEVERY': return 'Thievery';
    default: return '';
  }
}



function updateAbilityMap(){

  let abilMap = new Map();
  abilMap.set("STR", parseInt($('#quickviewLeftDefault').attr('data-str-base')));
  abilMap.set("DEX", parseInt($('#quickviewLeftDefault').attr('data-dex-base')));
  abilMap.set("CON", parseInt($('#quickviewLeftDefault').attr('data-con-base')));
  abilMap.set("INT", parseInt($('#quickviewLeftDefault').attr('data-int-base')));
  abilMap.set("WIS", parseInt($('#quickviewLeftDefault').attr('data-wis-base')));
  abilMap.set("CHA", parseInt($('#quickviewLeftDefault').attr('data-cha-base')));

  let boostMap = new Map();
  for(const bonusData of wscChoiceStruct.BonusArray){
    if(bonusData.Bonus == "Boost") {
      let boostNums = boostMap.get(bonusData.Ability);
      if(boostNums == null){
        boostMap.set(bonusData.Ability, 1);
      } else {
        boostMap.set(bonusData.Ability, boostNums+1);
      }
    } else if(bonusData.Bonus == "Flaw") {
      let boostNums = boostMap.get(bonusData.Ability);
      if(boostNums == null){
        boostMap.set(bonusData.Ability, -1);
      } else {
        boostMap.set(bonusData.Ability, boostNums-1);
      }
    } else {
      let abilBonus = abilMap.get(bonusData.Ability);
      abilMap.set(bonusData.Ability, abilBonus+parseInt(bonusData.Bonus));
    }
  }

  for(const [ability, boostNums] of boostMap.entries()){
    let abilityScore = abilMap.get(ability);
    for (let i = 0; i < boostNums; i++) {
      if(abilityScore < 18){
        abilityScore += 2;
      } else {
        abilityScore += 1;
      }
    }
    if(boostNums < 0) {
      abilityScore = abilityScore+boostNums*2;
    }
    abilMap.set(ability, abilityScore);
  }

  g_abilMap = abilMap;

  if($('#quickviewLeftDefault').hasClass('is-active')){
    openLeftQuickView('skillsView', null);
  }

}


function updateSkillMap(refreshLists){

  let skillArray = [];
  for(const skill of getSkillArray()){
      if(skill.name != "Lore"){
          skillArray.push({ SkillName : skill.name, Skill : skill });
      }
  }

  let loreSkill = getSkillArray().find(skill => {
      return skill.name === "Lore";
  });
  for(const loreData of wscChoiceStruct.LoreArray) {
    if(loreData.value != null){
      skillArray.push({ SkillName : capitalizeWords(loreData.value)+" Lore", Skill : loreSkill });
    }
  }

  let skillMap = new Map();

  for(const skillData of skillArray){
      let bestProf = 'U';
      let numUps = 0;
      for(const profData of wscChoiceStruct.ProfArray){
          if(profData.For == "Skill" && profData.To != null){
              let tempSkillName = skillData.SkillName.toUpperCase();
              tempSkillName = tempSkillName.replace(/_|\s+/g,"");
              let tempProfTo = profData.To.toUpperCase();
              tempProfTo = tempProfTo.replace(/_|\s+/g,"");
              if(tempProfTo === tempSkillName) {
                  numUps += getUpAmt(profData.Prof);
                  bestProf = getBetterProf(bestProf, profData.Prof);
              }
          }
      }

      skillMap.set(skillData.SkillName, {
          Name : skillData.SkillName,
          NumUps : profTypeToNumber(bestProf)+numUps,
          Skill : skillData.Skill
      });
  }

  g_skillMap = skillMap;

  if(refreshLists){
    // Update Skill Lists
    $('.selectIncrease').each(function(){
        let selectIncreaseID = $(this).attr('id');
        let srcStruct = {
            sourceType: $(this).attr('data-sourceType'),
            sourceLevel: $(this).attr('data-sourceLevel'),
            sourceCode: $(this).attr('data-sourceCode'),
            sourceCodeSNum: $(this).attr('data-sourceCodeSNum'),
        };
        let profType = $(this).attr('data-profType');
        let optionals = JSON.parse($(this).attr('data-optionals').replace(/`/g, '"'));
        populateSkillLists(selectIncreaseID, srcStruct, profType, optionals);
    });
  }

  if($('#quickviewLeftDefault').hasClass('is-active')){
    openLeftQuickView('skillsView', null);
  }

}

function getUpAmt(profType){
  if(profType == "UP"){
      return 1;
  }
  if(profType == "DOWN"){
      return -1;
  }
  return 0;
}

function profTypeToNumber(profType){
  switch(profType){
      case 'U': return 0;
      case 'T': return 1;
      case 'E': return 2;
      case 'M': return 3;
      case 'L': return 4;
      default: return -1; 
  }
}

function getBetterProf(prof1, prof2){
  let profNumber1 = profTypeToNumber(prof1);
  let profNumber2 = profTypeToNumber(prof2);
  return (profNumber1 > profNumber2) ? prof1 : prof2;
}




// ~~~~~~~~~~ Stats Quickview ~~~~~~~~~~ //
function openLeftSkillsQuickview(data) {
  
  $('#quickViewLeftTitle').html('Statistics');
  let qContent = $('#quickViewLeftContent');

  let charTags = cloneObj(wscChoiceStruct.CharTagsArray);
  charTags.push({value: 'Humanoid'});
  charTags = charTags.sort(
      function(a, b) {
          return a.value > b.value ? 1 : -1;
      }
  );
  let tagsInnerHTML = '';
  for(const charTag of charTags){
    if(charTag.value != null && charTag.value != ''){
      tagsInnerHTML += '<button class="button is-paddingless px-2 is-marginless mr-2 mb-1 is-very-small is-info tagButton">'+charTag.value+'</button>';
    }
  }
  if(tagsInnerHTML != ''){
    qContent.append('<div class="buttons is-marginless is-centered">'+tagsInnerHTML+'</div>');
    qContent.append('<hr class="mb-2 mt-1">');
  }

  qContent.append('<div class="columns is-centered is-marginless text-center mx-3"><div class="column is-2 is-paddingless"><p class="is-bold-very">Str</p></div><div class="column is-2 is-paddingless"><p class="is-bold-very">Dex</p></div><div class="column is-2 is-paddingless"><p class="is-bold-very">Con</p></div><div class="column is-2 is-paddingless"><p class="is-bold-very">Int</p></div><div class="column is-2 is-paddingless"><p class="is-bold-very">Wis</p></div><div class="column is-2 is-paddingless"><p class="is-bold-very">Cha</p></div></div>');
  qContent.append('<div class="columns is-centered is-marginless text-center mx-3"><div class="column is-2 is-paddingless"><p class="">'+g_abilMap.get("STR")+'</p></div><div class="column is-2 is-paddingless"><p class="">'+g_abilMap.get("DEX")+'</p></div><div class="column is-2 is-paddingless"><p class="">'+g_abilMap.get("CON")+'</p></div><div class="column is-2 is-paddingless"><p class="">'+g_abilMap.get("INT")+'</p></div><div class="column is-2 is-paddingless"><p class="">'+g_abilMap.get("WIS")+'</p></div><div class="column is-2 is-paddingless"><p class="">'+g_abilMap.get("CHA")+'</p></div></div>');

  qContent.append('<hr class="m-2">');

  qContent.append('<div class="columns is-centered is-marginless"><div id="skillsColumnOne" class="column pl-0 is-half-tablet is-two-fifths-desktop"></div><div id="skillsColumnTwo" class="column pr-0 is-half-tablet is-two-fifths-desktop"></div></div>');

  let switchColumnNum = Math.ceil(g_skillMap.size/2);
  let skillCount = 0;
  for(const [skillName, skillData] of g_skillMap.entries()){
    skillCount++;

    let skillsColumnID;
    if(skillCount > switchColumnNum){
      skillsColumnID = "skillsColumnTwo";
    } else {
      skillsColumnID = "skillsColumnOne";
    }

    $('#'+skillsColumnID).append('<div><span class="is-size-7 has-text-grey-kinda-light">'+getProfLetterFromNumUps(skillData.NumUps)+' - </span><span class="is-size-6 has-text-grey-light">'+skillData.Name+'</span></div>');
  }

  qContent.append('<div><p class="is-size-7 has-text-grey-kinda-light has-text-centered is-italic" style="letter-spacing: 0px;">U = Untrained, T = Trained, E = Expert, M = Master, L = Legendary</span></p>');

  qContent.append('<hr class="m-2">');

  qContent.append('<div class="columns is-centered is-marginless"><div id="finalSkillTrainingColumn" class="column pl-0"></div><div id="finalLanguagesColumn" class="column pr-0"></div></div>');

  if(wscChoiceStruct.ClassDetails.Class != null){
    let tSkillsMore = wscChoiceStruct.ClassDetails.Class.tSkillsMore;
    $('#finalSkillTrainingColumn').append('<p class="is-size-5 has-text-centered"><span class="has-tooltip-top has-tooltip-multiline" data-tooltip="You become trained in an additional number of skills equal to an amount determined by your class ('+tSkillsMore+') plus your Intelligence modifier ('+getMod(g_abilMap.get("INT"))+').">Skill Training</span></p>');
  }

  if(wscChoiceStruct.Ancestry != null){
    let humanExtraText = '';
    if(wscChoiceStruct.Ancestry.name == 'Human'){ humanExtraText = ' Being a human gives you another language as well.'; }
    $('#finalLanguagesColumn').append('<p class="is-size-5 has-text-centered"><span class="has-tooltip-top has-tooltip-multiline" data-tooltip="You learn an additional number of languages equal to your Intelligence modifier ('+getMod(g_abilMap.get("INT"))+').'+humanExtraText+' Your ancestry dictates what languages you can select from (the lighter options, listed at the top).">Languages</span></p>');
  }

  statsFinalSkillsAndLangs();

}

function statsFinalSkillsAndLangs(){

  let srcStruct = {
    sourceType: 'class',
    sourceLevel: 1,
    sourceCode: 'inits-bonus',
    sourceCodeSNum: 'a',
  };
  
  socket.emit("requestLangsAndTrainingsClear",
      getCharIDFromURL(),
      srcStruct);

}

socket.on("returnLangsAndTrainingsClear", function(srcStruct){

  if(wscChoiceStruct.ClassDetails.Class != null){

    let giveSkillTrainingCode = '';
    for (let i = 0; i < getMod(g_abilMap.get("INT"))+wscChoiceStruct.ClassDetails.Class.tSkillsMore; i++) {
        giveSkillTrainingCode += 'GIVE-SKILL=T\n';
    }
  
    $('#finalSkillTrainingColumn').append('<div id="sideSkillSelection"></div>');
    processCode(
        giveSkillTrainingCode,
        srcStruct,
        'sideSkillSelection');


  }

  if(wscChoiceStruct.Ancestry != null){

    let giveLanguageCode = '';
    let additionalLangs = getMod(g_abilMap.get("INT"));
    if(wscChoiceStruct.Ancestry.name == 'Human'){ additionalLangs++; } // Hardcoded - ancestry named Human gains +1 langs.  
    for (let i = 0; i < additionalLangs; i++) {
        giveLanguageCode += 'GIVE-LANG-BONUS-ONLY\n';
    }
  
    $('#finalLanguagesColumn').append('<div id="sideLangSelection"></div>');
    processCode(
        giveLanguageCode,
        srcStruct,
        'sideLangSelection');

  }

});