
const CharDataMapping = require('./CharDataMapping');

module.exports = class CharTags {

    static getTags(charID) {
        return CharDataMapping.getDataAll(charID, 'charTag', null)
        .then((dataArray) => {
            let charTagsArray = [];
            for(let data of dataArray){
                charTagsArray.push(data.value);
            }
            return charTagsArray;
        });
    }

    static setTag(charID, srcStruct, charTag) {
        return CharDataMapping.setData(charID, 'charTag', srcStruct, charTag)
        .then((result) => {
            return;
        });
    }

};