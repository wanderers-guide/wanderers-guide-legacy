/* Copyright (C) 2020, Wanderer's Guide, all rights reserved.
    By Aaron Cassar.
*/

function openOtherProfsQuickview(data) {

    $('#quickViewTitle').html(data.Name);
    $('#quickViewTitleRight').html('<button id="customizeProfBtn" class="button is-very-small is-success is-outlined is-rounded is-pulled-right mr-1">Customize</button>');
    $('#customizeProfBtn').click(function(){
        openQuickView('customizeProfView', {
            ProfData : data.ProfData,
            _prevBackData: {Type: g_QViewLastType, Data: g_QViewLastData},
        });
    });

    let qContent = $('#quickViewContent');

    let profName = getProfNameFromNumUps(data.ProfData.NumUps);
    if(data.ProfData.UserProfOverride){
        qContent.append('<p><strong>Proficiency:</strong> '+profName+' <span class="is-inline pl-1 is-size-7 is-italic"> ( Override )</span></p>');
    } else {
        qContent.append('<p><strong>Proficiency:</strong> '+profName+'</p>');
    }

    let userBonus = data.ProfData.UserBonus;
    if(userBonus != 0){
        qContent.append('<p><strong>Extra Bonus:</strong> '+signNumber(userBonus)+'</p>');
    }

    if(data.ProfData.UserAdded){
        qContent.append('<div class="buttons is-centered is-marginless"><a id="removeUserAddedProfButton" class="button is-small is-danger is-rounded is-outlined mt-3">Remove</a></div>');

        $('#removeUserAddedProfButton').click(function(){ // Remove User-Added and User-Set Profs
            let srcStructAdded = {
                sourceType: 'user-added',
                sourceLevel: 0,
                sourceCode: data.ProfData.OriginalData.To,
                sourceCodeSNum: 'a',
            };
            socket.emit("requestProficiencyChange",
                getCharIDFromURL(),
                {srcStruct : srcStructAdded},
                null
            );

            let srcStructProf = {
                sourceType: 'user-set',
                sourceLevel: 0,
                sourceCode: data.ProfData.OriginalData.To+",,,Prof",
                sourceCodeSNum: 'a',
            };
            socket.emit("requestProficiencyChange",
                getCharIDFromURL(),
                {srcStruct : srcStructProf},
                null
            );

            let srcStructBonus = {
                sourceType: 'user-set',
                sourceLevel: 0,
                sourceCode: data.ProfData.OriginalData.To+",,,Bonus",
                sourceCodeSNum: 'a',
            };
            socket.emit("requestProficiencyChange",
                getCharIDFromURL(),
                {srcStruct : srcStructBonus},
                null
            );
        });

    }

}