/* Copyright (C) 2020, Wanderer's Guide, all rights reserved.
    By Aaron Cassar.
*/

// ========================================================================================= //
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ Wanderer's Guide Code ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ //
// ========================================================================================= //

let supportedWebLinks = [
    {Website: '2e.aonprd.com', Title: 'Archives of Nethys - 2e'},
    {Website: 'pf2.easytool.es', Title: 'PF2 EasyTool'},
    {Website: 'pathfinder2.dragonlash.com', Title: 'Dragonlash - 2e'},
    {Website: 'pf2srd.com', Title: 'PF2SRD'},
    {Website: 'pf2.d20pfsrd.com', Title: 'Pf2 Srd'},
    {Website: 'youtube.com', Title: 'YouTube'},
    {Website: 'paizo.com', Title: 'Paizo'},
];

function processText(text, isSheet, isJustified = false, size = 'MEDIUM', indexConditions = true) {
    if(text == null) {return text;}

    let _j;
    if(isJustified == null){
        _j = ' has-text-center-justified ';
    } else {
        _j = (isJustified) ? ' has-text-justified ' : '';
    }
    let _s = '';

    let _incS = '';
    switch(size) {
        case 'SMALL':
            _s = ' is-size-7 '; _incS = ' is-size-6 '; break;
        case 'MEDIUM':
            _s = ' is-size-6 '; _incS = ' is-size-5 '; break;
        case 'LARGE':
            _s = ' is-size-5 '; _incS = ' is-size-4 '; break;
        default:
            break;
    }

    // Wrap in a paragraph
    text = '<p class="p-1 pl-2 '+_j+_s+'">'+text+'</p>';

    // ---- - Makes horizontal divider
    text = text.replace(/\n\-\-\-\-/g, '<hr class="m-1">');

    // ***word*** - Makes word bigger and bold
    text = text.replace(/\*\*\*(.+?)\*\*\*/g, '<strong class="is-bold-very'+_incS+'">$1</strong>');

    // **word** - Makes word bold
    text = text.replace(/\*\*(.+?)\*\*/g, '<strong class="is-bold">$1</strong>');

    // __word__ - Makes word italicized
    text = text.replace(/\_\_(.+?)\_\_/g, '<em>$1</em>');

    // ~~word~~ - Makes word strikethrough
    text = text.replace(/\~\~(.+?)\~\~/g, '<s>$1</s>');

    // ~ Some Text Here: Other Text
    let regexNonBulletList = /[\n]?\~(.+?)\:/g;
    text = text.replace(regexNonBulletList, '</p><p class="pl-2 pr-1 negative-indent has-text-left '+_s+'"><strong class="is-bold">$1</strong>');

    // * Some Text Here: Other Text
    let regexBulletList = /[\n]?\*(.+?)\:/g;
    text = text.replace(regexBulletList, '</p><p class="pl-2 pr-1 negative-indent has-text-left '+_s+'">&#x2022;<strong class="is-bold">$1</strong>');

    // :> Some Text
    let regexNonBulletSpacedList = /[\n]?\:\> /g;
    text = text.replace(regexNonBulletSpacedList, '</p><p class="pl-4 ml-1 pr-1 has-text-left '+_s+'">');

    // \n -> Newline
    text = text.replace(/\n/g, '</p><p class="p-1 pl-2 '+_j+_s+'">');

    // Website Link - [URL]
    let regexURL = /\[(.+?)\]/g;
    text = text.replace(regexURL, handleLink);

    if(isSheet){
        // {WIS_MOD} -> Character Wisdom Modifier (unsigned)
        // {WIS_MOD|Wisdom Modifier} -> Character Wisdom Modifier (unsigned). Can hover over to reveal text.
        // {+WIS_MOD} ->  Character Wisdom Modifier (signed)
        let regexSheetVariables = /\{(.+?)\}/g;
        text = text.replace(regexSheetVariables, handleSheetVariables);

    }

    // (Feat: Striking | Strike)
    let regexFeatLinkExt = /\((Feat|Ability|Action|Activity):\s*([^(:]+?)\s*\|\s*(.+?)\s*\)/ig;
    if(true) {
        text = text.replace(regexFeatLinkExt, handleFeatLinkExt);
    } else {
        text = text.replace(regexFeatLinkExt, '$2');
    }

    // (Feat: Strike)
    let regexFeatLink = /\((Feat|Ability|Action|Activity):\s*([^(:]+?)\s*\)/ig;
    if(true) {
        text = text.replace(regexFeatLink, handleFeatLink);
    } else {
        text = text.replace(regexFeatLink, '$2');
    }

    // (Item: Striking | Strike)
    let regexItemLinkExt = /\((Item):\s*([^(:]+?)\s*\|\s*(.+?)\s*\)/ig;
    if(true) {
        text = text.replace(regexItemLinkExt, handleItemLinkExt);
    } else {
        text = text.replace(regexItemLinkExt, '$2');
    }

    // (Item: Strike)
    let regexItemLink = /\((Item):\s*([^(:]+?)\s*\)/ig;
    if(true) {
        text = text.replace(regexItemLink, handleItemLink);
    } else {
        text = text.replace(regexItemLink, '$2');
    }

    // (Spell: Striking | Strike)
    let regexSpellLinkExt = /\((Spell):\s*([^(:]+?)\s*\|\s*(.+?)\s*\)/ig;
    if(true) {
        text = text.replace(regexSpellLinkExt, handleSpellLinkExt);
    } else {
        text = text.replace(regexSpellLinkExt, '$2');
    }

    // (Spell: Strike)
    let regexSpellLink = /\((Spell):\s*([^(:]+?)\s*\)/ig;
    if(true) {
        text = text.replace(regexSpellLink, handleSpellLink);
    } else {
        text = text.replace(regexSpellLink, '$2');
    }

    // (Language: Gnomish-like | Gnomish)
    let regexLanguageLinkExt = /\((Language):\s*([^(:]+?)\s*\|\s*(.+?)\s*\)/ig;
    if(true) {
        text = text.replace(regexLanguageLinkExt, handleLanguageLinkExt);
    } else {
        text = text.replace(regexLanguageLinkExt, '$2');
    }

    // (Language: Gnomish)
    let regexLanguageLink = /\((Language):\s*([^(:]+?)\s*\)/ig;
    if(true) {
        text = text.replace(regexLanguageLink, handleLanguageLink);
    } else {
        text = text.replace(regexLanguageLink, '$2');
    }

    // (Trait: Infusing | Infused)
    let regexTraitLinkExt = /\((Trait):\s*([^(:]+?)\s*\|\s*(.+?)\s*\)/ig;
    if(true) {
        text = text.replace(regexTraitLinkExt, handleTraitLinkExt);
    } else {
        text = text.replace(regexTraitLinkExt, '$2');
    }

    // (Trait: Infused)
    let regexTraitLink = /\((Trait):\s*([^(:]+?)\s*\)/ig;
    if(true) {
        text = text.replace(regexTraitLink, handleTraitLink);
    } else {
        text = text.replace(regexTraitLink, '$2');
    }

    // Conditions Search and Replace
    if(true && indexConditions) {
        text = handleIndexConditions(text);
    }

    // FREE-ACTION
    // REACTION
    // ONE-ACTION
    // TWO-ACTIONS
    // THREE-ACTIONS
    text = text.replace(/FREE-ACTION/g, '<span class="pf-icon">[free-action]</span>');
    text = text.replace(/REACTION/g, '<span class="pf-icon">[reaction]</span>');
    text = text.replace(/ONE-ACTION/g, '<span class="pf-icon">[one-action]</span>');
    text = text.replace(/TWO-ACTIONS/g, '<span class="pf-icon">[two-actions]</span>');
    text = text.replace(/THREE-ACTIONS/g, '<span class="pf-icon">[three-actions]</span>');


    // Critical Success:text
    // Success:text
    // Failure:text
    // Critical Failure:text
    text = text.replace('Critical Success:','</p><p class="pl-2 pr-1 negative-indent has-text-left '+_s+'"><strong class="is-bold">Critical Success</strong>');
    text = text.replace('Success:','</p><p class="pl-2 pr-1 negative-indent has-text-left '+_s+'"><strong class="is-bold">Success</strong>');
    text = text.replace('Critical Failure:','</p><p class="pl-2 pr-1 negative-indent has-text-left '+_s+'"><strong class="is-bold">Critical Failure</strong>');
    text = text.replace('Failure:','</p><p class="pl-2 pr-1 negative-indent has-text-left '+_s+'"><strong class="is-bold">Failure</strong>');

    // page ### -> Core Rulebook Link
    let regexCoreRules = /page\s+(\d+)/g;
    text = text.replace(regexCoreRules, '<a href="https://paizo.com/products/btq01zp3?Pathfinder-Core-Rulebook" target="_blank" class="external-link">page $1</a>');

    // Bestiary pg. ### -> Bestiary Link
    let regexBestiary = /Bestiary pg\.\s+(\d+)/g;
    text = text.replace(regexBestiary, '<a href="https://paizo.com/products/btq01zp4?Pathfinder-Bestiary" target="_blank" class="external-link">Bestiary $1</a>');

    // Clean up any random spaces that were created...
    text = text.replace('<p class="p-1 pl-2 '+_j+_s+'"></p>', '');
    return text;

}

/////

function handleFeatLink(match, linkName, innerTextName) {
    return handleFeatLinkExt(match, linkName, innerTextName, innerTextName);
}

function handleFeatLinkExt(match, linkName, innerTextDisplay, innerTextName) {
    let innerTextNameUpper = innerTextName.replace(/’/g,'\'').toUpperCase();
    for(const [featID, featStruct] of g_featMap.entries()){
        let featName = featStruct.Feat.name.toUpperCase();
        if(innerTextNameUpper === featName && featStruct.Feat.isArchived == 0) {
            let featLinkClass = 'featTextLink'+featStruct.Feat.id;
            let featLinkText = '<span class="'+featLinkClass+' has-text-info-lighter cursor-clickable">'+innerTextDisplay+'</span>';
            setTimeout(function() {
                $('.'+featLinkClass).off('click');
                $('.'+featLinkClass).click(function(){
                    openQuickView('featView', {
                        Feat : featStruct.Feat,
                        Tags : featStruct.Tags,
                        _prevBackData: {Type: g_QViewLastType, Data: g_QViewLastData},
                    }, $('#quickviewDefault').hasClass('is-active'));
                });
            }, 100);
            return featLinkText;
        }
    }
    if(isFeatHidden(innerTextNameUpper)){
        return innerTextName;
    } else {
        return '<span class="has-text-danger">Unknown '+capitalizeWord(linkName)+'</span>';
    }
}


function handleItemLink(match, linkName, innerTextName) {
    return handleItemLinkExt(match, linkName, innerTextName, innerTextName);
}

function handleItemLinkExt(match, linkName, innerTextDisplay, innerTextName) {
    innerTextName = innerTextName.replace(/’/g,'\'').toUpperCase();
    for(const [itemID, itemDataStruct] of g_itemMap.entries()){
        let itemName = itemDataStruct.Item.name.replace(/[\(\)]/g,'').toUpperCase();
        if(innerTextName === itemName && itemDataStruct.Item.isArchived == 0) {
            let itemLinkClass = 'itemTextLink'+itemDataStruct.Item.id;
            let itemLinkText = '<span class="'+itemLinkClass+' has-text-info-lighter cursor-clickable">'+innerTextDisplay+'</span>';
            setTimeout(function() {
                $('.'+itemLinkClass).off('click');
                $('.'+itemLinkClass).click(function(){
                    openQuickView('itemView', {
                        ItemDataStruct : itemDataStruct,
                        _prevBackData: {Type: g_QViewLastType, Data: g_QViewLastData},
                    }, $('#quickviewDefault').hasClass('is-active'));
                });
            }, 100);
            return itemLinkText;
        }
    }
    return '<span class="has-text-danger">Unknown Item</span>';
}


function handleSpellLink(match, linkName, innerTextName) {
    return handleSpellLinkExt(match, linkName, innerTextName, innerTextName);
}

function handleSpellLinkExt(match, linkName, innerTextDisplay, innerTextName) {
    innerTextName = innerTextName.replace(/’/g,'\'').toUpperCase();
    for(const [spellID, spellDataStruct] of g_spellMap.entries()){
        let spellName = spellDataStruct.Spell.name.toUpperCase();
        if(innerTextName === spellName && spellDataStruct.Spell.isArchived == 0) {
            let spellLinkClass = 'spellTextLink'+spellDataStruct.Spell.id;
            let spellLinkText = '<span class="'+spellLinkClass+' has-text-info-lighter cursor-clickable">'+innerTextDisplay+'</span>';
            setTimeout(function() {
                $('.'+spellLinkClass).off('click');
                $('.'+spellLinkClass).click(function(){
                    openQuickView('spellView', {
                        SpellDataStruct: spellDataStruct,
                        _prevBackData: {Type: g_QViewLastType, Data: g_QViewLastData},
                    }, $('#quickviewDefault').hasClass('is-active'));
                });
            }, 100);
            return spellLinkText;
        }
    }
    return '<span class="has-text-danger">Unknown Spell</span>';
}


function handleLanguageLink(match, linkName, innerTextName) {
    return handleLanguageLinkExt(match, linkName, innerTextName, innerTextName);
}

function handleLanguageLinkExt(match, linkName, innerTextDisplay, innerTextName) {
    innerTextName = innerTextName.replace(/’/g,'\'').toUpperCase();
    for(const language of g_allLanguages){
        let langName = language.name.toUpperCase();
        if(innerTextName === langName) {
            let langLinkClass = 'langTextLink'+language.id;
            let langLinkText = '<span class="'+langLinkClass+' has-text-info-lighter cursor-clickable">'+innerTextDisplay+'</span>';
            setTimeout(function() {
                $('.'+langLinkClass).off('click');
                $('.'+langLinkClass).click(function(){
                    openQuickView('languageView', {
                        Language : language,
                        _prevBackData: {Type: g_QViewLastType, Data: g_QViewLastData},
                    }, $('#quickviewDefault').hasClass('is-active'));
                });
            }, 100);
            return langLinkText;
        }
    }
    return '<span class="has-text-danger">Unknown Language</span>';
}


function handleTraitLink(match, linkName, innerTextName) {
    return handleTraitLinkExt(match, linkName, innerTextName, innerTextName);
}

function handleTraitLinkExt(match, linkName, innerTextDisplay, innerTextName) {
    let traitLinkClass = 'traitTextLink'+(innerTextName.replace(/[' ]/g, ''));
    let traitLinkText = '<span class="'+traitLinkClass+' is-underlined-info cursor-clickable">'+innerTextDisplay+'</span>';
    setTimeout(function() {
        $('.'+traitLinkClass).off('click');
        $('.'+traitLinkClass).click(function(){
            openQuickView('tagView', {
                TagName : innerTextName,
                _prevBackData: {Type: g_QViewLastType, Data: g_QViewLastData},
            }, $('#quickviewDefault').hasClass('is-active'));
        });
    }, 100);
    return traitLinkText;
}

/////

function handleIndexConditions(text){

    for(const condition of g_allConditions){
        let conditionName = condition.name.toLowerCase();
        let conditionLinkClass = 'conditionTextLink'+conditionName.replace(/ /g,'-');
        let conditionLinkText = ' <span class="'+conditionLinkClass+' is-underlined-info cursor-clickable">'+conditionName+'</span>';
        let conditionNameRegex = new RegExp(' '+conditionName, "g");
        text = text.replace(conditionNameRegex, conditionLinkText);
        setTimeout(function() {
            $('.'+conditionLinkClass).off('click');
            $('.'+conditionLinkClass).click(function(){
                openQuickView('conditionView', {
                    Condition : condition,
                    _prevBackData: {Type: g_QViewLastType, Data: g_QViewLastData},
                }, $('#quickviewDefault').hasClass('is-active'));
            });
        }, 100);
    }

    return text;
}

/////

function handleLink(match, innerTextURL) {
    let urlObj = null;
    try {
        urlObj = new URL(innerTextURL);
    } catch(err) {
        displayError("Invalid URL: \'"+innerTextURL+"\'");
        return '['+innerTextURL+']';
    }
    let websiteName = urlObj.hostname;
    if(websiteName.startsWith('www.')){ websiteName = websiteName.substring(4); }
    let foundWebsite = supportedWebLinks.find(website => {
        return website.Website == websiteName;
    });
    if(foundWebsite != null){
        return '<a href="'+urlObj.href+'" target="_blank" rel="external" class="has-tooltip-top" data-tooltip="'+foundWebsite.Title+' Link"><img width="16" height="16" src="https://www.google.com/s2/favicons?domain='+foundWebsite.Website+'"></img></a>';
    } else {
        return '['+innerTextURL+']';
    }
}


/////////////// SHEET VARIABLES ///////////////
function handleSheetVariables(match, innerText){
    if(innerText.includes("|")){
        let innerTextData = innerText.split("|");
        innerTextVariable = innerTextData[0].replace(/\s/g, "").toUpperCase();
        let sheetVar = acquireSheetVariable(innerTextVariable);
        sheetVar = (sheetVar != null) ? sheetVar : '<span class="has-text-danger">Unknown Variable</span>';
        return '<a class="has-text-info has-tooltip-top" data-tooltip="'+innerTextData[1]+'">'+sheetVar+'</a>';
    } else {
        innerText = innerText.replace(/\s/g, "").toUpperCase();
        let sheetVar = acquireSheetVariable(innerText);
        sheetVar = (sheetVar != null) ? sheetVar : '<span class="has-text-danger">Unknown Variable</span>';
        return '<span class="has-text-info">'+sheetVar+'</span>';
    }
}

function acquireSheetVariable(variableName){
    if(variableName.charAt(0) === '+') {
        variableName = variableName.substring(1);
        if(variableName.slice(-3) === "_DC") {
            variableName = variableName.slice(0, -3);
            return signNumber(getStatTotal(variableName)+10);
        } else if(variableName.slice(-4) === "_MOD") {
            variableName = variableName.slice(0, -4);
            return signNumber(getModOfValue(variableName));
        } else {
            return signNumber(getStatTotal(variableName));
        }
    } else {
        if(variableName.slice(-3) === "_DC") {
            variableName = variableName.slice(0, -3);
            return getStatTotal(variableName)+10;
        } else if(variableName.slice(-4) === "_MOD") {
            variableName = variableName.slice(0, -4);
            return getModOfValue(variableName);
        } else {
            return getStatTotal(variableName);
        }
    }
}

