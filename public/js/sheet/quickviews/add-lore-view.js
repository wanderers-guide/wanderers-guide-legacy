/* Copyright (C) 2020, Wanderer's Guide, all rights reserved.
    By Aaron Cassar.
*/

function openAddLoreQuickview(data) {

    $('#quickViewTitle').html("Add Lore Skill");
    let qContent = $('#quickViewContent');

    qContent.append('<div class="field is-grouped is-grouped-centered mt-2"><div class="control"><input id="addLoreNewLoreName" class="input loreInput" type="text" maxlength="20" placeholder="Lore Type" autocomplete="off"></div></div>');

    qContent.append('<div class="buttons is-centered pt-2"><button id="addLoreAddButton" class="button is-link is-rounded">Add</button></div>');

    $('#addLoreAddButton').click(function(){

        let loreName = $('#addLoreNewLoreName').val();
        
        if(loreName != null && loreName != ''){

          let srcStruct = {
            sourceType: 'user-added',
            sourceLevel: 0,
            sourceCode: loreName+' Lore',
            sourceCodeSNum: 'a',
          };
          socket.emit("requestLoreChange",
            getCharIDFromURL(),
            srcStruct,
            loreName,
            null,
            'T',
            'User-Added'
          );

        }

    });

}