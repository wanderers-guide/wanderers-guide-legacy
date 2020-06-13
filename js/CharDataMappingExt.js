
const CharDataMapping = require('./CharDataMapping');

function mapToObj(strMap) {
    let obj = Object.create(null);
    for (let [k,v] of strMap) {
      // Doesn't escape the key '__proto__'
      // which can cause problems on older engines
      obj[k] = v;
    }
    return obj;
}

function getSeparator(){
    return ':::';
}

module.exports = class CharDataMappingExt {

    static setDataProficiencies(charID, srcStruct, fFor, tTo, prof){
        let value = fFor+getSeparator()+tTo+getSeparator()+prof;
        return CharDataMapping.setData(charID, 'proficiencies', srcStruct, value)
        .then((result) => {
            return;
        });
    }

    static getDataAllProficiencies(charID){
        return CharDataMapping.getDataAll(charID, 'proficiencies', null)
        .then((dataArray) => {
            for(let data of dataArray){
                let vParts = data.value.split(getSeparator());
                data.For = vParts[0];
                data.To = vParts[1];
                data.Prof = vParts[2];
            }
            return dataArray;
        });
    }


    static setDataAbilityBonus(charID, srcStruct, ability, bonus){
        let value = ability+getSeparator()+bonus;
        return CharDataMapping.setData(charID, 'abilityBonus', srcStruct, value)
        .then((result) => {
            return;
        });
    }

    static getDataSingleAbilityBonus(charID, srcStruct){
        return CharDataMapping.getDataSingle(charID, 'abilityBonus', srcStruct)
        .then((dataValue) => {
            if(dataValue != null) {
                let vParts = dataValue.split(getSeparator());
                return { Ability: vParts[0], Bonus: vParts[1] };
            } else {
                return null;
            }
        });
    }

    static getDataAllAbilityBonus(charID){
        return CharDataMapping.getDataAll(charID, 'abilityBonus', null)
        .then((dataArray) => {
            for(let data of dataArray){
                let vParts = data.value.split(getSeparator());
                data.Ability = vParts[0];
                data.Bonus = vParts[1];
            }
            return dataArray;
        });
    }

    
    static setDataClassChoice(charID, srcStruct, selectorID, optionID){
        let value = selectorID+getSeparator()+optionID;
        return CharDataMapping.setData(charID, 'classChoice', srcStruct, value)
        .then((result) => {
            return;
        });
    }

    static getDataAllClassChoice(charID){
        return CharDataMapping.getDataAll(charID, 'classChoice', null)
        .then((dataArray) => {
            for(let data of dataArray){
                let vParts = data.value.split(getSeparator());
                data.SelectorID = vParts[0];
                data.OptionID = vParts[1];
            }
            return dataArray;
        });
    }



    static setDataInnateSpell(charID, srcStruct, spellID, spellLevel, spellTradition, timesPerDay){
        let value = spellID+getSeparator()+spellLevel+getSeparator()+spellTradition+getSeparator()+timesPerDay+getSeparator()+'CHA';
            /*
                "You use your Charisma modifier as your spellcasting ability
                modifier for innate spells unless otherwise specified."
            */
        return CharDataMapping.setData(charID, 'innateSpell', srcStruct, value)
        .then((result) => {
            return;
        });
    }

    static getDataAllInnateSpell(charID){
        return CharDataMapping.getDataAll(charID, 'innateSpell', null)
        .then((dataArray) => {
            for(let data of dataArray){
                let vParts = data.value.split(getSeparator());
                data.SpellID = vParts[0];
                data.SpellLevel = vParts[1];
                data.SpellTradition = vParts[2];
                data.TimesPerDay = vParts[3];
                data.KeyAbility = vParts[4];
            }
            return dataArray;
        });
    }



    static setDataResistance(charID, srcStruct, resistType, resistAmount){
        let value = resistType+getSeparator()+resistAmount;
        return CharDataMapping.setData(charID, 'resistance', srcStruct, value)
        .then((result) => {
            return;
        });
    }

    static getDataAllResistance(charID){
        return CharDataMapping.getDataAll(charID, 'resistance', null)
        .then((dataArray) => {
            for(let data of dataArray){
                let vParts = data.value.split(getSeparator());
                data.Type = vParts[0];
                data.Amount = vParts[1];
            }
            return dataArray;
        });
    }


    static setDataVulnerability(charID, srcStruct, vulnerableType, vulnerableAmount){
        let value = vulnerableType+getSeparator()+vulnerableAmount;
        return CharDataMapping.setData(charID, 'vulnerability', srcStruct, value)
        .then((result) => {
            return;
        });
    }

    static getDataAllVulnerability(charID){
        return CharDataMapping.getDataAll(charID, 'vulnerability', null)
        .then((dataArray) => {
            for(let data of dataArray){
                let vParts = data.value.split(getSeparator());
                data.Type = vParts[0];
                data.Amount = vParts[1];
            }
            return dataArray;
        });
    }


    static setDataOtherSpeed(charID, srcStruct, speedType, speedAmount){
        let value = speedType+getSeparator()+speedAmount;
        return CharDataMapping.setData(charID, 'otherSpeeds', srcStruct, value)
        .then((result) => {
            return;
        });
    }

    static getDataAllOtherSpeed(charID){
        return CharDataMapping.getDataAll(charID, 'otherSpeeds', null)
        .then((dataArray) => {
            for(let data of dataArray){
                let vParts = data.value.split(getSeparator());
                data.Type = vParts[0];
                data.Amount = vParts[1];
            }
            return dataArray;
        });
    }
    

};
