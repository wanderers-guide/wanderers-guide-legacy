
const Character = require('../models/contentDB/Character');

module.exports = class CharContentSources {

    static getSourceArray(character){
        return JSON.parse(character.enabledSources);
    }

    static addSource(charID, sourceName){
        return Character.findOne({ where: { id: charID} })
        .then((character) => {
            let sourceArray = CharContentSources.getSourceArray(character);
            sourceArray.push(sourceName);
            let charUpVals = {enabledSources: JSON.stringify(sourceArray) };
            return Character.update(charUpVals, { where: { id: character.id } })
            .then((result) => {
                return;
            });
        });
    }

    static removeSource(charID, sourceName){
        return Character.findOne({ where: { id: charID} })
        .then((character) => {
            let sourceArray = CharContentSources.getSourceArray(character);
            let sourceIndex = sourceArray.indexOf(sourceName);
            if (sourceIndex > -1) {
                sourceArray.splice(sourceIndex, 1);
            }
            let charUpVals = {enabledSources: JSON.stringify(sourceArray) };
            return Character.update(charUpVals, { where: { id: character.id } })
            .then((result) => {
                return;
            });
        });
    }

};