
function getUserCharacterLimit(){
    return 3;
}

module.exports = class CharStateUtils {

    static isPlayable(character) {
        return character.name != null
            && character.ancestryID != null
            && character.heritageID != null
            && character.backgroundID != null
            && character.classID != null;
    }

    static canMakeCharacter(user, characters) {
        const CHAR_LIMIT = 3;
        return user.isMember == 1 || characters.length < getUserCharacterLimit();
    }

    static getUserCharacterLimit(){
        return getUserCharacterLimit();
    }

};