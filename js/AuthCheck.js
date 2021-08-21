
const User = require('../models/contentDB/User');
const Character = require('../models/contentDB/Character');
const InvItem = require('../models/contentDB/InvItem');

const CharStateUtils = require('./CharStateUtils');

module.exports = class AuthCheck {

    static isLoggedIn(userID){
      return (userID != -1);
    }

    static ownsCharacterAPI(userID, charID) {
        return Character.findOne({ where: { id: charID, userID: userID } })
        .then((character) => {
            return (character != null);
        }).catch((error) => {
            return false;
        });
    }

    static ownsCharacter(userID, charID) {
        return Character.findOne({ where: { id: charID, userID: userID } })
        .then((character) => {
            return (character != null);
        }).catch((error) => {
            return false;
        });
    }

    static canViewCharacter(userID, charID) {
        return Character.findOne({ where: { id: charID } })
        .then((character) => {
          return CharStateUtils.isPublic(character) || character.userID === userID;
        }).catch((error) => {
          return false;
        });
    }

    static ownsInv(userID, invID) {
        return Character.findOne({ where: { inventoryID: invID } })
        .then((character) => {
            return AuthCheck.ownsCharacter(userID, character.id);
        }).catch((error) => {
            return false;
        });
    }

    static ownsInvItem(userID, invItemID) {
        return InvItem.findOne({ where: { id: invItemID } })
        .then((invItem) => {
            return AuthCheck.ownsInv(userID, invItem.invID);
        }).catch((error) => {
            return false;
        });
    }

    /* -------- */

    static getPermissions(userID){
      return User.findOne({ where: { id: userID} })
      .then((user) => {
        return {
          admin: user.isAdmin === 1,
          developer: user.isDeveloper === 1,
          support: {
            legend: user.isPatreonLegend === 1,
            member: user.isPatreonMember === 1,
            supporter: user.isPatreonSupporter === 1,
          }
        };
      }).catch((error) => {
        return {
          admin: false,
          developer: false,
          support: {
            legend: false,
            member: false,
            supporter: false,
          }
        };
      });
    }

    static isAdmin(userID) {
      return AuthCheck.getPermissions(userID).then((perms) => {
        return perms.admin;
      });
    }

    static isDeveloper(userID) {
      return AuthCheck.getPermissions(userID).then((perms) => {
        return perms.developer;
      });
    }

    static isLegend(userID) {
      return AuthCheck.getPermissions(userID).then((perms) => {
        return perms.support.legend;
      });
    }

    static isMember(userID) {
      return AuthCheck.getPermissions(userID).then((perms) => {
        return perms.support.member;
      });
    }

    static isSupporter(userID) {
      return AuthCheck.getPermissions(userID).then((perms) => {
        return perms.support.supporter;
      });
    }

};