/* Copyright (C) 2021, Wanderer's Guide, all rights reserved.
    By Aaron Cassar.
*/

function openCreatureQuickview(mainData) {

    let data = mainData.data;
    let tags = mainData.tags;


    $('#quickViewTitle').html(data.name);
    $('#quickViewTitleRight').html(`Creature ${data.level}`);

    let qContent = $('#quickViewContent');


    // Traits //
    let traitsInnerHTML = '';

    switch (data.rarity) {
        case 'UNCOMMON': traitsInnerHTML += '<button class="button is-paddingless px-2 is-marginless mr-2 mb-1 is-very-small is-uncommon has-tooltip-bottom has-tooltip-multiline" data-tooltip="Less is known about uncommon creatures than common creatures. They typically can\'t be summoned. The DC of Recall Knowledge checks related to this creature is increased by 2.">Uncommon</button>';
            break;
        case 'RARE': traitsInnerHTML += '<button class="button is-paddingless px-2 is-marginless mr-2 mb-1 is-very-small is-rare has-tooltip-bottom has-tooltip-multiline" data-tooltip="As the name suggests, these creatures are rare. They typically can\'t be summoned. The DC of Recall Knowledge checks related to this creature is increased by 5.">Rare</button>';
            break;
        case 'UNIQUE': traitsInnerHTML += '<button class="button is-paddingless px-2 is-marginless mr-2 mb-1 is-very-small is-unique has-tooltip-bottom has-tooltip-multiline" data-tooltip="A creature with this rarity is one of a kind. The DC of Recall Knowledge checks related to this creature is increased by 10.">Unique</button>';
            break;
        default: break;
    }

    switch (data.alignment) {
        case 'LE': traitsInnerHTML += '<button class="button is-paddingless px-2 is-marginless mr-2 mb-1 is-very-small is-link has-tooltip-bottom" data-tooltip="Lawful and evil">LE</button>';
            break;
        case 'LG': traitsInnerHTML += '<button class="button is-paddingless px-2 is-marginless mr-2 mb-1 is-very-small is-link has-tooltip-bottom" data-tooltip="Lawful and good">LG</button>';
            break;
        case 'LN': traitsInnerHTML += '<button class="button is-paddingless px-2 is-marginless mr-2 mb-1 is-very-small is-link has-tooltip-bottom" data-tooltip="Lawful and neutral">LN</button>';
            break;
        case 'CE': traitsInnerHTML += '<button class="button is-paddingless px-2 is-marginless mr-2 mb-1 is-very-small is-link has-tooltip-bottom" data-tooltip="Chaotic and evil">CE</button>';
            break;
        case 'CG': traitsInnerHTML += '<button class="button is-paddingless px-2 is-marginless mr-2 mb-1 is-very-small is-link has-tooltip-bottom" data-tooltip="Chaotic and good">CG</button>';
            break;
        case 'CN': traitsInnerHTML += '<button class="button is-paddingless px-2 is-marginless mr-2 mb-1 is-very-small is-link has-tooltip-bottom" data-tooltip="Chaotic and neutral">CN</button>';
            break;
        case 'N': traitsInnerHTML += '<button class="button is-paddingless px-2 is-marginless mr-2 mb-1 is-very-small is-link has-tooltip-bottom" data-tooltip="Neutral">N</button>';
            break;
        case 'NE': traitsInnerHTML += '<button class="button is-paddingless px-2 is-marginless mr-2 mb-1 is-very-small is-link has-tooltip-bottom" data-tooltip="Neutral and evil">NE</button>';
            break;
        case 'NG': traitsInnerHTML += '<button class="button is-paddingless px-2 is-marginless mr-2 mb-1 is-very-small is-link has-tooltip-bottom" data-tooltip="Neutral and good">NG</button>';
            break;
        default: break;
    }

    switch (data.size) {
        case 'TINY': traitsInnerHTML += '<button class="button is-paddingless px-2 is-marginless mr-2 mb-1 is-very-small is-link has-tooltip-bottom has-tooltip-multiline" data-tooltip="A Tiny creature takes up less than a 5-foot-by-5- foot space (1 square on the grid), and multiple Tiny creatures can occupy the same square on the grid. At least four Tiny creatures can occupy the same square, and even more can occupy the same square, at the GM’s discretion. They can also occupy the same space as larger creatures, and if their reach is 0 feet, they must do so in order to attack.">Tiny</button>';
            break;
        case 'SMALL': traitsInnerHTML += '<button class="button is-paddingless px-2 is-marginless mr-2 mb-1 is-very-small is-link has-tooltip-bottom has-tooltip-multiline" data-tooltip="A Small creature takes up a 5-foot-by-5-foot space (1 square on the grid) and typically has a reach of 5 feet.">Small</button>';
            break;
        case 'MEDIUM': traitsInnerHTML += '<button class="button is-paddingless px-2 is-marginless mr-2 mb-1 is-very-small is-link has-tooltip-bottom has-tooltip-multiline" data-tooltip="A Medium creature takes up a 5-foot-by-5-foot space (1 square on the grid) and typically has a reach of 5 feet.">Large</button>';
            break;
        case 'LARGE': traitsInnerHTML += '<button class="button is-paddingless px-2 is-marginless mr-2 mb-1 is-very-small is-link has-tooltip-bottom has-tooltip-multiline" data-tooltip="A Large creature takes up a 10-foot-by-10-foot space (4 squares on the grid). It typically has a reach of 10 feet if the creature is tall or 5 feet if the creature is long.">Large</button>';
            break;
        case 'HUGE': traitsInnerHTML += '<button class="button is-paddingless px-2 is-marginless mr-2 mb-1 is-very-small is-link has-tooltip-bottom has-tooltip-multiline" data-tooltip="A Huge creature takes up a 15-foot-by-15-foot space (9 squares on the grid). It typically has a reach of 15 feet if the creature is tall or 10 feet if the creature is long.">Huge</button>';
            break;
        case 'GARGANTUAN': traitsInnerHTML += '<button class="button is-paddingless px-2 is-marginless mr-2 mb-1 is-very-small is-link has-tooltip-bottom has-tooltip-multiline" data-tooltip="A Gargantuan creature takes up a space of at least 20 feet by 20 feet (16 squares on the grid), but can be much larger. Gargantuan creatures typically have a reach of 20 feet if they are tall, or 15 feet if they are long, but larger ones could have a much longer reach.">Gargantuan</button>';
            break;
        default: break;
    }

    let traits = JSON.parse(data.traitsJSON).sort(
        function (a, b) {
            return a > b ? 1 : -1;
        }
    );

    for (const traitName of traits) {

        let tag = tags.find(tag => {
            return tag.name.toLowerCase() === traitName.toLowerCase();
        });

        if (tag == null) { console.error('Unknown trait: ' + traitName); }

        let tagDescription = tag.description;

        if (tagDescription.length > g_tagStringLengthMax) {
            tagDescription = tagDescription.substring(0, g_tagStringLengthMax);
            tagDescription += '...';
        }

        traitsInnerHTML += '<button class="button is-paddingless px-2 is-marginless mr-2 mb-1 is-very-small is-info has-tooltip-bottom has-tooltip-multiline tagButton" data-tooltip="' + processTextRemoveIndexing(tagDescription) + '">' + tag.name + getImportantTraitIcon(tag) + '</button>';
    }

    if (traitsInnerHTML != '') {
        qContent.append('<div class="buttons is-marginless is-centered">' + traitsInnerHTML + '</div>');
        qContent.append('<hr class="mb-2 mt-1">');
    }

    $('.tagButton').click(function () {
        let tagName = $(this).text();
        openQuickView('tagView', {
            TagName: tagName,
            _prevBackData: { Type: g_QViewLastType, Data: g_QViewLastData },
        }, $('#quickviewDefault').hasClass('is-active'));
    });



    // Recall Knowledge //
    // TODO



    // Variables that conditions can change:
    let perception = data.perceptionBonus;
    let skills = JSON.parse(data.skillsJSON);
    let abilityMods = {
        str: data.strMod,
        dex: data.dexMod,
        con: data.conMod,
        int: data.intMod,
        wis: data.wisMod,
        cha: data.chaMod,
    };
    let ac = data.acValue;
    let saves = {
        fort: data.fortBonus,
        reflex: data.reflexBonus,
        will: data.willBonus,
    };
    let hpMax = data.hpMax;




    // Perception //
    qContent.append(`
        <div class="pl-2 pr-1">
            <p class="negative-indent">
                <span><strong>Perception </strong></span><span>${perception}; ${data.senses}</span>
            </p>
        </div>
    `);

    // Languages
    let langStr = '';
    for (let language of JSON.parse(data.languagesJSON)) {
        langStr += language + ', ';
    }
    langStr += data.languagesCustom;
    qContent.append(`
        <div class="pl-2 pr-1">
            <p class="negative-indent">
                <span><strong>Languages </strong></span><span>${langStr}</span>
            </p>
        </div>
    `);

    // Skills //
    let skillStr = '';
    for (let skill of skills) {
        skillStr += `${skill.name} ${skill.bonus}, `;
    }
    qContent.append(`
        <div class="pl-2 pr-1">
            <p class="negative-indent">
                <span><strong>Skills </strong></span><span>${skillStr}</span>
            </p>
        </div>
    `);

    // Ability Mods //
    qContent.append(`
        <div class="pl-2 pr-1">
            <p class="negative-indent">
                <span><strong>Str </strong></span><span>${abilityMods.str}, </span>
                <span><strong>Dex </strong></span><span>${abilityMods.dex}, </span>
                <span><strong>Con </strong></span><span>${abilityMods.con}, </span>
                <span><strong>Int </strong></span><span>${abilityMods.int}, </span>
                <span><strong>Wis </strong></span><span>${abilityMods.wis}, </span>
                <span><strong>Cha </strong></span><span>${abilityMods.cha} </span>
            </p>
        </div>
    `);

    // Interaction Abilities //
    let interactionAbilities = JSON.parse(data.interactionAbilitiesJSON);
    for (let ability of interactionAbilities) {
        // Remove Darkvision or other base machanics like that
        if (ability.description.startsWith(`<p>@Localize[PF2E.NPC.Abilities.Glossary.`)) { continue; }
        addAbility(qContent, ability);
    }

    qContent.append('<hr class="mb-2 mt-1">');

    // AC & Saves //
    qContent.append(`
        <div class="pl-2 pr-1">
            <p class="negative-indent">
                <span><strong>AC </strong></span><span>${ac}; </span>
                <span><strong>Fort </strong></span><span>${saves.fort}, </span>
                <span><strong>Ref </strong></span><span>${saves.reflex}, </span>
                <span><strong>Will </strong></span><span>${saves.will}</span>
                <span>; ${data.allSavesCustom}</span>
            </p>
        </div>
    `);

    // HP, Imm, Weak, Resist //
    let immunitiesStr = '';
    for (let immunity of JSON.parse(data.immunitiesJSON)) {
        immunitiesStr += `${immunity}, `;
    }
    immunitiesStr = immunitiesStr.slice(0, -2);// Trim off that last ', '

    let weaknessesStr = '';
    for (let weakness of JSON.parse(data.weaknessesJSON)) {
        weaknessesStr += `${weakness.type} ${weakness.value}`;
        if (weakness.exceptions != null && weakness.exceptions != '') {
            weaknessesStr += ` (${weakness.exceptions})`;
        }
        weaknessesStr += `, `;
    }
    weaknessesStr = weaknessesStr.slice(0, -2);// Trim off that last ', '

    let resistancesStr = '';
    for (let resistance of JSON.parse(data.resistancesJSON)) {
        resistancesStr += `${resistance.type} ${resistance.value}`;
        if (resistance.exceptions != null && resistance.exceptions != '') {
            resistancesStr += ` (${resistance.exceptions})`;
        }
        resistancesStr += `, `;
    }
    resistancesStr = resistancesStr.slice(0, -2);// Trim off that last ', '

    qContent.append(`
        <div class="pl-2 pr-1">
            <p class="negative-indent">
                <span><strong>HP </strong></span><span>${hpMax}, </span>
                <span>${data.hpDetails}; </span>
                <span><strong>Immunities </strong></span><span>${immunitiesStr}; </span>
                <span><strong>Weaknesses </strong></span><span>${weaknessesStr}; </span>
                <span><strong>Resistances </strong></span><span>${resistancesStr}</span>
            </p>
        </div>
    `);

    // Defensive Abilities //
    let defensiveAbilities = JSON.parse(data.defensiveAbilitiesJSON);
    for (let ability of defensiveAbilities) {
        addAbility(qContent, ability);
    }

    qContent.append('<hr class="mb-2 mt-1">');

    // Speeds //
    let otherSpeedsStr = '';
    for (let otherSpeed of JSON.parse(data.otherSpeedsJSON)) {
        otherSpeedsStr += `, ${otherSpeed.type} ${otherSpeed.value}`;
    }
    qContent.append(`
        <div class="pl-2 pr-1">
            <p class="negative-indent">
                <span><strong>Speed </strong></span><span>${data.speed}${otherSpeedsStr} </span>
            </p>
        </div>
    `);

    // Attacks //
    for (let attack of JSON.parse(data.attacksJSON)) {

        let traitsStr = stringifyTraits(attack.traits, true);

        let agileTrait = attack.traits.find(trait => {
            return trait == 'agile';
        });
        let hasAgile = (agileTrait != null);

        let attackBonus_1 = signNumber(attack.bonus);
        let attackBonus_2 = signNumber(attack.bonus - (hasAgile ? 4 : 5));
        let attackBonus_3 = signNumber(attack.bonus - (hasAgile ? 8 : 10));
        let attackBonusStr = `${attackBonus_1} / ${attackBonus_2} / ${attackBonus_3}`;

        let damageStr = '';
        for (let damage of attack.damage) {
            let damageType = damage.damageType;
            if (damageType.toLowerCase() == 'piercing') { damageType = 'P'; }
            if (damageType.toLowerCase() == 'slashing') { damageType = 'S'; }
            if (damageType.toLowerCase() == 'bludgeoning') { damageType = 'B'; }

            damageStr += `${damage.damage} ${damageType}, `;
        }
        if (attack.effects != null) {
            damageStr += attack.effects;
        } else {
            damageStr = damageStr.slice(0, -2);// Trim off that last ', '
        }

        qContent.append(`
            <div class="">
                ${processText(`~ Melee: ONE-ACTION ${attack.name.toLowerCase()} ${attackBonusStr}${traitsStr}, **Damage** ${damageStr}`, false, false, 'MEDIUM')}
            </div>
        `);

    }

    // Spellcasting //
    // TODO

    // Offensive Abilities //
    let offensiveAbilities = JSON.parse(data.offensiveAbilitiesJSON);
    for (let ability of offensiveAbilities) {
        addAbility(qContent, ability);
    }

    if (data.flavorText != null) {
        qContent.append('<hr class="mb-2 mt-1">');

        qContent.append(`
            <div class="pl-2 pr-2">
                <p><a class="has-text-info is-bold is-italic creature-view-flavor-text">View Description</a></p>
            </div>
        `);

        $('.creature-view-flavor-text').click(function () {
            openQuickView('abilityView', {
                Ability: {
                    name: data.name,
                    description: `<div class="is-italic">${data.flavorText}</div>`,
                    level: 0,
                },
                _prevBackData: { Type: g_QViewLastType, Data: g_QViewLastData },
            }, $('#quickviewDefault').hasClass('is-active'));
        });
    }

}


function addAbility(qContent, ability) {

    let traitsStr = stringifyTraits(ability.traits, true);

    let abilityID = 'creature-ability-' + ability.name.replace(/\W/g, '_');

    let actions = ability.actions;
    if (actions == null) { actions = ''; }


    if (ability.description.startsWith(`<p>@Localize[PF2E.NPC.Abilities.Glossary.`)) {
        // It's just the name of the ability and a link,
        qContent.append(`
            <div class="">
                ${processText(`<span id="${abilityID}-header"><strong class="is-bold">(feat: ${ability.name})</strong></span> ${actions}${traitsStr}`, false, false, 'MEDIUM')}
            </div>
        `);

    } else {

        qContent.append(`
            <div class="">
                ${processText(`<span id="${abilityID}-header" class="cursor-clickable"><span class="icon is-small pr-1"><i id="${abilityID}-chevron" class="fas fas fa-xs fa-chevron-right"></i></span><strong class="is-bold">${ability.name}</strong></span> ${actions}${traitsStr}`, false, false, 'MEDIUM')}
                <div id="${abilityID}-description" class="is-hidden pl-4">
                    ${processText(parseDescription(ability.description), false, false, 'MEDIUM')}
                </div>
            </div>
        `);

        $(`#${abilityID}-header`).click(function () {
            if ($(`#${abilityID}-description`).hasClass("is-hidden")) {
                $(`#${abilityID}-description`).removeClass('is-hidden');
                $(`#${abilityID}-chevron`).removeClass('fa-chevron-right');
                $(`#${abilityID}-chevron`).addClass('fa-chevron-down');
            } else {
                $(`#${abilityID}-description`).addClass('is-hidden');
                $(`#${abilityID}-chevron`).removeClass('fa-chevron-down');
                $(`#${abilityID}-chevron`).addClass('fa-chevron-right');
            }
        });

    }

}

function stringifyTraits(traits, surroundWithParentheses = false) {
    let traitsStr = '';
    for (let trait of traits) {

        if (trait.toLowerCase().startsWith('reach-')) {

            let reachAmt = trait.toLowerCase().replace('reach-', '');
            traitsStr += `(trait: reach) ${reachAmt} feet, `;

        } else {
            traitsStr += `(trait: ${trait}), `;
        }

    }
    traitsStr = traitsStr.slice(0, -2);// Trim off that last ', '
    if (traitsStr != '' && surroundWithParentheses) { traitsStr = ` (${traitsStr})`; }
    return traitsStr;
}

function parseDescription(text) {

    text = text.replace(/\[\[\/r (.*?)\]\]{(.*?)}/g, handleParse_DamageExt);
    text = text.replace(/\[\[\/r (.*)\]\]/g, handleParse_Damage);
    text = text.replace(/@Compendium\[(.+?)\]{(.*?)}/g, handleParse_Compendium);
    text = text.replace(/@Template\[(.+?)\]/g, handleParse_Template);
    text = text.replace(/@Check\[(.+?)\]/g, handleParse_Check);

    return text;
}

function handleParse_DamageExt(match, innerText, displayText) {
    return displayText;
}

function handleParse_Damage(match, innerText) {
    return innerText.replace(/\W/g, ' ').trim();
}

function handleParse_Compendium(match, innerText, displayText) {
    if (innerText.includes('Persistent Damage')) {
        return 'damage';
    } else {
        return displayText.toLowerCase();
    }
}

function handleParse_Template(match, innerText) {
    innerText = innerText.toLowerCase();

    let type = null;
    let distance = null;

    let values = innerText.split('|');
    for (let value of values) {

        if (value.startsWith('type:')) {
            type = value.replace('type:', '');
        } else if (value.startsWith('distance:')) {
            distance = value.replace('distance:', '');
        }

    }

    if (type != null && distance != null) {
        return `${distance}-foot ${type}`;
    } else {
        return innerText;
    }

}

function handleParse_Check(match, innerText) {
    innerText = innerText.toLowerCase();

    let type = null;
    let dc = null;
    let basic = null;
    let name = null;
    let traits = null;

    let values = innerText.split('|');
    for (let value of values) {

        if (value.startsWith('type:')) {
            type = value.replace('type:', '');
        } else if (value.startsWith('dc:')) {
            dc = value.replace('dc:', '');
        } else if (value.startsWith('basic:')) {
            basic = value.replace('basic:', '');
        } else if (value.startsWith('name:')) {
            name = value.replace('name:', '');
        } else if (value.startsWith('traits:')) { traits = value.replace('traits:', ''); }

    }

    if (dc != null && type != null) {

        let basicStr = (basic != null && basic == 'true') ? 'basic ' : '';
        return `DC ${dc} ${basicStr}${capitalizeWords(type)}`;
    } else {
        return innerText;
    }

}
