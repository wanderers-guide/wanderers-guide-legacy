/* Copyright (C) 2020, Wanderer's Guide, all rights reserved.
    By Aaron Cassar.
*/

let socket = io();

let g_classMap = null;
let g_ancestryMap = null;

// ~~~~~~~~~~~~~~ // Run on Load // ~~~~~~~~~~~~~~ //
$(function () {

    socket.emit("requestAdminFeatDetailsPlus");

});

socket.on("returnAdminFeatDetailsPlus", function(featsObject, classObject, ancestryObject){

    g_classMap = objToMap(classObject);
    g_classMap = new Map([...g_classMap.entries()].sort(
        function(a, b) {
            return a[1].Class.name > b[1].Class.name ? 1 : -1;
        })
    );

    g_ancestryMap = objToMap(ancestryObject);
    g_ancestryMap = new Map([...g_ancestryMap.entries()].sort(
        function(a, b) {
            return a[1].Ancestry.name > b[1].Ancestry.name ? 1 : -1;
        })
    );


    $('#inputClassOptions').html('');
    for(const [classID, classData] of g_classMap.entries()){
        if(classData.Class.isArchived === 0){
            $('#inputClassOptions').append('<option value="'+classID+'">'+classData.Class.name+'</option>');
        }
    }

    $('#inputAncestryOptions').html('');
    for(const [ancestryID, ancestryData] of g_ancestryMap.entries()){
        if(ancestryData.Ancestry.isArchived === 0){
            $('#inputAncestryOptions').append('<option value="'+ancestryID+'">'+ancestryData.Ancestry.name+'</option>');
        }
    }

    let builderTypeSelection = $("#inputBuilderType");
    builderTypeSelection.change(function(){
        let builderType = $(this).val();
        if(builderType == "GENERAL-FEAT"){
            $("#sectionSkill").addClass('is-hidden');
            $("#sectionMinProf").addClass('is-hidden');
            $("#sectionLevel").removeClass('is-hidden');
            $("#sectionSelectMultiple").removeClass('is-hidden');
            $("#sectionClassOptions").addClass('is-hidden');
            $("#sectionAncestryOptions").addClass('is-hidden');
        } else if(builderType == "SKILL-FEAT"){
            $("#sectionSkill").removeClass('is-hidden');
            $("#sectionMinProf").addClass('is-hidden');
            $("#sectionLevel").removeClass('is-hidden');
            $("#sectionSelectMultiple").removeClass('is-hidden');
            $("#sectionClassOptions").addClass('is-hidden');
            $("#sectionAncestryOptions").addClass('is-hidden');
        } else if(builderType == "CLASS-FEAT"){
            $("#sectionSkill").addClass('is-hidden');
            $("#sectionMinProf").addClass('is-hidden');
            $("#sectionLevel").removeClass('is-hidden');
            $("#sectionSelectMultiple").removeClass('is-hidden');
            $("#sectionClassOptions").removeClass('is-hidden');
            $("#sectionAncestryOptions").addClass('is-hidden');
        } else if(builderType == "ANCESTRY-FEAT"){
            $("#sectionSkill").addClass('is-hidden');
            $("#sectionMinProf").addClass('is-hidden');
            $("#sectionLevel").removeClass('is-hidden');
            $("#sectionSelectMultiple").removeClass('is-hidden');
            $("#sectionClassOptions").addClass('is-hidden');
            $("#sectionAncestryOptions").removeClass('is-hidden');
        } else if(builderType == "BASIC-ACTION"){
            $("#sectionSkill").addClass('is-hidden');
            $("#sectionMinProf").addClass('is-hidden');
            $("#sectionLevel").addClass('is-hidden');
            $("#sectionSelectMultiple").addClass('is-hidden');
            $("#sectionClassOptions").addClass('is-hidden');
            $("#sectionAncestryOptions").addClass('is-hidden');
        } else if(builderType == "SKILL-ACTION"){
            $("#sectionSkill").removeClass('is-hidden');
            $("#sectionMinProf").addClass('is-hidden');
            $("#sectionLevel").addClass('is-hidden');
            $("#sectionSelectMultiple").addClass('is-hidden');
            $("#sectionClassOptions").addClass('is-hidden');
            $("#sectionAncestryOptions").addClass('is-hidden');
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
    
    let featGenTypeName = null;
    if($("#inputClassOptions").is(":visible")) {
        let classID = $('#inputClassOptions').val();
        let classData = g_classMap.get(classID+"");
        if(classData != null){
            featGenTypeName = classData.Class.name;
        }
        
    } else if($("#inputAncestryOptions").is(":visible")) {
        let ancestryID = $('#inputAncestryOptions').val();
        let ancestryData = g_ancestryMap.get(ancestryID+"");
        if(ancestryData != null){
            featGenTypeName = ancestryData.Ancestry.name;
        }
    }


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
        featGenTypeName,
    });

}

socket.on("returnAdminCompleteFeat", function() {
    window.location.href = '/admin/manage/feat-action';
});