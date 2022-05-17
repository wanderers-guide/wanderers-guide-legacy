/* Copyright (C) 2021, Wanderer's Guide, all rights reserved.
    By Aaron Cassar.
*/

let socket = io();

let activeModalCreatureID = -1;

// TEMP
let g_allTags = null;

// ~~~~~~~~~~~~~~ // Run on Load // ~~~~~~~~~~~~~~ //
$(function () {

    // TEMP
    g_allTags = JSON.parse($('#input-import-creature').attr('data-tags'));

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

    const fileInput = document.querySelector('#input-import-creature');
    fileInput.onchange = () => {
        if (fileInput.files.length > 0) {

            for (const file of fileInput.files) {

                let fileReader = new FileReader();

                // Closure to capture the file information.
                fileReader.onload = (function (capturedFile) {
                    return function (e) {
                        if (capturedFile.name.endsWith('.json')) {
                            try {
                                let importData = JSON.parse(e.target.result);

                                if (importData.type == `npc`) {
                                    parseCreatureData(importData);
                                } else if (importData.type == `hazard`) {
                                    //parseHazardData(importData);
                                }


                            } catch (err) {
                                console.error(err);
                                console.warn('Failed to import "' + capturedFile.name + '"');
                            }
                        }
                    };
                })(file);

                fileReader.readAsText(file);

            }

        }
    };

}

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
        if (item.type == `consumable`) {
            console.log(`${item.name} x${item.data.quantity}`);
            itemsDataArray.push({ name: item.name, quantity: item.data.quantity });
        } else {
            console.log(`${item.name}`);
            itemsDataArray.push({ name: item.name, quantity: 1 });
        }
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

        let spells;
        if (spellcasting.data.prepared.value == `ritual`) {
            spells = importData.items.filter((item) => {
                return item.type == `spell` && item.data.category.value == `ritual`;
            });
        } else if (spellcasting.data.prepared.value == `focus`) {
            spells = importData.items.filter((item) => {
                return item.type == `spell` && item.data.category.value == `focus`;
            });
        } else {
            spells = importData.items.filter((item) => {
                return item.type == `spell` && item.data.category.value == `spell`;
            });
        }

        console.log(`${spellcasting.name}, DC ${spellcasting.data.spelldc.dc}, Attack ${spellcasting.data.spelldc.value}`);
        let spellsDataArray = [];
        for (let spell of spells) {
            console.log(`${spell.name} ${spell.data.level.value}`);
            spellsDataArray.push({ name: spell.name, level: spell.data.level.value });
        }

        spellcastingDataArray.push({
            name: spellcasting.name,
            dc: spellcasting.data.spelldc.dc,
            attack: spellcasting.data.spelldc.value,
            spells: spellsDataArray,
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



function convertToWGRarity(rarity){
    switch (rarity) {
        case 'common': return 'COMMON';
        case 'uncommon': return 'UNCOMMON';
        case 'rare': return 'RARE';
        case 'unique': return 'UNIQUE';
        default: return 'COMMON';
    }
}

function convertToWGSize(size){
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

function convertToWGActions(actionType, actions){
    if(actionType == 'passive'){
        return null;
    } else if(actionType == 'reaction'){
        return 'REACTION';
    } else if(actionType == 'free'){
        return 'FREE_ACTION';
    } else if(actionType == 'action'){
        if(actions == 1){
            return 'ACTION';
        } else if(actions == 2){
            return 'TWO_ACTIONS';
        } else if(actions == 3){
            return 'THREE_ACTIONS';
        }
    }
    return null;
}

function convertToWGSource(source){
    switch (source) {
        case 'Pathfinder Bestiary 3': return 'BEST-3';
        case 'Pathfinder Adventure: Malevolence': return 'MALEVOLENCE';
        case 'Pathfinder #145: Hellknight Hill': return 'AGE-OF-ASHES';
        default: return source;
    }
}