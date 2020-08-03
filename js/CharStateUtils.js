
function getUserCharacterLimit(){ return 3; }

module.exports = class CharStateUtils {

    static isPlayable(character) {
        return character.name != null && character.ancestryID != null && character.backgroundID != null && character.classID != null;
    }

    static canMakeCharacter(user, characters) {
        return user.isPatreonMember === 1 || characters.length < getUserCharacterLimit();
    }

    static getUserCharacterLimit(){
        return getUserCharacterLimit();
    }

};