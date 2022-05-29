/* Copyright (C) 2021, Wanderer's Guide, all rights reserved.
    By Aaron Cassar.
*/

$(function () {

    $('#rollInitiativeModalBackground').click(function(){
        closeRollInitiativeModal();
    });
    $('#rollInitiativeModalCloseButton').click(function(){
        closeRollInitiativeModal();
    });

    $('#rollInitiativeBtn').click(function () {
        let encounter = allEncounters[currentEncounterIndex];
        if(encounter == null) { return; }
        for (let i = 0; i < encounter.members.length; i++) {
            let value = $(`#init-member-roll-input-${i}`).val();
            if(value != `chooseDefault`){

                const randomD20 = Math.floor(Math.random()*Math.floor(20))+1;
                const bonus = parseInt(value);

                encounter.members[i].init = randomD20+bonus;

            }
        }
        reloadEncounterMembers();
        closeRollInitiativeModal();
    });

});


function openRollInitiativeModal() {

    $('#rollInitiativeModalContent').html('');

    let encounter = allEncounters[currentEncounterIndex];
    if(encounter == null) { return; }

    for (let i = 0; i < encounter.members.length; i++) {
        const member = encounter.members[i];

        let memberRollInput = 'init-member-roll-input-'+i;

        let selectOptionsHTML = `
            <option value="chooseDefault">Don't roll</option>
        `;
        let creature = g_creaturesMap.get(member.creatureID);
        if(creature != null){
            let skills = [];
            try {
                skills = JSON.parse(creature.skillsJSON);
            } catch (error) {}

            selectOptionsHTML += `<optgroup label="──────────"></optgroup>`;

            let adjustment = 0;
            if(member.eliteWeak == 'elite'){
                adjustment = 2;
            }
            if(member.eliteWeak == 'weak'){
                adjustment = -2;
            }

            selectOptionsHTML += `<option value="${creature.perceptionBonus+adjustment}" selected>Perception (${signNumber(creature.perceptionBonus+adjustment)})</option>`;
            for(let skill of skills){
                selectOptionsHTML += `<option value="${skill.bonus+adjustment}">${skill.name} (${signNumber(skill.bonus+adjustment)})</option>`;
            }
        }

        let memberName = member.name;
        if(memberName.trim() == ``){ memberName = `Unnamed Entry`; }
        $('#rollInitiativeModalContent').append(`
            <div class="tile is-parent is-paddingless">
                <div class="tile is-child border-bottom border-dark">
                    <div class="columns is-marginless">
                        <div class="column is-paddingless">
                            <p class="has-text-right is-size-6 mt-1 mr-1">${memberName}</p>
                        </div>
                        <div class="column is-paddingless">
                            <div class="select is-small m-1">
                                <select id="${memberRollInput}">
                                    ${selectOptionsHTML}
                                </select>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `);

    }

    $('#rollInitiativeModalDefault').addClass('is-active');
    $('html').addClass('is-clipped');

}

function closeRollInitiativeModal() {

    $('#rollInitiativeModalDefault').removeClass('is-active');
    $('html').removeClass('is-clipped');

}