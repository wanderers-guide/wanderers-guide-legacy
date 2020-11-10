
const User = require('../models/contentDB/User');
const Character = require('../models/contentDB/Character');
const InvItem = require('../models/contentDB/InvItem');
const HomebrewBundle = require('../models/contentDB/HomebrewBundle');

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
        return Character.findAll({ where: { userID: userID} })
        .then((characters) => {
            let character = characters.find(character => {
                return character.id == charID;
            });
            return (character != null);
        }).catch((error) => {
            return false;
        });
    }

    static ownsCharacter(socket, charID) {
        return Character.findAll({ where: { userID: getUserID(socket)} })
        .then((characters) => {
            let character = characters.find(character => {
                return character.id == charID;
            });
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

    static createHomebrewBundle(socket) {
      return AuthCheck.isMember(socket)
      .then((isMember) => {
        if(isMember){
          return HomebrewBundle.create({
            userID: getUserID(socket),
            name: 'Homebrew Bundle',
            description: '',
            contactInfo: '',
            isPublished: 0,
          }).then((homebrewBundle) => {
            return homebrewBundle;
          });
        } else {
          return;
        }
      });
    }

    static updateHomebrewBundle(socket, homebrewID, inUpdateValues) {
      return AuthCheck.isMember(socket)
      .then((isMember) => {
        if(isMember){
          return HomebrewBundle.findOne({ where: { id: homebrewID, userID: getUserID(socket) } })
          .then((homebrewBundle) => {
            if(homebrewBundle != null){
              let updateValues = {
                name: inUpdateValues.Name,
                description: inUpdateValues.Description,
                contactInfo: inUpdateValues.ContactInfo,
              };
              return HomebrewBundle.update(updateValues, {
                where: {
                  id: homebrewBundle.id,
                  userID: getUserID(socket),
                }
              }).then((result) => {
                return HomebrewBundle.findOne({ where: { id: homebrewID, userID: getUserID(socket) } })
                .then((newHomebrewBundle) => {
                  return newHomebrewBundle;
                });
              });
            } else {
              return;
            }
          }).catch((error) => {
            return;
          });
        } else {
          return;
        }
      });
    }

    static deleteHomebrewBundle(socket, homebrewID) {
      return HomebrewBundle.findOne({ where: { id: homebrewID, userID: getUserID(socket) } })
      .then((homebrewBundle) => {
        if(homebrewBundle != null){
          return HomebrewBundle.destroy({
            where: {
              id: homebrewBundle.id,
              userID: getUserID(socket)
            }
          }).then((result) => {
            return;
          });
        } else {
          return;
        }
      }).catch((error) => {
        return;
      });
    }

    static canEditHomebrew(socket, homebrewID) {
      return AuthCheck.isMember(socket)
      .then((isMember) => {
        if(isMember){
          return HomebrewBundle.findOne({ where: { id: homebrewID, userID: getUserID(socket) } })
          .then((homebrewBundle) => {
              return homebrewBundle.isPublished === 0;
          }).catch((error) => {
              return false;
          });
        } else {
          return false;
        }
      });
    }

    static getHomebrewBundles(socket) {
      return HomebrewBundle.findAll({ where: { userID: getUserID(socket) } })
      .then((homebrewBundles) => {
          return homebrewBundles;
      });
    }

    static getHomebrewBundle(socket, homebrewID) {
      return HomebrewBundle.findOne({ where: { id: homebrewID, userID: getUserID(socket) } })
      .then((homebrewBundle) => {
          return homebrewBundle;
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

    static isMember(socket) {
        return User.findOne({ where: { id: getUserID(socket)} })
        .then((user) => {
            return user.isPatreonMember === 1;
        }).catch((error) => {
            return false;
        });
    }

};