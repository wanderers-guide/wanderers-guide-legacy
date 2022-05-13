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

    console.log(importData._id);

    console.log(importData.name);
    console.log(importData.data.details.level.value);

    console.log(importData.data.traits.rarity);
    console.log(importData.data.details.alignment.value);
    console.log(importData.data.traits.size.value);
    console.log(importData.data.traits.traits);


    console.log(importData.data.attributes.perception.value);
    console.log(importData.data.traits.senses.value);

    console.log(importData.data.traits.languages.value);
    console.log(importData.data.traits.languages.custom);

    let skills = importData.items.filter((item) => {
        return item.type == `lore`;
    });
    for (let skill of skills) {
        console.log(`${skill.name}: ${skill.data.mod.value}`);
    }

    let inventory = importData.items.filter((item) => {
        return item.type == `equipment` || item.type == `weapon` || item.type == `armor` || item.type == `consumable`;
    });
    for (let item of inventory) {
        if (item.type == `consumable`) {
            console.log(`${item.name} x${item.data.quantity}`);
        } else {
            console.log(`${item.name}`);
        }
    }

    console.log(importData.data.abilities.str.mod);
    console.log(importData.data.abilities.dex.mod);
    console.log(importData.data.abilities.con.mod);
    console.log(importData.data.abilities.int.mod);
    console.log(importData.data.abilities.wis.mod);
    console.log(importData.data.abilities.cha.mod);

    console.log(importData.data.attributes.ac.value);
    console.log(importData.data.saves.fortitude.value);
    console.log(importData.data.saves.reflex.value);
    console.log(importData.data.saves.will.value);
    console.log(importData.data.attributes.allSaves.value);

    console.log(importData.data.attributes.hp.max);
    console.log(importData.data.traits.di.value);
    console.log(importData.data.traits.dv);
    console.log(importData.data.traits.dr);

    let basicAbilities = importData.items.filter((item) => {
        return item.type == `action` && item.data.description.value.includes(`<p>@Localize[PF2E.NPC.Abilities.Glossary`);
    });
    for (let ability of basicAbilities) {
        console.log(`${ability.name}`);
    }

    console.log(importData.data.attributes.speed.value);
    console.log(importData.data.attributes.speed.otherSpeeds);

    let attacks = importData.items.filter((item) => {
        return item.type == `melee`;
    });
    for (let attack of attacks) {
        console.log(`1- ${attack.name} ${attack.data.bonus.value} ${attack.data.traits.value}`);

        let damageStr = ``;
        for (let damage of Object.values(attack.data.damageRolls)) {
            damageStr += `${damage.damage} ${damage.damageType}, `;
        }
        damageStr += attack.data.attackEffects.value;
        console.log(`${damageStr}`);
    }


    let spellcastings = importData.items.filter((item) => {
        return item.type == `spellcastingEntry`;
    });
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
        for (let spell of spells) {
            console.log(`${spell.name} ${spell.data.level.value}`);
        }
    }

    let abilities = importData.items.filter((item) => {
        return item.type == `action` && !item.data.description.value.includes(`<p>@Localize[PF2E.NPC.Abilities.Glossary`);
    });
    for (let ability of abilities) {
        console.log(`${ability.name} ${ability.data.actions.value} ${ability.data.traits.value}`);
        // TODO; if reaction or if traits contains 'aura', move this ability to be displayed with basic abilities
    }

    console.log(importData.data.details.publicNotes);
    console.log(importData.data.details.source);


}