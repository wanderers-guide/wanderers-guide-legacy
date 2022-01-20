/* Copyright (C) 2021, Wanderer's Guide, all rights reserved.
    By Aaron Cassar.
*/

let socket = io();
let isBuilderInit = false;

let buildID = null;

// ~~~~~~~~~~~~~~ // General - Run On Load // ~~~~~~~~~~~~~~ //
$(function () {

    buildID = $('#char-builder-container').attr('data-build-id');

    // Change page
    $("#nextButton").click(function(){
      // Hardcoded redirect to page 2
      window.location.href = '/builds/create/?build_id='+buildID+'&page=2';
    });
    initBuilderSteps();
    
    // On load get basic build info
    socket.emit("requestBuildInfo",
        buildID);

});

function initBuilderSteps(){

  $('.builder-basics-page-btn').click(function(){
    window.location.href = '/builds/create/?build_id='+buildID+'&page=init';
  });
  $('.builder-creation-page-btn').click(function(){
    window.location.href = '/builds/create/?build_id='+buildID+'&page=2';
  });
  // Publish btn is set in returnBuildInfo because it needs build object.

}

// ~~~~~~~~~~~~~~ // Processings // ~~~~~~~~~~~~~~ //

socket.on("returnBuildInfo", function(build, hBundles, progessBundles){
    isBuilderInit = true;

    console.log(build);

    $('.builder-finalize-page-btn').click(function(){
      console.log('Complete charater?');
    });

    // When build name changes, save name
    $("#charName").change(function(){

        let validNameRegex = /^[^@#$%^*~=\/\\]+$/;
        if(validNameRegex.test($(this).val())) {
            $(this).removeClass("is-danger");
            $("#charNameSideIcon").addClass("is-hidden");

            $("#charNameControlShell").addClass("is-medium is-loading");
            socket.emit("requestBuildNameChange",
                buildID,
                $(this).val());

        } else {
            $(this).addClass("is-danger");
            $("#charNameSideIcon").removeClass("is-hidden");
        }

    });

    handleBuildOptions(build, hBundles, progessBundles);

    // Turn off page loading
    stopSpinnerLoader();

});

function handleBuildOptions(build, hBundles, progessBundles) {
    displayHomebrewBundles(build, hBundles, progessBundles);

    // Content Sources //
    let contentSourceArray = JSON.parse(build.enabledSources);

    $("#contentSrc-CRB").change(function(){
        socket.emit("requestBuildSourceChange", 
            buildID, 
            'CRB',
            this.checked);
    });
    $("#contentSrc-CRB").prop('checked', contentSourceArray.includes('CRB'));

    $("#contentSrc-ADV-PLAYER-GUIDE").change(function(){
        socket.emit("requestBuildSourceChange", 
            buildID, 
            'ADV-PLAYER-GUIDE',
            this.checked);
    });
    $("#contentSrc-ADV-PLAYER-GUIDE").prop('checked', contentSourceArray.includes('ADV-PLAYER-GUIDE'));

    $("#contentSrc-GM-GUIDE").change(function(){
        socket.emit("requestBuildSourceChange", 
            buildID, 
            'GM-GUIDE',
            this.checked);
    });
    $("#contentSrc-GM-GUIDE").prop('checked', contentSourceArray.includes('GM-GUIDE'));

    $("#contentSrc-SECRETS-OF-MAGIC").change(function(){
        socket.emit("requestBuildSourceChange", 
            buildID, 
            'SECRETS-OF-MAGIC',
            this.checked);
    });
    $("#contentSrc-SECRETS-OF-MAGIC").prop('checked', contentSourceArray.includes('SECRETS-OF-MAGIC'));

    $("#contentSrc-GUNS-AND-GEARS").change(function(){
        socket.emit("requestBuildSourceChange", 
            buildID, 
            'GUNS-AND-GEARS',
            this.checked);
    });
    $("#contentSrc-GUNS-AND-GEARS").prop('checked', contentSourceArray.includes('GUNS-AND-GEARS'));

    $("#contentSrc-DARK-ARCHIVE").change(function(){
      socket.emit("requestBuildSourceChange", 
          buildID, 
          'DARK-ARCHIVE',
          this.checked);
    });
    $("#contentSrc-DARK-ARCHIVE").prop('checked', contentSourceArray.includes('DARK-ARCHIVE'));

    $("#contentSrc-LOST-ANCESTRY-GUIDE").change(function(){
      socket.emit("requestBuildSourceChange", 
          buildID, 
          'LOST-ANCESTRY-GUIDE',
          this.checked);
    });
    $("#contentSrc-LOST-ANCESTRY-GUIDE").prop('checked', contentSourceArray.includes('LOST-ANCESTRY-GUIDE'));
    
    $("#contentSrc-LOST-CHAR-GUIDE").change(function(){
        socket.emit("requestBuildSourceChange", 
            buildID, 
            'LOST-CHAR-GUIDE',
            this.checked);
    });
    $("#contentSrc-LOST-CHAR-GUIDE").prop('checked', contentSourceArray.includes('LOST-CHAR-GUIDE'));

    $("#contentSrc-LOST-CITY-ABSALOM").change(function(){
      socket.emit("requestBuildSourceChange", 
          buildID, 
          'LOST-CITY-ABSALOM',
          this.checked);
    });
    $("#contentSrc-LOST-CITY-ABSALOM").prop('checked', contentSourceArray.includes('LOST-CITY-ABSALOM'));

    $("#contentSrc-LOST-GOD-MAGIC").change(function(){
        socket.emit("requestBuildSourceChange", 
            buildID, 
            'LOST-GOD-MAGIC',
            this.checked);
    });
    $("#contentSrc-LOST-GOD-MAGIC").prop('checked', contentSourceArray.includes('LOST-GOD-MAGIC'));

    $("#contentSrc-LOST-GRAND-BAZAAR").change(function(){
      socket.emit("requestBuildSourceChange", 
          buildID, 
          'LOST-GRAND-BAZAAR',
          this.checked);
    });
    $("#contentSrc-LOST-GRAND-BAZAAR").prop('checked', contentSourceArray.includes('LOST-GRAND-BAZAAR'));

    $("#contentSrc-LOST-LEGENDS").change(function(){
      socket.emit("requestBuildSourceChange", 
          buildID, 
          'LOST-LEGENDS',
          this.checked);
    });
    $("#contentSrc-LOST-LEGENDS").prop('checked', contentSourceArray.includes('LOST-LEGENDS'));

    $("#contentSrc-LOST-MWANGI").change(function(){
      socket.emit("requestBuildSourceChange", 
          buildID, 
          'LOST-MWANGI',
          this.checked);
    });
    $("#contentSrc-LOST-MWANGI").prop('checked', contentSourceArray.includes('LOST-MWANGI'));

    $("#contentSrc-LOST-MONSTERS-MYTH").change(function(){
      socket.emit("requestBuildSourceChange", 
          buildID, 
          'LOST-MONSTERS-MYTH',
          this.checked);
    });
    $("#contentSrc-LOST-MONSTERS-MYTH").prop('checked', contentSourceArray.includes('LOST-MONSTERS-MYTH'));

    $("#contentSrc-LOST-SOCIETY-GUIDE").change(function(){
      socket.emit("requestBuildSourceChange", 
          buildID, 
          'LOST-SOCIETY-GUIDE',
          this.checked);
    });
    $("#contentSrc-LOST-SOCIETY-GUIDE").prop('checked', contentSourceArray.includes('LOST-SOCIETY-GUIDE'));

    $("#contentSrc-LOST-WORLD-GUIDE").change(function(){
        socket.emit("requestBuildSourceChange", 
            buildID, 
            'LOST-WORLD-GUIDE',
            this.checked);
    });
    $("#contentSrc-LOST-WORLD-GUIDE").prop('checked', contentSourceArray.includes('LOST-WORLD-GUIDE'));

    $("#contentSrc-ABOMINATION-VAULTS").change(function(){
      socket.emit("requestBuildSourceChange", 
          buildID, 
          'ABOMINATION-VAULTS',
          this.checked);
    });
    $("#contentSrc-ABOMINATION-VAULTS").prop('checked', contentSourceArray.includes('ABOMINATION-VAULTS'));
    
    $("#contentSrc-AGENTS-OF-EDGEWATCH").change(function(){
      socket.emit("requestBuildSourceChange", 
          buildID, 
          'AGENTS-OF-EDGEWATCH',
          this.checked);
    });
    $("#contentSrc-AGENTS-OF-EDGEWATCH").prop('checked', contentSourceArray.includes('AGENTS-OF-EDGEWATCH'));
    
    $("#contentSrc-AGE-OF-ASHES").change(function(){
        socket.emit("requestBuildSourceChange", 
            buildID, 
            'AGE-OF-ASHES',
            this.checked);
    });
    $("#contentSrc-AGE-OF-ASHES").prop('checked', contentSourceArray.includes('AGE-OF-ASHES'));

    $("#contentSrc-EXTINCTION-CURSE").change(function(){
        socket.emit("requestBuildSourceChange", 
            buildID, 
            'EXTINCTION-CURSE',
            this.checked);
    });
    $("#contentSrc-EXTINCTION-CURSE").prop('checked', contentSourceArray.includes('EXTINCTION-CURSE'));

    $("#contentSrc-FALL-OF-PLAGUE").change(function(){
        socket.emit("requestBuildSourceChange", 
            buildID, 
            'FALL-OF-PLAGUE',
            this.checked);
    });
    $("#contentSrc-FALL-OF-PLAGUE").prop('checked', contentSourceArray.includes('FALL-OF-PLAGUE'));

    $("#contentSrc-FIST-PHOENIX").change(function(){
      socket.emit("requestBuildSourceChange", 
          buildID, 
          'FIST-PHOENIX',
          this.checked);
    });
    $("#contentSrc-FIST-PHOENIX").prop('checked', contentSourceArray.includes('FIST-PHOENIX'));

    $("#contentSrc-MALEVOLENCE").change(function(){
      socket.emit("requestBuildSourceChange", 
          buildID, 
          'MALEVOLENCE',
          this.checked);
    });
    $("#contentSrc-MALEVOLENCE").prop('checked', contentSourceArray.includes('MALEVOLENCE'));

    $("#contentSrc-NIGHT-GRAY-DEATH").change(function(){
      socket.emit("requestBuildSourceChange", 
          buildID, 
          'NIGHT-GRAY-DEATH',
          this.checked);
    });
    $("#contentSrc-NIGHT-GRAY-DEATH").prop('checked', contentSourceArray.includes('NIGHT-GRAY-DEATH'));

    $("#contentSrc-QUEST-FROZEN-FLAME").change(function(){
      socket.emit("requestBuildSourceChange", 
          buildID, 
          'QUEST-FROZEN-FLAME',
          this.checked);
    });
    $("#contentSrc-QUEST-FROZEN-FLAME").prop('checked', contentSourceArray.includes('QUEST-FROZEN-FLAME'));

    $("#contentSrc-SLITHERING").change(function(){
      socket.emit("requestBuildSourceChange", 
          buildID, 
          'SLITHERING',
          this.checked);
    });
    $("#contentSrc-SLITHERING").prop('checked', contentSourceArray.includes('SLITHERING'));

    $("#contentSrc-STRENGTH-THOUSANDS").change(function(){
      socket.emit("requestBuildSourceChange", 
          buildID, 
          'STRENGTH-THOUSANDS',
          this.checked);
    });
    $("#contentSrc-STRENGTH-THOUSANDS").prop('checked', contentSourceArray.includes('STRENGTH-THOUSANDS'));

    $("#contentSrc-TROUBLES-IN-OTARI").change(function(){
      socket.emit("requestBuildSourceChange", 
          buildID, 
          'TROUBLES-IN-OTARI',
          this.checked);
    });
    $("#contentSrc-TROUBLES-IN-OTARI").prop('checked', contentSourceArray.includes('TROUBLES-IN-OTARI'));

    $("#contentSrc-THRESHOLD-KNOWLEDGE").change(function(){
      socket.emit("requestBuildSourceChange", 
          buildID, 
          'THRESHOLD-KNOWLEDGE',
          this.checked);
    });
    $("#contentSrc-THRESHOLD-KNOWLEDGE").prop('checked', contentSourceArray.includes('THRESHOLD-KNOWLEDGE'));

    $("#contentSrc-PATH-SOCIETY").change(function(){
      socket.emit("requestBuildSourceChange", 
          buildID, 
          'PATH-SOCIETY',
          this.checked);
    });
    $("#contentSrc-PATH-SOCIETY").prop('checked', contentSourceArray.includes('PATH-SOCIETY'));

    // Enable All Books Button //
    $('#enableAllBooksBtn').click(function() {
      let newContentSourceArray = [];
      $('.bookSwitch').each(function() {
        newContentSourceArray.push($(this).attr('name').replace('contentSrc-',''));
        $(this).prop('checked', true);
      });
      socket.emit("requestBuildSetSources", 
          buildID, 
          newContentSourceArray);
      $('#enableAllBooksBtn').blur();
    });

    // Variants //
    $("#variantAncestryParagon").change(function(){
      let optionTypeValue = (this.checked) ? 1 : 0;
      socket.emit("requestBuildOptionChange", 
          buildID, 
          'variantAncestryParagon',
          optionTypeValue);
    });
    $("#variantAncestryParagon").prop('checked', (build.variantAncestryParagon === 1));

    $("#variantFreeArchetype").change(function(){
      let optionTypeValue = (this.checked) ? 1 : 0;
      socket.emit("requestBuildOptionChange", 
          buildID, 
          'variantFreeArchetype',
          optionTypeValue);
    });
    $("#variantFreeArchetype").prop('checked', (build.variantFreeArchetype === 1));

    $("#variantGradualAbilityBoosts").change(function(){
      let optionTypeValue = (this.checked) ? 1 : 0;
      socket.emit("requestBuildOptionChange", 
          buildID, 
          'variantGradualAbilityBoosts',
          optionTypeValue);
    });
    $("#variantGradualAbilityBoosts").prop('checked', (build.variantGradualAbilityBoosts === 1));

    $("#variantStamina").change(function(){
      let optionTypeValue = (this.checked) ? 1 : 0;
      socket.emit("requestBuildOptionChange", 
          buildID, 
          'variantStamina',
          optionTypeValue);
      socket.emit("requestBuildSourceChange", 
          buildID, 
          'STAMINA-VARIANT',
          this.checked);
    });
    $("#variantStamina").prop('checked', (build.variantStamina === 1));

    // Options //
    $("#optionClassArchetypes").change(function(){
      let optionTypeValue = (this.checked) ? 1 : 0;
      socket.emit("requestBuildOptionChange", 
          buildID, 
          'optionClassArchetypes',
          optionTypeValue);
      socket.emit("requestBuildSourceChange", 
          buildID, 
          'CLASS-ARCHETYPES-OPTION',
          this.checked);
    });
    $("#optionClassArchetypes").prop('checked', (build.optionClassArchetypes === 1));
    if(build.optionClassArchetypes === 1){
      socket.emit("requestBuildSourceChange", 
          buildID, 
          'CLASS-ARCHETYPES-OPTION',
          true);
    }

    $("#optionCustomCodeBlock").change(function(){
      let optionTypeValue = (this.checked) ? 1 : 0;
      if(optionTypeValue === 1) {
        $("#optionCustomCodeBlockInfo").removeClass('is-hidden');
        $("#option-custom-code-block-container").removeClass('is-hidden');
      } else {
        $("#optionCustomCodeBlockInfo").addClass('is-hidden');
        $("#option-custom-code-block-container").addClass('is-hidden');
      }
      socket.emit("requestBuildOptionChange", 
          buildID, 
          'optionCustomCodeBlock',
          optionTypeValue);
    });
    $("#optionCustomCodeBlock").prop('checked', (build.optionCustomCodeBlock === 1));
    if(build.optionCustomCodeBlock === 1) {
      $("#optionCustomCodeBlockInfo").removeClass('is-hidden');
      $("#option-custom-code-block-container").removeClass('is-hidden');
    }
    $("#inputCustomCodeBlock").blur(function(){
      let newCode = $(this).val();
      if(build.customCode != newCode){
        build.customCode = newCode;
        $('#inputCustomCodeBlock').parent().addClass("is-loading");
        socket.emit("requestBuildCustomCodeBlockChange", buildID, newCode);
      }
    });

}


// ~~~~~~~~~~~~~~ // Processings // ~~~~~~~~~~~~~~ //

socket.on("returnBuildNameChange", function() {
    $("#charNameControlShell").removeClass("is-medium is-loading");
});

//

socket.on("returnBuildSourceChange", function() {
    $(".optionSwitch").blur();
});

socket.on("returnBuildOptionChange", function() {
    $(".optionSwitch").blur();
});

//

socket.on("returnBuildCustomCodeBlockChange", function() {
  $('#inputCustomCodeBlock').parent().removeClass("is-loading");
});

//// Homebrew Bundles ////
function displayHomebrewBundles(build, hBundles, progessBundles){
  let homebrewBundleArray = JSON.parse(build.enabledHomebrew);

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
    $('#homebrewCollectionContainer').append('<div class="field"><input id="'+bundleSwitchID+'" type="checkbox" name="'+bundleSwitchID+'" class="switch is-small is-rounded is-outlined is-info optionSwitch" value="1"><label for="'+bundleSwitchID+'">'+homebrewBundle.name+' <span class="has-txt-noted is-italic">(in progress)</span></label></div>');

    $('#'+bundleSwitchID).change(function(){
      socket.emit('requestBuildHomebrewChange', 
          buildID, 
          homebrewBundle.id,
          this.checked);
    });
    $('#'+bundleSwitchID).prop('checked', homebrewBundleArray.includes(homebrewBundle.id));

  }

  for(let hBundle of hBundles) {
    let homebrewBundle = hBundle.homebrewBundle;
    let bundleSwitchID = 'homebrew-bundle-switch-'+homebrewBundle.id;

    let bundleName = homebrewBundle.name;
    if(homebrewBundle.isPublished === 0){
      bundleName += '<sup class="has-text-info is-size-8 pl-1"><i class="fa fa-wrench"></i></sup>';
    }

    $('#homebrewCollectionContainer').append('<div class="field"><input id="'+bundleSwitchID+'" type="checkbox" name="'+bundleSwitchID+'" class="switch is-small is-rounded is-outlined is-info optionSwitch" value="1"><label for="'+bundleSwitchID+'">'+bundleName+'</label></div>');

    $('#'+bundleSwitchID).change(function(){
      socket.emit('requestBuildHomebrewChange', 
          buildID, 
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

socket.on("returnBuildHomebrewChange", function() {
  $(".optionSwitch").blur();
});
