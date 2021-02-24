
const User = require('../models/contentDB/User');
const Character = require('../models/contentDB/Character');
const InvItem = require('../models/contentDB/InvItem');

// Returns UserID or -1 if not logged in.
function getUserID(socket){
    if(socket.request.session.passport != null){
        return socket.request.session.passport.user;
    } else {
        return -1;
    }
}

module.exports = class AuthCheck {

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

    static isAdmin(socket) {
      return User.findOne({ where: { id: getUserID(socket)} })
      .then((user) => {
          return user.isAdmin === 1;
      }).catch((error) => {
          return false;
      });
    }

    static isDeveloper(socket) {
      return User.findOne({ where: { id: getUserID(socket)} })
      .then((user) => {
          return user.isDeveloper === 1;
      }).catch((error) => {
          return false;
      });
    }

    static isMember(socket) {
      return User.findOne({ where: { id: getUserID(socket)} })
      .then((user) => {
          return user.isPatreonMember === 1;
      }).catch((error) => {
          return false;
      });
    }

    static isSupporter(socket) {
      return User.findOne({ where: { id: getUserID(socket)} })
      .then((user) => {
          return user.isPatreonSupporter === 1;
      }).catch((error) => {
          return false;
      });
    }

};