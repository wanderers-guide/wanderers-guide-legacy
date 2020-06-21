
const CharDataMapping = require('./CharDataMapping');

module.exports = class CharTags {

    static getTags(charID) {
        return CharDataMapping.getDataAll(charID, 'charTag', null)
        .then((dataArray) => {
            return dataArray;
        });
    }

    static setTag(charID, srcStruct, charTag) {
        if(charTag != null){
            return CharDataMapping.setData(charID, 'charTag', srcStruct, charTag)
            .then((result) => {
                return;
            });
        } else {
            return CharDataMapping.deleteData(charID, 'charTag', srcStruct)
            .then((result) => {
                return;
            });
        }
    }

};