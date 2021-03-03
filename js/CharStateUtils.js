
function getUserCharacterLimit(){ return 6; }

module.exports = class CharStateUtils {

    static isPlayable(character) {
        return character.name != null && character.ancestryID != null && character.backgroundID != null && character.classID != null;
    }

    static isPublic(character) {
        return character != null && character.optionPublicCharacter === 1;
    }

    static canMakeCharacter(user, characters) {
        return user.isPatreonMember === 1 || characters.length < getUserCharacterLimit();
    }

    static getUserCharacterLimit(){
        return getUserCharacterLimit();
    }

};