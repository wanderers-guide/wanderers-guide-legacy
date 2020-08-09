/* Copyright (C) 2020, Wanderer's Guide, all rights reserved.
    By Aaron Cassar.
*/

function openResistancesQuickview(data) {

    let resistAndVulnerText = '';
    if(data.ResistAndVulners.Resistances.length != 0){
        resistAndVulnerText += 'Resistances';
        if(data.ResistAndVulners.Vulnerabilities.length != 0){
            resistAndVulnerText += ' and ';
        }
    }
    if(data.ResistAndVulners.Vulnerabilities.length != 0){
        resistAndVulnerText += 'Weaknesses';
    }
    $('#quickViewTitle').html(resistAndVulnerText);

    let qContent = $('#quickViewContent');

    qContent.append('<p class="is-size-7">If you have resistance to a type of damage, each time you take that type of damage, you reduce the amount of damage you take by the listed amount (to a minimum of 0 damage). If you have more than one type of resistance that would apply to the same instance of damage, use only the highest applicable resistance value.</p>');
    qContent.append('<p class="is-size-7">Having a weakness to a type of damage is the same process but in reverse, each time you take that type of damage, increase the damage amount by the value of your weakness.</p>');
    qContent.append('<hr class="m-2">');

    if(data.ResistAndVulners.Resistances.length != 0){
        qContent.append('<p class="has-text-centered is-size-5"><strong>Resistances</strong></p>');
        for(let resist of data.ResistAndVulners.Resistances) {
            let type = capitalizeWord(resist.Type);
            let amount = resist.Amount;
            if(amount.includes('LEVEL')){
                amount = amount.replace('LEVEL', data.CharLevel);
            } else if(amount.includes('HALF_LEVEL')){
                amount = amount.replace('HALF_LEVEL', Math.ceil(data.CharLevel/2));
            }
            qContent.append('<p class="has-text-centered is-size-5">'+type+' '+amount+'</p>');
        }
    }

    if(data.ResistAndVulners.Vulnerabilities.length != 0){
        qContent.append('<p class="has-text-centered is-size-5"><strong>Weaknesses</strong></p>');
        for(let vulner of data.ResistAndVulners.Vulnerabilities) {
            let type = capitalizeWord(vulner.Type);
            let amount = vulner.Amount;
            if(amount.includes('LEVEL')){
                amount = amount.replace('LEVEL', data.CharLevel);
            } else if(amount.includes('HALF_LEVEL')){
                amount = amount.replace('HALF_LEVEL', Math.ceil(data.CharLevel/2));
            }
            qContent.append('<p class="has-text-centered is-size-5">'+type+' '+amount+'</p>');
        }
    }

}