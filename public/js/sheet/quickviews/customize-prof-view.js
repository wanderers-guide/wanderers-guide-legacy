
function openCustomizeProfQuickview(data) {
    addBackFunctionality(data);

    $('#quickViewTitle').html("Customize");
    let qContent = $('#quickViewContent');

    qContent.append('<div class="field is-horizontal"><div class="field-label is-normal"><label class="label">Proficiency</label></div><div class="field-body"><div class="field"><div class="control"><div class="select"><select id="customizeProf"><option value="chooseDefault">Default</option><option value="U">Untrained</option><option value="T">Trained</option><option value="E">Expert</option><option value="M">Master</option><option value="L">Legendary</option></select></div></div></div></div></div>');
    qContent.append('<div class="field is-horizontal"><div class="field-label is-normal"><label class="label">Extra Bonus</label></div><div class="field-body"><div class="field"><div class="control"><input id="customizeBonus" class="input" type="number" min="-100" max="100" value="'+data.ProfData.Bonus+'"></div></div></div></div>');

    qContent.append('<div class="buttons is-centered pt-2"><button id="customizeSaveButton" class="button is-link">Save</button></div>');

    if(data.ProfData.OriginalData.UserOverride != null && data.ProfData.OriginalData.UserOverride){
        $('#customizeProf').val(data.ProfData.OriginalData.Prof);
    } else {
        $('#customizeProf').val('chooseDefault');
    }

    console.log(data.ProfData);

    $('#customizeSaveButton').click(function(){

        let prof = $('#customizeProf').val();

        let srcStruct = {
            sourceType: 'user-set',
            sourceLevel: 0,
            sourceCode: data.ProfData.Name,
            sourceCodeSNum: 'a',
        };
        if(prof === 'chooseDefault'){
            socket.emit("requestProficiencyChange",
                getCharIDFromURL(),
                {srcStruct},
                null
            );
        } else {
            socket.emit("requestProficiencyChange",
                getCharIDFromURL(),
                {srcStruct},
                {
                    For : data.ProfData.OriginalData.For,
                    To : data.ProfData.OriginalData.To,
                    Prof : prof
                }
            );
        }

    });

}