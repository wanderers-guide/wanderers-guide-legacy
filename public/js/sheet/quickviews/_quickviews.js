
// ~~~~~~~~~~~~~~ // Run on Load // ~~~~~~~~~~~~~~ //
$(function () {

    let quickviews = bulmaQuickview.attach();
    
    $('#quickViewClose').click(function(){
        $('#quickviewDefault').removeClass('is-active');
    });

    $('#character-sheet-section').click(function(){
        if($('#quickviewDefault').hasClass('quickview-auto-close-protection')){
            $('#quickviewDefault').removeClass('quickview-auto-close-protection');
        } else {
            $('#quickviewDefault').removeClass('is-active');
        }
    });

    // So clicking the manage spells modal will auto-close the quickview
    $('#manageSpellsModalDefault').click(function(){
        if($('#quickviewDefault').hasClass('quickview-auto-close-protection')){
            $('#quickviewDefault').removeClass('quickview-auto-close-protection');
        } else {
            $('#quickviewDefault').removeClass('is-active');
        }
    });

});

function openQuickView(type, data) {

    $('#quickViewTitle').html('');
    $('#quickViewContent').html('');

    $('#quickviewDefault').addClass('quickview-auto-close-protection');
    $('#quickviewDefault').addClass('is-active');

    if(type == 'addSpellView'){
        openAddSpellQuickview(data);
    } else if(type == 'spellView'){
        openSpellQuickview(data);
    } else if(type == 'skillView'){
        openSkillQuickview(data);
    } else if(type == 'abilityScoreView'){
        openAbilityScoreQuickview(data);
    } else if(type == 'heroPointsView'){
        openHeroPointsQuickview(data);
    } else if(type == 'languageView'){
        openLanguageQuickview(data);
    } else if(type == 'featView'){
        openFeatQuickview(data);
    } else if(type == 'savingThrowView'){
        openSavingThrowQuickview(data);
    } else if(type == 'perceptionView'){
        openPerceptionQuickview(data);
    } else if(type == 'invItemView'){
        openInvItemQuickview(data);
    } else if(type == 'customizeItem'){
        openCustomizeItemQuickview(data);
    } else if(type == 'addItemView'){
        openAddItemQuickview(data);
    }

}

