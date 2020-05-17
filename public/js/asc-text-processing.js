
// ======================================================================================== //
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ Apeiron Styling Code ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ //
// ======================================================================================== //

let supportedWebLinks = [
    {Website: '2e.aonprd.com', Title: 'Archives of Nethys - 2e'},
    {Website: 'pf2.easytool.es', Title: 'PF2 EasyTool'},
    {Website: 'pathfinder2.dragonlash.com', Title: 'Dragonlash - 2e'},
    {Website: 'pf2srd.com', Title: 'PF2SRD'},
    {Website: 'pf2.d20pfsrd.com', Title: 'Pf2 Srd'},
    {Website: 'youtube.com', Title: 'YouTube'},
    {Website: 'paizo.com', Title: 'Paizo'},
];

function processText(text, isSheet) {
    return processText(text, isSheet, false, 'MEDIUM');
}

function processText(text, isSheet, isJustified, size) {
    if(text == null) {return text;}

    let _j = (isJustified) ? ' has-text-justified ' : '';
    let _s = '';
    switch(size) {
        case 'SMALL':
            _s = ' is-size-7 '; break;
        case 'MEDIUM':
            _s = ' is-size-6 '; break;
        case 'LARGE':
            _s = ' is-size-5 '; break;
        default:
            break;
    }

    // Wrap in a paragraph
    text = '<p class="p-1 pl-2 '+_j+_s+'">'+text+'</p>';

    // <n> -> Newline
    text = text.replace(/<n>/g, '</p><p class="p-1 pl-2 '+_j+_s+'">');

    // > Some Text Here: Other Text
    let regexNonBulletList = /\~(.*?)\:/g;
    text = text.replace(regexNonBulletList, '</p><p class="pl-2 pr-1 negative-indent '+_j+_s+'"><strong>$1</strong>');

    // * Some Text Here: Other Text
    let regexBulletList = /\*(.*?)\:/g;
    text = text.replace(regexBulletList, '</p><p class="pl-2 pr-1 negative-indent '+_j+_s+'">&#x2022;<strong>$1</strong>');

    // Website Link - URL
    let regexURL = /\[(.*?)\]/g;
    text = text.replace(regexURL, handleLink);

    if(isSheet){
        // {WIS_MOD} -> Character Wisdom Modifier (unsigned)
        // {WIS_MOD|Wisdom Modifier} -> Character Wisdom Modifier (unsigned). Can hover over to reveal text.
        // {+WIS_MOD} ->  Character Wisdom Modifier (signed)
        let regexSheetVariables = /\{(.*?)\}/g;
        text = text.replace(regexSheetVariables, handleSheetVariables);
    }

    // FREE-ACTION
    // REACTION
    // ONE-ACTION
    // TWO-ACTIONS
    // THREE-ACTIONS
    text = text.replace('FREE-ACTION', '<span class="pf-icon">[free-action]</span>');
    text = text.replace('REACTION', '<span class="pf-icon">[reaction]</span>');
    text = text.replace('ONE-ACTION', '<span class="pf-icon">[one-action]</span>');
    text = text.replace('TWO-ACTIONS', '<span class="pf-icon">[two-actions]</span>');
    text = text.replace('THREE-ACTIONS', '<span class="pf-icon">[two-actions]</span>');


    // Critical Success:text
    // Success:text
    // Failure:text
    // Critical Failure:text
    text = text.replace('Critical Success:','</p><p class="pl-2 pr-1 negative-indent '+_j+_s+'"><strong>Critical Success</strong>');
    text = text.replace('Success:','</p><p class="pl-2 pr-1 negative-indent '+_j+_s+'"><strong>Success</strong>');
    text = text.replace('Failure:','</p><p class="pl-2 pr-1 negative-indent '+_j+_s+'"><strong>Failure</strong>');
    text = text.replace('Critical Failure:','</p><p class="pl-2 pr-1 negative-indent '+_j+_s+'"><strong>Critical Failure</strong>');

    // page ### -> Core Rulebook Link
    let regexCoreRules = /page\s*(\d+)/g;
    text = text.replace(regexCoreRules, '<a href="https://paizo.com/products/btq01zp3?Pathfinder-Core-Rulebook" target="_blank">page $1</a>');

    // Pathfinder Bestiary ### -> Bestiary Link
    let regexBestiary = /Pathfinder Bestiary\s*(\d+)/g;
    text = text.replace(regexBestiary, '<a href="https://paizo.com/products/btq01zp4?Pathfinder-Bestiary" target="_blank">Pathfinder Bestiary $1</a>');

    return text;

}


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
        return '<a href="'+urlObj.href+'" target="_blank" rel="external" class="has-tooltip-bottom" data-tooltip="'+foundWebsite.Title+' Link"><img width="16" height="16" src="http://www.google.com/s2/favicons?domain='+foundWebsite.Website+'"></img></a>';
    } else {
        return '['+innerTextURL+']';
    }
}


/////////////// SHEET VARIABLES ///////////////
function handleSheetVariables(match, innerText){
    if(innerText.includes("|")){
        let innerTextData = innerText.split("|");
        innerTextVariable = innerTextData[0].replace(/\s/g, "").toUpperCase();
        return '<a class="has-text-link has-tooltip-bottom" data-tooltip="'+innerTextData[1]+'">'+acquireSheetVariable(innerTextVariable)+'</a>';
    } else {
        innerText = innerText.replace(/\s/g, "").toUpperCase();
        return acquireSheetVariable(innerText);
    }
}

function acquireSheetVariable(variableName){
    if(variableName.charAt(0) === '+') {
        variableName = variableName.substring(1);
        if(variableName.slice(-3) === "_DC") {
            variableName = variableName.slice(0, -3);
            return signNumber(getStatTotal(variableName)+10);
        } else {
            return signNumber(getStatTotal(variableName));
        }
    } else {
        if(variableName.slice(-3) === "_DC") {
            variableName = variableName.slice(0, -3);
            return getStatTotal(variableName)+10;
        } else {
            return getStatTotal(variableName);
        }
    }
}

