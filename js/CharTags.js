
const Character = require('../models/contentDB/Character');

function getSeparator(){
    return ':::';
}

module.exports = class CharTags {

    static getTags(charID) {

        return Character.findOne({ where: { id: charID} })
        .then((character) => {

            let attrib = character.charTags;

            if(attrib == null || attrib == '') {
                return [];
            }

            return attrib.split(getSeparator());

        });

    }

    static addTag(charID, charTag) {

        return Character.findOne({ where: { id: charID} })
        .then((character) => {

            let attrib = character.charTags;

            let arrayStr = attrib;
            if(arrayStr == null || arrayStr == '') {
                arrayStr = charTag;
            } else {
                arrayStr += getSeparator()+charTag;
            }

            let dataUpVals = {
                charTags: arrayStr
            };

            return Character.update(dataUpVals, { where: { id: character.id } })
            .then((result) => {
                return;
            });

        });

    }

    static removeTag(charID, charTag) {

        return Character.findOne({ where: { id: charID} })
        .then((character) => {

            let attrib = character.charTags;

            if(attrib == null) {
                return;
            }

            let sections = attrib.split(getSeparator());

            let arrayStr = '';
            for(const section of sections){

                if(section != charTag){
                    if(arrayStr === "") {
                        arrayStr = section;
                    } else {
                        arrayStr += getSeparator()+section;
                    }
                }

            }
            
            let dataUpVals = {
                charTags: arrayStr
            };

            return Character.update(dataUpVals, { where: { id: character.id } })
            .then((result) => {
                return;
            });

        });

    }

};