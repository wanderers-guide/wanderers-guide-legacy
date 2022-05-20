/* Copyright (C) 2021, Wanderer's Guide, all rights reserved.
    By Aaron Cassar.
*/

let socket = io();

let activeModalCreatureID = -1;

// ~~~~~~~~~~~~~~ // Run on Load // ~~~~~~~~~~~~~~ //
$(function () {

    creatureInitImport();

    let entries = $('.entryListing');
    for (const entry of entries) {

        let creatureID = $(entry).attr('name');
        let cardEdit = $(entry).find('.entry-update');
        let cardDelete = $(entry).find('.entry-delete');

        cardEdit.mouseenter(function () {
            $(this).addClass('entry-footer-hover');
        });
        cardEdit.mouseleave(function () {
            $(this).removeClass('entry-footer-hover');
        });
        cardEdit.click(function () {
            window.location.href = '/admin/edit/creature/' + creatureID;
        });

        cardDelete.mouseenter(function () {
            $(this).addClass('entry-footer-hover');
        });
        cardDelete.mouseleave(function () {
            $(this).removeClass('entry-footer-hover');
        });
        cardDelete.click(function () {
            $('.modal').addClass('is-active');
            $('html').addClass('is-clipped');
            activeModalCreatureID = creatureID;
        });


        $('.modal-card-close').click(function () {
            $('.modal').removeClass('is-active');
            $('html').removeClass('is-clipped');
            activeModalCreatureID = -1;
        });
        $('.modal-background').click(function () {
            $('.modal').removeClass('is-active');
            $('html').removeClass('is-clipped');
            activeModalCreatureID = -1;
        });

    }

    $('#delete-confirmation-btn').click(function () {
        socket.emit("requestAdminRemoveCreature", activeModalCreatureID);
    });

});

socket.on("returnAdminRemoveCreature", function () {
    window.location.href = '/admin/manage/Creature';
});




function creatureInitImport() {

    startSpinnerLoader();

    const fileInput = document.querySelector('#input-import-creature');
    fileInput.onchange = () => {
        if (fileInput.files.length > 0) {

            for (const file of fileInput.files) {

                let fileReader = new FileReader();

                // Closure to capture the file information.
                fileReader.onload = (function (capturedFile) {
                    return function (e) {
                        if (capturedFile.name.endsWith('.json')) {

                            let importData = JSON.parse(e.target.result);

                            if (importData.type == `npc`) {
                                parseCreatureData(importData);
                            } else if (importData.type == `hazard`) {
                                //parseHazardData(importData);
                            }

                        }
                    };
                })(file);

                fileReader.readAsText(file);

            }

        }
    };

    socket.emit("requestAdminCreatureDetails");

}

let g_allConditions;
let g_allTags;
let g_featMap;
let g_itemMap;
let g_spellMap;
socket.on("returnAdminCreatureDetails", function(allTags, featsObject, itemsObject, spellsObject, allConditions){
    g_allConditions = allConditions;
    g_allTags = allTags;
    g_featMap = objToMap(featsObject);
    g_itemMap = objToMap(itemsObject);
    g_spellMap = objToMap(spellsObject);
    stopSpinnerLoader();
});


function parseCreatureData(importData) {

    console.log(importData);

    let data = {};

    console.log(importData._id);
    data.id = importData._id;

    console.log(importData.name);
    console.log(importData.data.details.level.value);
    data.name = importData.name;
    data.level = importData.data.details.level.value;

    console.log(importData.data.traits.rarity);
    console.log(importData.data.details.alignment.value);
    console.log(importData.data.traits.size.value);
    console.log(importData.data.traits.traits.value);
    data.rarity = convertToWGRarity(importData.data.traits.rarity);
    data.alignment = importData.data.details.alignment.value;
    data.size = convertToWGSize(importData.data.traits.size.value);
    data.traitsJSON = JSON.stringify(importData.data.traits.traits.value);


    console.log(importData.data.attributes.perception.value);
    console.log(importData.data.traits.senses.value);
    data.perceptionBonus = importData.data.attributes.perception.value;
    data.senses = importData.data.traits.senses.value;

    console.log(importData.data.traits.languages.value);
    console.log(importData.data.traits.languages.custom);
    data.languagesJSON = JSON.stringify(importData.data.traits.languages.value);
    data.languagesCustom = importData.data.traits.languages.custom;

    let skills = importData.items.filter((item) => {
        return item.type == `lore`;
    });
    let skillsDataArray = [];
    for (let skill of skills) {
        console.log(`${skill.name}: ${skill.data.mod.value}`);
        skillsDataArray.push({ name: skill.name, bonus: skill.data.mod.value });
    }
    data.skillsJSON = JSON.stringify(skillsDataArray);

    let inventory = importData.items.filter((item) => {
        return item.type == `equipment` || item.type == `weapon` || item.type == `armor` || item.type == `consumable`;
    });
    let itemsDataArray = [];
    for (let item of inventory) {

        let quantity = 1;
        if (item.type == `consumable`) {
            quantity = item.data.quantity;
        }

        let name = null;
        let doIndex = true;
        if(item.data.baseItem != null){
            name = item.data.baseItem;
        } else {
            doIndex = false;
        }

        let shieldStats = null;
        if(item.data.category == 'shield'){
            shieldStats = {
                armor: item.data.armor.value,
                hardness: item.data.hardness,
                hp: item.data.hp.max,
                bt: item.data.hp.brokenThreshold,
            };
        }

        itemsDataArray.push({
            displayName: item.name,
            quantity: quantity,
            name: name,
            doIndex: doIndex,
            shieldStats: shieldStats,
        });
    }
    data.itemsJSON = JSON.stringify(itemsDataArray);

    console.log(importData.data.abilities.str.mod);
    console.log(importData.data.abilities.dex.mod);
    console.log(importData.data.abilities.con.mod);
    console.log(importData.data.abilities.int.mod);
    console.log(importData.data.abilities.wis.mod);
    console.log(importData.data.abilities.cha.mod);
    data.strMod = importData.data.abilities.str.mod;
    data.dexMod = importData.data.abilities.dex.mod;
    data.conMod = importData.data.abilities.con.mod;
    data.intMod = importData.data.abilities.int.mod;
    data.wisMod = importData.data.abilities.wis.mod;
    data.chaMod = importData.data.abilities.cha.mod;

    let interactionAbilities = importData.items.filter((item) => {
        return item.type == `action` && item.data.actionCategory.value == `interaction`;
    });
    let interactionAbilitiesDataArray = [];
    for (let ability of interactionAbilities) {
        console.log(`${ability.name}`);
        interactionAbilitiesDataArray.push({
            name: ability.name,
            actions: convertToWGActions(ability.data.actionType.value, ability.data.actions.value),
            traits: ability.data.traits.value,
            description: ability.data.description.value,
        });
    }
    data.interactionAbilitiesJSON = JSON.stringify(interactionAbilitiesDataArray);

    console.log(importData.data.attributes.ac.value);
    console.log(importData.data.saves.fortitude.value);
    console.log(importData.data.saves.reflex.value);
    console.log(importData.data.saves.will.value);
    console.log(importData.data.attributes.allSaves.value);
    data.acValue = importData.data.attributes.ac.value;
    data.fortBonus = importData.data.saves.fortitude.value;
    data.reflexBonus = importData.data.saves.reflex.value;
    data.willBonus = importData.data.saves.will.value;
    data.allSavesCustom = importData.data.attributes.allSaves.value;

    console.log(importData.data.attributes.hp.max);
    console.log(importData.data.traits.di.value);
    console.log(importData.data.traits.dv);
    console.log(importData.data.traits.dr);
    data.hpMax = importData.data.attributes.hp.max;
    data.hpDetails = importData.data.attributes.hp.details;
    data.immunitiesJSON = JSON.stringify(importData.data.traits.di.value);
    data.weaknessesJSON = JSON.stringify(importData.data.traits.dv);
    data.resistancesJSON = JSON.stringify(importData.data.traits.dr);

    let defensiveAbilities = importData.items.filter((item) => {
        return item.type == `action` && item.data.actionCategory.value == `defensive`;
    });
    let defensiveAbilitiesDataArray = [];
    for (let ability of defensiveAbilities) {
        console.log(`${ability.name}`);
        defensiveAbilitiesDataArray.push({
            name: ability.name,
            actions: convertToWGActions(ability.data.actionType.value, ability.data.actions.value),
            traits: ability.data.traits.value,
            description: ability.data.description.value,
        });
    }
    data.defensiveAbilitiesJSON = JSON.stringify(defensiveAbilitiesDataArray);

    console.log(importData.data.attributes.speed.value);
    console.log(importData.data.attributes.speed.otherSpeeds);
    data.speed = importData.data.attributes.speed.value;
    data.otherSpeedsJSON = JSON.stringify(importData.data.attributes.speed.otherSpeeds);

    let attacks = importData.items.filter((item) => {
        return item.type == `melee`;
    });
    let attacksDataArray = [];
    for (let attack of attacks) {
        console.log(`1- ${attack.name} ${attack.data.bonus.value} ${attack.data.traits.value}`);

        let damageStr = ``;
        for (let damage of Object.values(attack.data.damageRolls)) {
            damageStr += `${damage.damage} ${damage.damageType}, `;
        }
        damageStr += attack.data.attackEffects.value;
        console.log(`${damageStr}`);

        attacksDataArray.push({
            type: attack.data.weaponType.value,
            name: attack.name,
            bonus: attack.data.bonus.value,
            traits: attack.data.traits.value,
            damage: Object.values(attack.data.damageRolls),
            effects: attack.data.attackEffects.value,
        });

    }
    data.attacksJSON = JSON.stringify(attacksDataArray);


    let spellcastings = importData.items.filter((item) => {
        return item.type == `spellcastingEntry`;
    });
    let spellcastingDataArray = [];
    for (let spellcasting of spellcastings) {

        
        let focusPoints = 0;
        if (spellcasting.data.prepared.value == `focus`) {
            focusPoints = importData.data.resources.focus.max;
        }

        let spells = importData.items.filter((item) => {
            return item.type == `spell` && item.data.location.value == spellcasting._id;
        });

        let spellsDataArray = [];
        let constantSpellsDataArray = [];
        for (let spell of spells) {

            let level = spell.data.level.value;
            if(spell.data.location.heightenedLevel != null){
                level = spell.data.location.heightenedLevel;
            }
            if(spell.data.traits.value.includes('cantrip')){
                level = 0;
            }

            let spellName = spell.name.toLowerCase();

            if(spellName.includes(` (constant)`)){

                spellName = spellName.replace(` (constant)`,``);
                constantSpellsDataArray.push({
                    name: spellName,
                    level: level,
                });

            } else {

                let isAtWill = false;
                if(spellName.includes(` (at will)`)){
                    spellName = spellName.replace(` (at will)`,``);
                    isAtWill = true;
                }

                spellsDataArray.push({
                    name: spellName,
                    level: level,
                    isAtWill: isAtWill,
                });

            }
            
        }

        spellcastingDataArray.push({
            name: spellcasting.name,
            dc: spellcasting.data.spelldc.dc,
            attack: spellcasting.data.spelldc.value,
            spells: spellsDataArray,
            constantSpells: constantSpellsDataArray,
            focus: focusPoints,
        });
    }
    data.spellcastingJSON = JSON.stringify(spellcastingDataArray);


    let offensiveAbilities = importData.items.filter((item) => {
        return item.type == `action` && item.data.actionCategory.value == `offensive`;
    });
    let offensiveAbilitiesDataArray = [];
    for (let ability of offensiveAbilities) {
        console.log(`${ability.name} ${ability.data.actions.value} ${ability.data.traits.value}`);
        offensiveAbilitiesDataArray.push({
            name: ability.name,
            actions: convertToWGActions(ability.data.actionType.value, ability.data.actions.value),
            traits: ability.data.traits.value,
            description: ability.data.description.value,
        });
    }
    data.offensiveAbilitiesJSON = JSON.stringify(offensiveAbilitiesDataArray);

    console.log(importData.data.details.publicNotes);
    console.log(importData.data.details.source);
    data.flavorText = importData.data.details.publicNotes;
    data.contentSrc = convertToWGSource(importData.data.details.source.value);

    console.log(data);

    socket.emit('requestAdminAddCreature', data);


    openQuickView('creatureView', {
        data: data,
        tags: g_allTags,
    });

}



function convertToWGRarity(rarity) {
    switch (rarity) {
        case 'common': return 'COMMON';
        case 'uncommon': return 'UNCOMMON';
        case 'rare': return 'RARE';
        case 'unique': return 'UNIQUE';
        default: return 'COMMON';
    }
}

function convertToWGSize(size) {
    switch (size) {
        case 'tiny': return 'TINY';
        case 'sm': return 'SMALL';
        case 'med': return 'MEDIUM';
        case 'lg': return 'LARGE';
        case 'huge': return 'HUGE';
        case 'grg': return 'GARGANTUAN';
        default: return 'MEDIUM';
    }
}

function convertToWGActions(actionType, actions) {
    if (actionType == 'passive') {
        return null;
    } else if (actionType == 'reaction') {
        return 'REACTION';
    } else if (actionType == 'free') {
        return 'FREE-ACTION';
    } else if (actionType == 'action') {
        if (actions == 1) {
            return 'ONE-ACTION';
        } else if (actions == 2) {
            return 'TWO-ACTIONS';
        } else if (actions == 3) {
            return 'THREE-ACTIONS';
        }
    }
    return null;
}

function convertToWGSource(source) {
    switch (source) {
        case 'Pathfinder Bestiary 3': return 'BEST-3';
        case 'Pathfinder Adventure: Malevolence': return 'MALEVOLENCE';
        case 'Pathfinder #145: Hellknight Hill': return 'AGE-OF-ASHES';
        default: return source;
    }
}