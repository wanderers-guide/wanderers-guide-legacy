
function openActionsTab(data) {

    $('#tabContent').append('<div class="tabs is-centered is-marginless"><ul class="action-tabs"><li><a id="actionTabEncounter">Encounter</a></li><li><a id="actionTabExploration">Exploration</a></li><li><a id="actionTabDowntime">Downtime</a></li></ul></div>');

    let actionsCount = 3;
    if(hasCondition(26)) { // Hardcoded - Quickened condition ID
        actionsCount++;
    }
    let slowedCondition = getCondition(29); // Hardcoded - Slowed condition ID
    if(slowedCondition != null){
        actionsCount -= slowedCondition.Value;
    }
    actionsCount = (actionsCount < 0) ? 0 : actionsCount;

    let filterInnerHTML = '<div class="columns is-mobile is-marginless"><div class="column is-4"><p id="stateNumberOfActions" class="is-size-7 has-text-left">'+actionsCount+' Actions per Turn</p></div><div class="column is-1"><p class="is-size-6 has-text-grey-lighter">Filter</p></div>';
    filterInnerHTML += '<div class="column is-2"><div class="select is-small"><select id="actionFilterSelectBySkill"><option value="core">Core</option>';

    filterInnerHTML += '<option value="others">Miscellaneous</option>';
    filterInnerHTML += '<option value="all">All</option>';
    for(const [skillName, skillData] of data.SkillMap.entries()){
        filterInnerHTML += '<option value="'+skillData.Skill.id+'">Skill - '+skillData.Skill.name+'</option>';
    }

    filterInnerHTML += '</select></div></div><div class="column is-2"><div class="select is-small"><select id="actionFilterSelectByAction"><option value="chooseDefault">By Action</option><option value="OneAction" class="pf-icon">[one-action]</option><option value="TwoActions" class="pf-icon">[two-actions]</option><option value="ThreeActions" class="pf-icon">[three-actions]</option><option value="FreeAction" class="pf-icon">[free-action]</option><option value="Reaction" class="pf-icon">[reaction]</option></select></div></div></div>';

    filterInnerHTML += '<div class="mb-1"><p class="control has-icons-left"><input id="actionFilterSearch" class="input" type="text" placeholder="Search"><span class="icon is-left"><i class="fas fa-search" aria-hidden="true"></i></span></p></div>';

    $('#tabContent').append(filterInnerHTML);

    $('#tabContent').append('<div id="actionTabContent" class="use-custom-scrollbar" style="height: 480px; max-height: 480px; overflow-y: auto;"></div>');


    $('#actionTabEncounter').click(function(){
        changeActionTab('actionTabEncounter', data);
    });

    $('#actionTabExploration').click(function(){
        changeActionTab('actionTabExploration', data);
    });

    $('#actionTabDowntime').click(function(){
        changeActionTab('actionTabDowntime', data);
    });

    $('#'+g_selectedActionSubTabID).click();

}







// Action Tabs //
function changeActionTab(type, data){
    if(!g_selectedSubTabLock) {g_selectedSubTabID = type;}
    g_selectedActionSubTabID = type;

    $('#actionFilterSelectByAction').off('change');
    $('#actionFilterSelectBySkill').off('change');
    $('#actionFilterSearch').off('change');

    $('#actionFilterSelectBySkill').val(g_selectedActionOptionValue);

    $('#actionTabContent').html('');

    $('#actionTabEncounter').parent().removeClass("is-active");
    $('#actionTabExploration').parent().removeClass("is-active");
    $('#actionTabDowntime').parent().removeClass("is-active");

    $('#'+type).parent().addClass("is-active");


    let actionFilterSelectByAction = $('#actionFilterSelectByAction');
    if(actionFilterSelectByAction.val() == "chooseDefault"){
        actionFilterSelectByAction.parent().removeClass('is-info');
        actionFilterSelectByAction.removeClass('pf-icon');
    } else {
        actionFilterSelectByAction.parent().addClass('is-info');
        actionFilterSelectByAction.addClass('pf-icon');
    }
    actionFilterSelectByAction.blur();

    let actionFilterSelectBySkill = $('#actionFilterSelectBySkill');
    actionFilterSelectBySkill.parent().addClass('is-info');
    actionFilterSelectBySkill.blur();

    let actionFilterSearch = $('#actionFilterSearch');
    if(actionFilterSearch.val() == ""){
        actionFilterSearch.removeClass('is-info');
    } else {
        actionFilterSearch.addClass('is-info');
        actionFilterSelectByAction.parent().removeClass('is-info');
        actionFilterSelectBySkill.parent().removeClass('is-info');
    }

    $('#actionFilterSelectByAction').change(function(){
        actionFilterSearch.val('');
        changeActionTab(type, data);
    });

    $('#actionFilterSelectBySkill').change(function(){
        actionFilterSearch.val('');
        g_selectedActionOptionValue = $(this).val();
        changeActionTab(type, data);
    });

    $('#actionFilterSearch').change(function(){
        changeActionTab(type, data);
    });


    if(type != 'actionTabEncounter') {
        $('#stateNumberOfActions').addClass('is-hidden');
        actionFilterSelectByAction.parent().addClass('is-hidden');
    } else {
        $('#stateNumberOfActions').removeClass('is-hidden');
        actionFilterSelectByAction.parent().removeClass('is-hidden');
    }

    switch(type) {
        case 'actionTabEncounter': filterActionArray(data, data.EncounterFeatStructArray); break;
        case 'actionTabExploration': filterActionArray(data, data.ExplorationFeatStructArray); break;
        case 'actionTabDowntime': filterActionArray(data, data.DowntimeFeatStructArray); break;
        default: break;
    }

}

function filterActionArray(data, featStructArray){

    let actionCount = 0;
    for(const featStruct of featStructArray){
        if(featStruct.Feat.isArchived === 1){continue;}

        let willDisplay = true;

        let actionFilterSearch = $('#actionFilterSearch');
        if(actionFilterSearch.val() == ''){

            let actionFilterSelectByAction = $('#actionFilterSelectByAction');
            if(actionFilterSelectByAction.val() != "chooseDefault" && actionFilterSelectByAction.is(":visible")){
                if(actionFilterSelectByAction.val() == "OneAction"){
                    if(featStruct.Feat.actions != 'ACTION'){
                        willDisplay = false;
                    }
                } else if(actionFilterSelectByAction.val() == "OneAction"){
                    if(featStruct.Feat.actions != 'ACTION'){
                        willDisplay = false;
                    }
                } else if(actionFilterSelectByAction.val() == "TwoActions"){
                    if(featStruct.Feat.actions != 'TWO_ACTIONS'){
                        willDisplay = false;
                    }
                } else if(actionFilterSelectByAction.val() == "ThreeActions"){
                    if(featStruct.Feat.actions != 'THREE_ACTIONS'){
                        willDisplay = false;
                    }
                } else if(actionFilterSelectByAction.val() == "FreeAction"){
                    if(featStruct.Feat.actions != 'FREE_ACTION'){
                        willDisplay = false;
                    }
                } else if(actionFilterSelectByAction.val() == "Reaction"){
                    if(featStruct.Feat.actions != 'REACTION'){
                        willDisplay = false;
                    }
                }
            }

            let actionFilterSelectBySkill = $('#actionFilterSelectBySkill');
            if(actionFilterSelectBySkill.val() != "chooseDefault"){
                let filterVal = actionFilterSelectBySkill.val();
                if(filterVal === 'core') {
                    if(featStruct.Feat.isCore !== 1){
                        willDisplay = false;
                    }
                } else if(filterVal === 'others') {
                    if(featStruct.Feat.isCore === 1 || featStruct.Feat.skillID != null){
                        willDisplay = false;
                    }
                } else if(filterVal === 'all') {

                } else {
                    if(featStruct.Feat.skillID != filterVal){
                        willDisplay = false;
                    }
                }
            }

        }

        if(actionFilterSearch.val() != ''){
            let actionSearchInput = actionFilterSearch.val().toLowerCase();
            let featName = featStruct.Feat.name.toLowerCase();
            if(!featName.includes(actionSearchInput)){
                let nameOfTag = featStruct.Tags.find(tag => {
                    return tag.name.toLowerCase().includes(actionSearchInput);
                });
                if(nameOfTag == null){
                    willDisplay = false;
                }
            }
        }

        if(willDisplay){
            displayAction(featStruct, actionCount, data.SkillMap);
        }

        actionCount++;
    }

}

function displayAction(featStruct, actionCount, skillMap) {

    let actionID = 'actionLink'+featStruct.Feat.id+"C"+actionCount;
                
    let actionNameInnerHTML = '<span class="is-size-5">'+featStruct.Feat.name+'</span>';

    let actionActionInnerHTML = '';
    switch(featStruct.Feat.actions) {
        case 'FREE_ACTION': actionActionInnerHTML += '<div class="column is-paddingless is-1 p-1 pt-2"><span class="pf-icon is-size-5">[free-action]</span></div>'; break;
        case 'REACTION': actionActionInnerHTML += '<div class="column is-paddingless is-1 p-1 pt-2"><span class="pf-icon is-size-5">[reaction]</span></div>'; break;
        case 'ACTION': actionActionInnerHTML += '<div class="column is-paddingless is-1 p-1 pt-2"><span class="pf-icon is-size-5">[one-action]</span></div>'; break;
        case 'TWO_ACTIONS': actionActionInnerHTML += '<div class="column is-paddingless is-1 p-1 pt-2"><span class="pf-icon is-size-5">[two-actions]</span></div>'; break;
        case 'THREE_ACTIONS': actionActionInnerHTML += '<div class="column is-paddingless is-1 p-1 pt-2"><span class="pf-icon is-size-5">[three-actions]</span></div>'; break;
        default: break;
    }

    let actionTagsInnerHTML = '<div class="buttons is-marginless is-right">';
    switch(featStruct.Feat.rarity) {
        case 'UNCOMMON': actionTagsInnerHTML += '<button class="button is-marginless mr-2 my-1 is-very-small is-primary">Uncommon</button>';
            break;
        case 'RARE': actionTagsInnerHTML += '<button class="button is-marginless mr-2 my-1 is-very-small is-success">Rare</button>';
            break;
        case 'UNIQUE': actionTagsInnerHTML += '<button class="button is-marginless mr-2 my-1 is-very-small is-danger">Unique</button>';
            break;
        default: break;
    }
    if(featStruct.Feat.skillID != null){
        let skill = null;
        for(const [skillName, skillData] of skillMap.entries()){
            if(skillData.Skill.id == featStruct.Feat.skillID) {
                skill = skillData.Skill;
                break;
            }
        }
        actionTagsInnerHTML += '<button class="button is-marginless mr-2 my-1 is-very-small is-info">'+skill.name+'</button>';
    }

    featStruct.Tags = featStruct.Tags.sort(
        function(a, b) {
            return a.name > b.name ? 1 : -1;
        }
    );
    for(const tag of featStruct.Tags){
        actionTagsInnerHTML += '<button class="button is-marginless mr-2 my-1 is-very-small is-info">'+tag.name+'</button>';
    }
    actionTagsInnerHTML += '</div>';

    
    $('#actionTabContent').append('<div id="'+actionID+'" class="columns is-mobile border-bottom border-dark-lighter cursor-clickable is-marginless mx-2">'+actionActionInnerHTML+'<div class="column is-paddingless"><p class="text-left pl-2 pt-1">'+actionNameInnerHTML+'</p></div><div class="column is-paddingless"><p class="pt-1">'+actionTagsInnerHTML+'</p></div></div>');

    if(actionCount == 0){
        $('#'+actionID).addClass('border-top');
    }
                
    $('#'+actionID).click(function(){
        openQuickView('featView', {
            Feat : featStruct.Feat,
            Tags : featStruct.Tags
        });
    });

    $('#'+actionID).mouseenter(function(){
        $(this).addClass('has-background-grey-darker');
    });
    $('#'+actionID).mouseleave(function(){
        $(this).removeClass('has-background-grey-darker');
    });

}