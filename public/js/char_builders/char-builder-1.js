/* Copyright (C) 2020, Wanderer's Guide, all rights reserved.
    By Aaron Cassar.
*/

let socket = io();
let isBuilderInit = false;


// ~~~~~~~~~~~~~~ // General - Run On Load // ~~~~~~~~~~~~~~ //
$(function () {

    // Change page
    $("#nextButton").click(function(){
        nextPage();
    });
    
    // On load get basic character info
    socket.emit("requestCharacterDetails",
        getCharIDFromURL());

});

// ~~~~~~~~~~~~~~ // Change Page // ~~~~~~~~~~~~~~ //

function nextPage() {
    // Hardcoded redirect
    window.location.href = window.location.href.replace("page1", "page2");
}

// ~~~~~~~~~~~~~~ // Processings // ~~~~~~~~~~~~~~ //

socket.on("returnCharacterDetails", function(character, clientsWithAccess, hBundles, progessBundles){
    isBuilderInit = true;

    displayExternalCharacterAccess(clientsWithAccess);

    // When character name changes, save name
    $("#charName").change(function(){

        let validNameRegex = /^[^@#$%^*~=\/\\]+$/;
        if(validNameRegex.test($(this).val())) {
            $(this).removeClass("is-danger");
            $("#charNameSideIcon").addClass("is-hidden");

            $("#charNameControlShell").addClass("is-medium is-loading");
            socket.emit("requestNameChange",
                getCharIDFromURL(),
                $(this).val());

        } else {
            $(this).addClass("is-danger");
            $("#charNameSideIcon").removeClass("is-hidden");
        }

    });

    // When character level changes, save level
    $("#charLevel").change(function(){
        socket.emit("requestLevelChange",
            getCharIDFromURL(),
            $(this).val());
    });

    // When ability score changes, save them all
    $("#abilSTR").blur(function(){
        deployAbilityScoreChange();
    });
    $("#abilDEX").blur(function(){
        deployAbilityScoreChange();
    });
    $("#abilCON").blur(function(){
        deployAbilityScoreChange();
    });
    $("#abilINT").blur(function(){
        deployAbilityScoreChange();
    });
    $("#abilWIS").blur(function(){
        deployAbilityScoreChange();
    });
    $("#abilCHA").blur(function(){
        deployAbilityScoreChange();
    });

    handleCharacterOptions(character, hBundles, progessBundles);

    // Turn off page loading
    $('.pageloader').addClass("fadeout");

});

function deployAbilityScoreChange(){

    let strVal = $('#abilSTR').val();
    let dexVal = $('#abilDEX').val();
    let conVal = $('#abilCON').val();
    let intVal = $('#abilINT').val();
    let wisVal = $('#abilWIS').val();
    let chaVal = $('#abilCHA').val();

    const MAX_VAL = 30;
    const MIN_VAL = 0;

    if(strVal <= MAX_VAL && dexVal <= MAX_VAL && conVal <= MAX_VAL && intVal <= MAX_VAL && wisVal <= MAX_VAL && chaVal <= MAX_VAL && strVal >= MIN_VAL && dexVal >= MIN_VAL && conVal >= MIN_VAL && intVal >= MIN_VAL && wisVal >= MIN_VAL && chaVal >= MIN_VAL) {
        
        $('.abilScoreSet').removeClass("is-danger");

        socket.emit("requestAbilityScoreChange", 
            getCharIDFromURL(), 
            strVal,
            dexVal,
            conVal,
            intVal,
            wisVal,
            chaVal);

    } else {
        $('.abilScoreSet').addClass("is-danger");
    }
}

function handleCharacterOptions(character, hBundles, progessBundles) {
    displayHomebrewBundles(character, hBundles, progessBundles);

    // Content Sources //
    let contentSourceArray = JSON.parse(character.enabledSources);

    $("#contentSrc-CRB").change(function(){
        socket.emit("requestCharacterSourceChange", 
            getCharIDFromURL(), 
            'CRB',
            this.checked);
    });
    $("#contentSrc-CRB").prop('checked', contentSourceArray.includes('CRB'));

    $("#contentSrc-ADV-PLAYER-GUIDE").change(function(){
        socket.emit("requestCharacterSourceChange", 
            getCharIDFromURL(), 
            'ADV-PLAYER-GUIDE',
            this.checked);
    });
    $("#contentSrc-ADV-PLAYER-GUIDE").prop('checked', contentSourceArray.includes('ADV-PLAYER-GUIDE'));

    $("#contentSrc-GM-GUIDE").change(function(){
        socket.emit("requestCharacterSourceChange", 
            getCharIDFromURL(), 
            'GM-GUIDE',
            this.checked);
    });
    $("#contentSrc-GM-GUIDE").prop('checked', contentSourceArray.includes('GM-GUIDE'));

    $("#contentSrc-SECRETS-OF-MAGIC").change(function(){
        socket.emit("requestCharacterSourceChange", 
            getCharIDFromURL(), 
            'SECRETS-OF-MAGIC',
            this.checked);
    });
    $("#contentSrc-SECRETS-OF-MAGIC").prop('checked', contentSourceArray.includes('SECRETS-OF-MAGIC'));

    $("#contentSrc-LOST-CHAR-GUIDE").change(function(){
        socket.emit("requestCharacterSourceChange", 
            getCharIDFromURL(), 
            'LOST-CHAR-GUIDE',
            this.checked);
    });
    $("#contentSrc-LOST-CHAR-GUIDE").prop('checked', contentSourceArray.includes('LOST-CHAR-GUIDE'));

    $("#contentSrc-LOST-GOD-MAGIC").change(function(){
        socket.emit("requestCharacterSourceChange", 
            getCharIDFromURL(), 
            'LOST-GOD-MAGIC',
            this.checked);
    });
    $("#contentSrc-LOST-GOD-MAGIC").prop('checked', contentSourceArray.includes('LOST-GOD-MAGIC'));

    $("#contentSrc-LOST-LEGENDS").change(function(){
      socket.emit("requestCharacterSourceChange", 
          getCharIDFromURL(), 
          'LOST-LEGENDS',
          this.checked);
    });
    $("#contentSrc-LOST-LEGENDS").prop('checked', contentSourceArray.includes('LOST-LEGENDS'));

    $("#contentSrc-LOST-SOCIETY-GUIDE").change(function(){
      socket.emit("requestCharacterSourceChange", 
          getCharIDFromURL(), 
          'LOST-SOCIETY-GUIDE',
          this.checked);
    });
    $("#contentSrc-LOST-SOCIETY-GUIDE").prop('checked', contentSourceArray.includes('LOST-SOCIETY-GUIDE'));

    $("#contentSrc-LOST-WORLD-GUIDE").change(function(){
        socket.emit("requestCharacterSourceChange", 
            getCharIDFromURL(), 
            'LOST-WORLD-GUIDE',
            this.checked);
    });
    $("#contentSrc-LOST-WORLD-GUIDE").prop('checked', contentSourceArray.includes('LOST-WORLD-GUIDE'));

    $("#contentSrc-AGENTS-OF-EDGEWATCH").change(function(){
      socket.emit("requestCharacterSourceChange", 
          getCharIDFromURL(), 
          'AGENTS-OF-EDGEWATCH',
          this.checked);
    });
    $("#contentSrc-AGENTS-OF-EDGEWATCH").prop('checked', contentSourceArray.includes('AGENTS-OF-EDGEWATCH'));
    
    $("#contentSrc-AGE-OF-ASHES").change(function(){
        socket.emit("requestCharacterSourceChange", 
            getCharIDFromURL(), 
            'AGE-OF-ASHES',
            this.checked);
    });
    $("#contentSrc-AGE-OF-ASHES").prop('checked', contentSourceArray.includes('AGE-OF-ASHES'));

    $("#contentSrc-EXTINCTION-CURSE").change(function(){
        socket.emit("requestCharacterSourceChange", 
            getCharIDFromURL(), 
            'EXTINCTION-CURSE',
            this.checked);
    });
    $("#contentSrc-EXTINCTION-CURSE").prop('checked', contentSourceArray.includes('EXTINCTION-CURSE'));

    $("#contentSrc-FALL-OF-PLAGUE").change(function(){
        socket.emit("requestCharacterSourceChange", 
            getCharIDFromURL(), 
            'FALL-OF-PLAGUE',
            this.checked);
    });
    $("#contentSrc-FALL-OF-PLAGUE").prop('checked', contentSourceArray.includes('FALL-OF-PLAGUE'));

    $("#contentSrc-SLITHERING").change(function(){
      socket.emit("requestCharacterSourceChange", 
          getCharIDFromURL(), 
          'SLITHERING',
          this.checked);
    });
    $("#contentSrc-SLITHERING").prop('checked', contentSourceArray.includes('SLITHERING'));

    // Variants //
    $("#variantAncestryParagon").change(function(){
      let optionTypeValue = (this.checked) ? 1 : 0;
      socket.emit("requestCharacterOptionChange", 
          getCharIDFromURL(), 
          'variantAncestryParagon',
          optionTypeValue);
    });
    $("#variantAncestryParagon").prop('checked', (character.variantAncestryParagon === 1));

    $("#variantFreeArchetype").change(function(){
      let optionTypeValue = (this.checked) ? 1 : 0;
      socket.emit("requestCharacterOptionChange", 
          getCharIDFromURL(), 
          'variantFreeArchetype',
          optionTypeValue);
    });
    $("#variantFreeArchetype").prop('checked', (character.variantFreeArchetype === 1));

    $("#variantProficiencyWithoutLevel").change(function(){
      let optionTypeValue = (this.checked) ? 1 : 0;
      socket.emit("requestCharacterOptionChange", 
          getCharIDFromURL(), 
          'variantProfWithoutLevel',
          optionTypeValue);
    });
    $("#variantProficiencyWithoutLevel").prop('checked', (character.variantProfWithoutLevel === 1));

    // Options //
    $("#optionPublicCharacter").change(function(){
        let optionTypeValue = (this.checked) ? 1 : 0;
        if(optionTypeValue === 1) {
            $("#optionPublicCharacterInfo").removeClass('is-hidden');
        } else {
            $("#optionPublicCharacterInfo").addClass('is-hidden');
        }
        socket.emit("requestCharacterOptionChange", 
            getCharIDFromURL(), 
            'optionPublicCharacter',
            optionTypeValue);
    });
    $("#optionPublicCharacter").prop('checked', (character.optionPublicCharacter === 1));
    if(character.optionPublicCharacter === 1) { $("#optionPublicCharacterInfo").removeClass('is-hidden'); }
    
    $("#optionAutoHeightenSpells").change(function(){
        let optionTypeValue = (this.checked) ? 1 : 0;
        socket.emit("requestCharacterOptionChange", 
            getCharIDFromURL(), 
            'optionAutoHeightenSpells',
            optionTypeValue);
    });
    $("#optionAutoHeightenSpells").prop('checked', (character.optionAutoHeightenSpells === 1));

    $("#optionAutoDetectPreReqs").change(function(){
        let optionTypeValue = (this.checked) ? 1 : 0;
        socket.emit("requestCharacterOptionChange", 
            getCharIDFromURL(), 
            'optionAutoDetectPreReqs',
            optionTypeValue);
    });
    $("#optionAutoDetectPreReqs").prop('checked', (character.optionAutoDetectPreReqs === 1));

}


// ~~~~~~~~~~~~~~ // Processings // ~~~~~~~~~~~~~~ //

socket.on("returnNameChange", function() {
    $("#charNameControlShell").removeClass("is-medium is-loading");
});

socket.on("returnLevelChange", function() {
    $("#charLevel").blur();
});

socket.on("returnAbilityScoreChange", function() {
});

//

socket.on("returnCharacterSourceChange", function() {
    $(".optionSwitch").blur();
});

socket.on("returnCharacterOptionChange", function() {
    $(".optionSwitch").blur();
});


//// Homebrew Bundles ////
function displayHomebrewBundles(character, hBundles, progessBundles){
  let homebrewBundleArray = JSON.parse(character.enabledHomebrew);

  hBundles = hBundles.sort(
    function(a, b) {
      return a.homebrewBundle.name > b.homebrewBundle.name ? 1 : -1;
    }
  );
  progessBundles = progessBundles.sort(
    function(a, b) {
      return a.name > b.name ? 1 : -1;
    }
  );

  for(let progessBundle of progessBundles) {
    let homebrewBundle = progessBundle;
    let bundleSwitchID = 'homebrew-bundle-progess-switch-'+homebrewBundle.id;
    $('#homebrewCollectionContainer').append('<div class="field"><input id="'+bundleSwitchID+'" type="checkbox" name="'+bundleSwitchID+'" class="switch is-small is-rounded is-outlined is-info optionSwitch" value="1"><label for="'+bundleSwitchID+'">'+homebrewBundle.name+' <span class="has-text-grey is-italic">(in progress)</span></label></div>');

    $('#'+bundleSwitchID).change(function(){
      socket.emit('requestCharacterHomebrewChange', 
          getCharIDFromURL(), 
          homebrewBundle.id,
          this.checked);
    });
    $('#'+bundleSwitchID).prop('checked', homebrewBundleArray.includes(homebrewBundle.id));

  }

  for(let hBundle of hBundles) {
    let homebrewBundle = hBundle.homebrewBundle;
    let bundleSwitchID = 'homebrew-bundle-switch-'+homebrewBundle.id;
    $('#homebrewCollectionContainer').append('<div class="field"><input id="'+bundleSwitchID+'" type="checkbox" name="'+bundleSwitchID+'" class="switch is-small is-rounded is-outlined is-info optionSwitch" value="1"><label for="'+bundleSwitchID+'">'+homebrewBundle.name+'</label></div>');

    $('#'+bundleSwitchID).change(function(){
      socket.emit('requestCharacterHomebrewChange', 
          getCharIDFromURL(), 
          homebrewBundle.id,
          this.checked);
    });
    $('#'+bundleSwitchID).prop('checked', homebrewBundleArray.includes(homebrewBundle.id));

  }

  if(hBundles.length > 0){
    let hCollectionContainer = document.getElementById('homebrewColumn');
    if(hCollectionContainer.scrollHeight > hCollectionContainer.clientHeight){
      // container has scrollbar
    } else {
      $('#homebrewCollectionContainer').addClass('pb-3');
      $('#viewHomebrewCollectionBtn').removeClass('is-hidden');
    }
  } else {
    $('#noHomebrewMessage').removeClass('is-hidden');
    $('#viewBrowseHomebrewBtn').removeClass('is-hidden');
  }

  $('#viewHomebrewCollectionBtn').click(function() {
    window.location.href = '/homebrew/?sub_tab=collection';
  });
  $('#viewBrowseHomebrewBtn').click(function() {
    window.location.href = '/homebrew/?sub_tab=browse';
  });

}

socket.on("returnCharacterHomebrewChange", function() {
  $(".optionSwitch").blur();
});

//// External Character Access - API Clients ////

function displayExternalCharacterAccess(clientsWithAccess){
  if(clientsWithAccess != null && clientsWithAccess.length > 0){
    $('.character-access-container').removeClass('is-hidden');
  } else {
    $('.character-access-container').addClass('is-hidden');
    return;
  }

  $('#character-access-content').html('');
  $('#character-access-content').append('<hr class="mt-0 mb-2 mx-0"></hr>');

  let connectionCount = 0;
  for(let client of clientsWithAccess){

    let connectionID = 'accessConnection-'+connectionCount;
    let connectionDeleteIconID = connectionID+'-delete';

    if(connectionCount != 0){ $('#character-access-content').append('<hr class="my-2 mx-4"></hr>'); }

    $('#character-access-content').append('<div id="'+connectionID+'" class="px-3 text-left"></div>');

    $('#'+connectionID).append('<div class="columns is-mobile is-gapless is-marginless"><div class="column is-narrow is-11"><p class="is-bold is-size-5-5">'+client.appName+'</p></div><div class="column is-narrow is-1"><span id="'+connectionDeleteIconID+'" class="icon cursor-clickable has-text-danger text-right"><i class="fas fa-sm fa-minus-circle"></i></span></div></div>');
    if(client.description != null && client.description != ''){
      $('#'+connectionID).append('<div class=""><p>'+client.description+'</p></div>');
    }
    $('#'+connectionID).append('<div class=""><p class="is-bold is-size-7 has-text-info text-center">'+accessRightsToText(client.accessRights)+'</p></div>');

    $('#'+connectionDeleteIconID).click(function() {
      socket.emit("requestCharacterRemoveClientAccess", 
          getCharIDFromURL(), 
          client.clientID);
    });

    connectionCount++;
  }

  $('#character-access-dropdown').click(function() {
    if($('#character-access-content').hasClass("is-hidden")) {
      $('#character-access-content').removeClass('is-hidden');
      $('#character-access-chevron').removeClass('fa-chevron-down');
      $('#character-access-chevron').addClass('fa-chevron-up');
    } else {
      $('#character-access-content').addClass('is-hidden');
      $('#character-access-chevron').removeClass('fa-chevron-up');
      $('#character-access-chevron').addClass('fa-chevron-down');
    }
  });

  $('#character-access-dropdown').mouseenter(function(){
    $(this).addClass('has-background-grey-darker');
  });
  $('#character-access-dropdown').mouseleave(function(){
      $(this).removeClass('has-background-grey-darker');
  });

}

function accessRightsToText(accessRights){
  switch(accessRights) {
    case 'READ-ONLY': return 'Can read character information.';
    case 'READ-UPDATE': return 'Can read and update character information.';
    case 'READ-UPDATE-ADD-DELETE': return 'Can read, update, add, and delete character information.';
    default: return 'ACCESS RIGHTS NOT FOUND';
  }
}

socket.on("returnCharacterRemoveClientAccess", function(clientsWithAccess) {
  displayExternalCharacterAccess(clientsWithAccess);
});