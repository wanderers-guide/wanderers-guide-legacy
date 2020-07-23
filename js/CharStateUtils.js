
function getUserCharacterLimit(){
    return 3;
}

module.exports = class CharStateUtils {

    static isPlayable(character) {
        return character.name != null && character.ancestryID != null && character.backgroundID != null && character.classID != null;
    }

    static canMakeCharacter(user, characters) {
        if(user.isPatreonSupporter === 1){
            return user.isPatreonMember === 1 || characters.length < getUserCharacterLimit();
        } else {
            return false;
        }
        //return user.isPatreonMember === 1 || characters.length < getUserCharacterLimit();
    }

    static getUserCharacterLimit(){
        return getUserCharacterLimit();
    }

};