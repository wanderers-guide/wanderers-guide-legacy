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

        if (tag == null) { console.error('Unknown trait: '+traitName); }

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
        <div>
            <p class="negative-indent">
                <span><strong>Perception </strong></span><span>${perception}; ${data.senses}</span>
            </p>
        </div>
    `);

    // Languages
    let langStr = '';
    for(let language of JSON.parse(data.languagesJSON)){
        langStr += language+', ';
    }
    langStr += data.languagesCustom;
    qContent.append(`
        <div>
            <p class="negative-indent">
                <span><strong>Languages </strong></span><span>${langStr}</span>
            </p>
        </div>
    `);

    // Skills //
    let skillStr = '';
    for(let skill of skills){
        skillStr += `${skill.name} ${skill.bonus}, `;
    }
    qContent.append(`
        <div>
            <p class="negative-indent">
                <span><strong>Skills </strong></span><span>${skillStr}</span>
            </p>
        </div>
    `);

    // Ability Mods //
    qContent.append(`
        <div>
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

    qContent.append('<hr class="mb-2 mt-1">');

    // AC & Saves //
    qContent.append(`
        <div>
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
    for(let immunity of JSON.parse(data.immunitiesJSON)){
        immunitiesStr += `${immunity}, `;
    }

    let weaknessesStr = '';
    for(let weakness of JSON.parse(data.weaknessesJSON)){
        weaknessesStr += `${weakness.type} ${weakness.value}`;
        if(weakness.exceptions != null && weakness.exceptions != ''){
            weaknessesStr += ` (${weakness.exceptions})`;
        }
        weaknessesStr += `, `;
    }

    let resistancesStr = '';
    for(let resistance of JSON.parse(data.resistancesJSON)){
        resistancesStr += `${resistance.type} ${resistance.value}`;
        if(resistance.exceptions != null && resistance.exceptions != ''){
            resistancesStr += ` (${resistance.exceptions})`;
        }
        resistancesStr += `, `;
    }

    qContent.append(`
        <div>
            <p class="negative-indent">
                <span><strong>HP </strong></span><span>${hpMax}, </span>
                <span>${data.hpDetails}; </span>
                <span><strong>Immunities </strong></span><span>${immunitiesStr}; </span>
                <span><strong>Weaknesses </strong></span><span>${weaknessesStr}; </span>
                <span><strong>Resistances </strong></span><span>${resistancesStr}</span>
            </p>
        </div>
    `);

    // Header Abilities //
    let headerAbilities = JSON.parse(data.headerAbilitiesJSON);
    for(let ability of headerAbilities){

        let traitsStr = '';
        for(let trait of ability.traits){
            traitsStr += `(trait: ${trait}), `;
        }
        if(traitsStr != '') { traitsStr = ` (${traitsStr})`; }

        qContent.append(`
            <div>
                ${processText(`~ ${ability.name}: ${ability.actions}${traitsStr}`, false, false, 'MEDIUM')}
                ${processText(`${ability.description}`, false, false, 'MEDIUM')}
            </div>
        `);
    }

    qContent.append('<hr class="mb-2 mt-1">');

}