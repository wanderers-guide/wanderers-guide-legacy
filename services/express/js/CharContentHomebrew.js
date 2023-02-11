const Character = require("../models/contentDB/Character");

const UserHomebrew = require("./UserHomebrew");

module.exports = class CharContentHomebrew {
  static getEnabledHomebrewForCollection(userID) {
    return UserHomebrew.getCollectedHomebrewBundles(userID).then((hBundles) => {
      return UserHomebrew.getIncompleteHomebrewBundles(userID).then(
        (progessBundles) => {
          let enabledHomebrew = [null];
          let homebrewNames = ["None"];
          for (const hBundle of hBundles) {
            enabledHomebrew.push(hBundle.homebrewBundle.id);
            homebrewNames.push(hBundle.homebrewBundle.name);
          }
          for (const progessBundle of progessBundles) {
            enabledHomebrew.push(progessBundle.id);
            homebrewNames.push(progessBundle.name);
          }

          return {
            enabledHomebrew: JSON.stringify(enabledHomebrew),
            homebrewNames: homebrewNames,
          };
        },
      );
    });
  }

  static getHomebrewArray(enabledHomebrew) {
    return JSON.parse(enabledHomebrew);
  }

  static getHomebrewArrayPrisma(enabledHomebrew) {
    let array = JSON.parse(enabledHomebrew);
    let newArray = [];
    for (let arr of array) {
      newArray.push({ homebrewID: arr });
    }
    return newArray;
  }

  static addHomebrewBundle(userID, charID, homebrewID) {
    return UserHomebrew.canAccessHomebrewBundle(userID, homebrewID).then(
      (canAccess) => {
        if (canAccess) {
          return Character.findOne({ where: { id: charID } }).then(
            (character) => {
              let homebrewArray = CharContentHomebrew.getHomebrewArray(
                character.enabledHomebrew,
              );
              homebrewArray.push(homebrewID);
              let charUpVals = {
                enabledHomebrew: JSON.stringify(homebrewArray),
              };
              return Character.update(charUpVals, {
                where: { id: character.id },
              }).then((result) => {
                return;
              });
            },
          );
        }
      },
    );
  }

  static removeHomebrewBundle(charID, homebrewID) {
    return Character.findOne({ where: { id: charID } }).then((character) => {
      let homebrewArray = CharContentHomebrew.getHomebrewArray(
        character.enabledHomebrew,
      );
      let bundleIndex = homebrewArray.indexOf(homebrewID);
      if (bundleIndex > -1) {
        homebrewArray.splice(bundleIndex, 1);
      }
      let charUpVals = { enabledHomebrew: JSON.stringify(homebrewArray) };
      return Character.update(charUpVals, { where: { id: character.id } }).then(
        (result) => {
          return;
        },
      );
    });
  }
};
