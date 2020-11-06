/* Copyright (C) 2020, Wanderer's Guide, all rights reserved.
    By Aaron Cassar.
*/

$(function () {

});

socket.on("returnAdminFeatDetailsPlus", function(featsObject, classObject, ancestryObject, uniHeritageArray){

    let featMap = objToMap(featsObject);
    g_classMap = objToMap(classObject);
    g_ancestryMap = objToMap(ancestryObject);
    g_uniHeritageArray = uniHeritageArray;
    
    let feat = featMap.get(getFeatEditorIDFromURL()+"");

    if(feat == null){
        window.location.href = '/admin/manage/feat-action'; //MAKE IT SO IT POPULATES CLASS AND ANCESTRY SELECTOR
        return;
    }

    $("#inputBuilderType").val(feat.Feat.genericType);
    $("#inputFeatName").val(feat.Feat.name);
    $("#inputFeatVersion").val(feat.Feat.version);
    $("#inputFeatLevel").val(feat.Feat.level);
    let minProf = (feat.Feat.minProf != null) ? feat.Feat.minProf : $("#inputFeatMinProf option:first").val();
    $("#inputFeatMinProf").val(minProf);
    let skillID = (feat.Feat.skillID != null) ? feat.Feat.skillID : $("#inputFeatSkill option:first").val();
    $("#inputFeatSkill").val(skillID);
    $("#inputFeatActions").val(feat.Feat.actions);
    $("#inputFeatRarity").val(feat.Feat.rarity);
    $("#inputFeatPrereq").val(feat.Feat.prerequisites);
    $("#inputFeatReq").val(feat.Feat.requirements);
    $("#inputFeatFreq").val(feat.Feat.frequency);
    $("#inputFeatCost").val(feat.Feat.cost);
    $("#inputFeatTrigger").val(feat.Feat.trigger);
    $("#inputFeatDesc").val(feat.Feat.description);
    $("#inputFeatSpecial").val(feat.Feat.special);
    let checkBoxState = (feat.Feat.canSelectMultiple == 1) ? true : false;
    $("#inputFeatSelectMultiple").prop('checked', checkBoxState);
    $("#inputFeatCode").val(feat.Feat.code);

    $("#inputContentSource").val(feat.Feat.contentSrc);

    const GENERAL_TAG_ID = 8; // Hardcoded General and Skill Tag IDs
    const SKILL_TAG_ID = 9;
    for(let featTag of feat.Tags){
        if(featTag.id != GENERAL_TAG_ID && featTag.id != SKILL_TAG_ID){
            $("#inputFeatTags").find('option[value='+featTag.id+']').attr('selected','selected');
        }
    }
    $("#inputFeatTags").trigger("chosen:updated");
    $("#inputBuilderType").trigger("change");


    if(feat.Feat.genericType === 'CLASS-FEAT'){
        let classID = getClassIDFromFeat(feat);
        if(classID != null){
            $('#inputClassOptions').val(classID);
        }
    } else if(feat.Feat.genericType === 'ANCESTRY-FEAT'){
        let ancestryID = getAncestryIDFromFeat(feat);
        if(ancestryID != null){
            $('#inputAncestryOptions').val(ancestryID);
        }
    } else if(feat.Feat.genericType === 'ARCHETYPE-FEAT'){
      let archetypeID = getArchetypeIDFromFeat(feat);
      if(archetypeID != null){
          $('#inputArchetypeOptions').val(archetypeID);
      }
    }

    $("#updateFeatButton").click(function(){
        $(this).unbind();
        finishFeat(true);
    });

});

function getClassIDFromFeat(feat){
    for(const [classID, classData] of g_classMap.entries()){
        if(classData.Class.isArchived === 0 && classData.Class.name === feat.Feat.genTypeName){
            return classID;
        }
    }
    return null;
}

function getAncestryIDFromFeat(feat){
    for(const [ancestryID, ancestryData] of g_ancestryMap.entries()){
        if(ancestryData.Ancestry.isArchived === 0 && ancestryData.Ancestry.name === feat.Feat.genTypeName){
            return ancestryID;
        }
    }
    for(const uniHeritage of g_uniHeritageArray){
        if(uniHeritage.isArchived === 0 && uniHeritage.name === feat.Feat.genTypeName){
            return uniHeritage.name;
        }
    }
    return null;
}

function getArchetypeIDFromFeat(feat){
  for(const archetype of g_archetypeArray){
      if(archetype.isArchived === 0 && archetype.name === feat.Feat.genTypeName){
          return archetype.name;
      }
  }
  return null;
}