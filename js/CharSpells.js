
const CharSpellSlot = require('../models/contentDB/CharSpellSlot');

function spellLvlToRow(spellLevel){
    switch(spellLevel){
        case 0: return 'cantrip';
        case 1: return 'firstLevel';
        case 2: return 'secondLevel';
        case 3: return 'thirdLevel';
        case 4: return 'fourthLevel';
        case 5: return 'fifthLevel';
        case 6: return 'sixthLevel';
        case 7: return 'seventhLevel';
        case 8: return 'eighthLevel';
        case 9: return 'ninthLevel';
        case 10: return 'tenthLevel';
        default: return 'cantrip';
    }
}

module.exports = class CharSpells {

    static addSpell(charID, spellID, spellLevel) {

        return CharSpellSlot.findOrCreate({
            where: { charID: charID }
        }).then((result) => {
            let charSpellSlot = result[0];

            let spellRow = charSpellSlot[spellLvlToRow(spellLevel)];
            if(spellRow != null && spellRow != ''){
                let spellArray = JSON.parse(spellRow);
                spellArray.push(spellID);

            } else {

            }

            let addSpells = '';
            if(result[0].addSpells == null){
                addSpells = spellID+',';
            } else {
                addSpells = result[0].addSpells+spellID+',';
            }
            let updateValues = { addSpells: addSpells };
            return CharSpellList.update(updateValues, { where: { charID: charID } })
            .then((result) => {
                return;
            });
        });

        /*
        return CharSpellList.findOrCreate({
            where: { charID: charID }
        }).then((result) => {
            let addSpells = '';
            if(result[0].addSpells == null){
                addSpells = spellID+',';
            } else {
                addSpells = result[0].addSpells+spellID+',';
            }
            let updateValues = { addSpells: addSpells };
            return CharSpellList.update(updateValues, { where: { charID: charID } })
            .then((result) => {
                return;
            });
        });*/
    }

    static removeSpell(charID, spellID) {
        /*
        return CharSpellList.findOne({where: { charID: charID }})
        .then((charSpellList) => {
            let addSpells = charSpellList.addSpells.replace(spellID+',','');
            let updateValues = { addSpells: addSpells };
            return CharSpellList.update(updateValues, { where: { charID: charID } })
            .then((result) => {
                return;
            });
        });*/
    }

};