/* Copyright (C) 2021, Wanderer's Guide, all rights reserved.
    By Aaron Cassar.
*/

let socket = io();

// ~~~~~~~~~~~~~~ // Run on Load // ~~~~~~~~~~~~~~ //
$(function () {

    // ~ Content Sources ~ //
    for(let contSrcData of g_contentSources){
      if(g_currentContentSource === contSrcData.CodeName){
        $("#inputContentSource").append('<option value="'+contSrcData.CodeName+'" selected>'+contSrcData.TextName+'</option>');
      } else {
        $("#inputContentSource").append('<option value="'+contSrcData.CodeName+'">'+contSrcData.TextName+'</option>');
      }
    }
    // ~ ~~~~~~~~~~~~~~~ ~ //

    $("#inputTags").chosen();

    $("#createButton").click(function(){
        $(this).unbind();
        finishExtra(false);
    });

});

function finishExtra(isUpdate){

    let extraName = $("#inputName").val();
    let extraRarity = $("#inputRarity").val();
    let extraDescription = $("#inputDescription").val();
    let extraType = $("#inputExtraType").val();
    let extraLevel = $("#inputLevel").val();
    let extraTags = $("#inputTags").val();
    let extraContentSrc = $("#inputContentSource").val();

    let requestPacket = null;
    let extraID = null;
    if(isUpdate){
        requestPacket = "requestAdminUpdateExtra";
        extraID = getExtraEditorIDFromURL();
    } else {
        requestPacket = "requestAdminAddExtra";
    }

    socket.emit(requestPacket,{
        extraID,
        extraName,
        extraRarity,
        extraDescription,
        extraType,
        extraLevel,
        extraTags,
        extraContentSrc
    });

}

socket.on("returnAdminCompleteExtra", function() {
  window.location.href = '/admin/manage/extra';
});