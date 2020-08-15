/* Copyright (C) 2020, Wanderer's Guide, all rights reserved.
    By Aaron Cassar.
*/

function preReqGetIconTrue(){
  return '<span class="icon is-small has-text-info"><i class="fas prereq-icon fa-check"></i></span>';
}
function preReqGetIconFalse(){
  return '<span class="icon is-small has-text-danger"><i class="fas prereq-icon fa-times"></i></span>';
}
function preReqGetIconUnknown(){
  return '<span class="icon is-small has-text-warning"><i class="fas prereq-icon fa-question"></i></span>';
}

function preReqFeatLink(featLinkClass, inFeatName){
  inFeatName = inFeatName.replace(/’/g,'\'').toUpperCase();
  for(const [featID, featStruct] of g_featMap.entries()){
    let featName = featStruct.Feat.name.toUpperCase();
    if(inFeatName === featName && featStruct.Feat.isArchived == 0) {
      setTimeout(function() {
        $('.'+featLinkClass).off('click');
        $('.'+featLinkClass).click(function(){
            openQuickView('featView', {
                Feat : featStruct.Feat,
                Tags : featStruct.Tags,
                _prevBackData: {Type: g_QViewLastType, Data: g_QViewLastData},
            }, $('#quickviewDefault').hasClass('is-active'));
        });
      }, 100);
    }
  }
}

let g_preReqIgnoreArray = [
  'trained in Arcana, Nature, Occultism, or Religion',
  'expert in Arcana, Nature, Occultism, or Religion',
  'master in Arcana, Nature, Occultism, or Religion',
  'legendary in Arcana, Nature, Occultism, or Religion',
  'deity who grants the cold, fire, nature, or travel domain',
  'trained in Alcohol Lore, Cooking Lore, or Crafting',
];

function preReqResultArray(feat){
  let resultArray = [];
  let preReqStr = feat.prerequisites;

  for(let preReqIgnore of g_preReqIgnoreArray){
    let newPreReqStr = preReqStr.replace(preReqIgnore, '');
    if(preReqStr != newPreReqStr){
      preReqStr = newPreReqStr;
      resultArray.push({Type: 'UNKNOWN', Result: 'UNKNOWN', PreReqPart: preReqIgnore});
    }
  }

  let prereqParts = preReqStr.replace(/’/g,"'").split(/, |; /);

  for(let prereq of prereqParts){
    if(prereq == '') { continue; }
    let uPreReq = prereq.toUpperCase();

    let result;
    result = preReqCheckProfs(uPreReq);
    if(result != null) { resultArray.push({Type: 'SKILL-PROF', Result: result, PreReqPart: prereq}); continue; }

    result = preReqCheckAbilityScores(uPreReq);
    if(result != null) { resultArray.push({Type: 'ABILITY-SCORE', Result: result, PreReqPart: prereq}); continue; }

    result = preReqCheckFeats(uPreReq, prereq);
    if(result != null) { resultArray.push({Type: 'FEAT', Result: result, PreReqPart: prereq}); continue; }

    result = preReqCheckClassAbilities(uPreReq, prereq);
    if(result != null) { resultArray.push({Type: 'CLASS-FEATURE', Result: result, PreReqPart: prereq}); continue; }

    resultArray.push({Type: 'UNKNOWN', Result: 'UNKNOWN', PreReqPart: prereq});
  }
  return resultArray;
}

function meetsPrereqs(feat){
  // Returns TRUE, FALSE, UNKNOWN, and null
  if(feat.prerequisites == null) { return null; }

  let resultArray = preReqResultArray(feat);

  let totalResult = 'TRUE';
  for(let resultData of resultArray){
    if(resultData.Result == 'TRUE') { continue; }
    if(resultData.Result == 'FALSE') { totalResult = 'FALSE'; continue; }
    if(resultData.Result == 'UNKNOWN') { return 'UNKNOWN'; }
  }
  return totalResult;
}


function preReqCheckProfs(prereq){
  let rTrained = prereq.match(/TRAINED IN (.+)/);
  if(rTrained != null){
    return preReqConfirmSkillProf(rTrained[1], 1);
  }
  let rExpert = prereq.match(/EXPERT IN (.+)/);
  if(rExpert != null){
    return preReqConfirmSkillProf(rExpert[1], 2);
  }
  let rMaster = prereq.match(/MASTER IN (.+)/);
  if(rMaster != null){
    return preReqConfirmSkillProf(rMaster[1], 3);
  }
  let rLegendary = prereq.match(/LEGENDARY IN (.+)/);
  if(rLegendary != null){
    return preReqConfirmSkillProf(rLegendary[1], 4);
  }
  return null;
}

function preReqConfirmSkillProf(skillName, numUps){
  let skillData = g_skillMap.get(capitalizeWords(skillName));
  if(skillData != null){
    return skillData.NumUps >= numUps ? 'TRUE' : 'FALSE';
  } else {
    if(skillName.endsWith(' LORE')){ return 'FALSE'; }
    return 'UNKNOWN';
  }
}



function preReqCheckAbilityScores(prereq){
  let rStr = prereq.match(/STRENGTH (\d+)/);
  if(rStr != null){
    return preReqConfirmAbilityScore('STR', rStr[1]);
  }
  let rDex = prereq.match(/DEXTERITY (\d+)/);
  if(rDex != null){
    return preReqConfirmAbilityScore('DEX', rDex[1]);
  }
  let rCon = prereq.match(/CONSTITUTION (\d+)/);
  if(rCon != null){
    return preReqConfirmAbilityScore('CON', rCon[1]);
  }
  let rInt = prereq.match(/INTELLIGENCE (\d+)/);
  if(rInt != null){
    return preReqConfirmAbilityScore('INT', rInt[1]);
  }
  let rWis = prereq.match(/WISDOM (\d+)/);
  if(rWis != null){
    return preReqConfirmAbilityScore('WIS', rWis[1]);
  }
  let rCha = prereq.match(/CHARISMA (\d+)/);
  if(rCha != null){
    return preReqConfirmAbilityScore('CHA', rCha[1]);
  }
  return null;
}

function preReqConfirmAbilityScore(scoreType, amt){
  let scoreAmt = g_abilMap.get(scoreType);
  if(scoreAmt != null){
    return scoreAmt >= amt ? 'TRUE' : 'FALSE';
  } else {
    return 'UNKNOWN';
  }
}



function preReqCheckFeats(prereq, normalPreReq){
  for(let featData of wscChoiceStruct.FeatArray){
    if(featData.value != null){
      if(featData.value.name.toUpperCase() === prereq){
        return 'TRUE';
      }
    }
  }
  if(capitalizeWords(prereq) === normalPreReq){
    let skillData = g_skillMap.get(normalPreReq);
    return skillData == null ? 'FALSE' : 'UNKNOWN';
    // For cases like: trained in Nature, Arcana, or Occultism
  } else {
    return null;
  }
}



function preReqCheckClassAbilities(prereq, normalPreReq){
  // TO-DO: Temporary solution, will rework in future
  if(g_expr_classAbilityArray != null &&
        wscChoiceStruct.ClassDetails != null &&
        wscChoiceStruct.ClassDetails.Abilities != null){
    if(prereq.toLowerCase() === normalPreReq){

      for(let abilityName of g_expr_classAbilityArray){
        let abilNameCut = abilityName.toLowerCase().split('(')[0];
        if(abilNameCut.includes(normalPreReq) || normalPreReq.includes(abilNameCut)) {
          return 'TRUE';
        }
      }

      for(let ability of wscChoiceStruct.ClassDetails.Abilities){
        let abilNameCut = ability.name.toLowerCase().split('(')[0];
        if(abilNameCut.includes(normalPreReq) || normalPreReq.includes(abilNameCut)) {
          return 'FALSE';
        }
      }

      return 'UNKNOWN';

    } else {
      return null;
    }
  } else {
    return null;
  }
}