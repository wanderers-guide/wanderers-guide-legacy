
const User = require('../models/contentDB/User');
const Character = require('../models/contentDB/Character');
const InvItem = require('../models/contentDB/InvItem');

const CharStateUtils = require('./CharStateUtils');

// Returns UserID or -1 if not logged in.
function getUserID(socket){
    if(socket.request.session.passport != null){
        return socket.request.session.passport.user;
    } else {
        return -1;
    }
}

module.exports = class AuthCheck {

    static isLoggedIn(socket){
      return (getUserID(socket) != -1);
    }

    static ownsCharacterAPI(userID, charID) {
        return Character.findOne({ where: { id: charID, userID: userID } })
        .then((character) => {
            return (character != null);
        }).catch((error) => {
            return false;
        });
    }

    static ownsCharacter(socket, charID) {
        return Character.findOne({ where: { id: charID, userID: getUserID(socket) } })
        .then((character) => {
            return (character != null);
        }).catch((error) => {
            return false;
        });
    }

    static canViewCharacter(socket, charID) {
        return Character.findOne({ where: { id: charID } })
        .then((character) => {
          return CharStateUtils.isPublic(character) || character.userID === getUserID(socket);
        }).catch((error) => {
          return false;
        });
    }

    static ownsInv(socket, invID) {
        return Character.findOne({ where: { inventoryID: invID } })
        .then((character) => {
            return AuthCheck.ownsCharacter(socket, character.id);
        }).catch((error) => {
            return false;
        });
    }

    static ownsInvItem(socket, invItemID) {
        return InvItem.findOne({ where: { id: invItemID } })
        .then((invItem) => {
            return AuthCheck.ownsInv(socket, invItem.invID);
        }).catch((error) => {
            return false;
        });
    }

    /* -------- */

    static getPermissions(socket){
      return User.findOne({ where: { id: getUserID(socket)} })
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

    static isAdmin(socket) {
      return AuthCheck.getPermissions(socket).then((perms) => {
        return perms.admin;
      });
    }

    static isDeveloper(socket) {
      return AuthCheck.getPermissions(socket).then((perms) => {
        return perms.developer;
      });
    }

    static isLegend(socket) {
      return AuthCheck.getPermissions(socket).then((perms) => {
        return perms.support.legend;
      });
    }

    static isMember(socket) {
      return AuthCheck.getPermissions(socket).then((perms) => {
        return perms.support.member;
      });
    }

    static isSupporter(socket) {
      return AuthCheck.getPermissions(socket).then((perms) => {
        return perms.support.supporter;
      });
    }

};