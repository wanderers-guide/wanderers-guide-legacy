
$(function () {

    socket.emit("requestAdminFeatDetails");

});

socket.on("returnAdminFeatDetails", function(featsObject){

    let featMap = objToMap(featsObject);
    
    let feat = featMap.get(getFeatEditorIDFromURL()+"");

    if(feat == null){
        window.location.href = '/admin/manage/feat-action';
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

    const GENERAL_TAG_ID = 8; // Hardcoded General and Skill Tag IDs
    const SKILL_TAG_ID = 9;
    for(let featTag of feat.Tags){
        if(featTag.id != GENERAL_TAG_ID && featTag.id != SKILL_TAG_ID){
            $("#inputFeatTags").find('option[value='+featTag.id+']').attr('selected','selected');
        }
    }
    $("#inputFeatTags").trigger("change");
    $("#inputBuilderType").trigger("change");


    $("#updateFeatButton").click(function(){
        $(this).unbind();
        finishFeat(true);
    });

});