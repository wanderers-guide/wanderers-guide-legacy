
let socket = io();

// ~~~~~~~~~~~~~~ // Run on Load // ~~~~~~~~~~~~~~ //
$(function () {

    let builderTypeSelection = $("#inputBuilderType");
    builderTypeSelection.change(function(){
        let builderType = $(this).val();
        if(builderType == "GENERAL-FEAT"){
            $("#sectionSkill").addClass('is-hidden');
            $("#sectionMinProf").addClass('is-hidden');
            $("#sectionLevel").removeClass('is-hidden');
            $("#sectionSelectMultiple").removeClass('is-hidden');
        } else if(builderType == "SKILL-FEAT"){
            $("#sectionSkill").removeClass('is-hidden');
            $("#sectionMinProf").addClass('is-hidden');
            $("#sectionLevel").removeClass('is-hidden');
            $("#sectionSelectMultiple").removeClass('is-hidden');
        } else if(builderType == "BASIC-ACTION"){
            $("#sectionSkill").addClass('is-hidden');
            $("#sectionMinProf").addClass('is-hidden');
            $("#sectionLevel").addClass('is-hidden');
            $("#sectionSelectMultiple").addClass('is-hidden');
        } else if(builderType == "SKILL-ACTION"){
            $("#sectionSkill").removeClass('is-hidden');
            $("#sectionMinProf").addClass('is-hidden');
            $("#sectionLevel").addClass('is-hidden');
            $("#sectionSelectMultiple").addClass('is-hidden');
        }
    });
    builderTypeSelection.trigger("change");


    let inputFeatTags = $("#inputFeatTags");
    inputFeatTags.change(function(){
        let tagNames = '- ';
        $(this).find(":selected").each(function(){
            tagNames += $(this).text()+' ';
        });
        $("#selectedTraits").html(tagNames);
    });


    $("#createFeatButton").click(function(){
        $(this).unbind();
        finishFeat(false);
    });

});

function finishFeat(isUpdate){

    let builderType = $("#inputBuilderType").val();
    let featName = $("#inputFeatName").val();
    let featVersion = $("#inputFeatVersion").val();
    let featLevel = ($("#inputFeatLevel").is(":visible")) ? $("#inputFeatLevel").val() : null;
    let featMinProf = ($("#inputFeatMinProf").is(":visible")) ? $("#inputFeatMinProf").val() : null;
    let featSkillID = ($("#inputFeatSkill").is(":visible")) ? $("#inputFeatSkill").val() : null;
    let featActions = $("#inputFeatActions").val();
    let featRarity = $("#inputFeatRarity").val();
    let featTagsArray = $("#inputFeatTags").val();
    let featPrereq = $("#inputFeatPrereq").val();
    let featReq = $("#inputFeatReq").val();
    let featFreq = $("#inputFeatFreq").val();
    let featCost = $("#inputFeatCost").val();
    let featTrigger = $("#inputFeatTrigger").val();
    let featDesc = $("#inputFeatDesc").val();
    let featSpecial = $("#inputFeatSpecial").val();
    let featSelectMultiple = null;
    if($("#inputFeatSelectMultiple").is(":visible")) {
        featSelectMultiple = ($("#inputFeatSelectMultiple:checked").val() == '1') ? 1 : 0;
    }
    let featCode = $("#inputFeatCode").val();

    let featContentSrc = $("#inputContentSource").val();
    
    let requestPacket = null;
    let featID = null;
    if(isUpdate){
        requestPacket = "requestAdminUpdateFeat";
        featID = getFeatEditorIDFromURL();
    } else {
        requestPacket = "requestAdminAddFeat";
    }

    socket.emit(requestPacket,{
        featID,
        builderType,
        featName,
        featVersion,
        featLevel,
        featMinProf,
        featSkillID,
        featActions,
        featRarity,
        featTagsArray,
        featPrereq,
        featReq,
        featFreq,
        featCost,
        featTrigger,
        featDesc,
        featSpecial,
        featSelectMultiple,
        featCode,
        featContentSrc,
    });

}

socket.on("returnAdminCompleteFeat", function() {
    window.location.href = '/admin/manage/feat-action';
});