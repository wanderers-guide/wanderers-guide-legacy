
const User = require('../models/contentDB/User');
const HomebrewBundle = require('../models/contentDB/HomebrewBundle');
const UserHomebrewBundle = require('../models/contentDB/UserHomebrewBundle');

const AuthCheck = require('./AuthCheck');

// Returns UserID or -1 if not logged in.
function getUserID(socket){
  if(socket.request.session.passport != null){
      return socket.request.session.passport.user;
  } else {
      return -1;
  }
}

function canAccessHomebrew(socket, homebrewBundle){
  return homebrewBundle.isPublished === 1 || homebrewBundle.userID === getUserID(socket);
}

module.exports = class UserHomebrew {

  static canAccessHomebrewBundle(socket, homebrewID){
    return HomebrewBundle.findOne({ where: { id: homebrewID } })
    .then((homebrewBundle) => {
      return canAccessHomebrew(socket, homebrewBundle);
    });
  }

  static createHomebrewBundle(socket) {
    return AuthCheck.isMember(socket)
    .then((isMember) => {
      if(isMember){
        return User.findOne({ where: { id: getUserID(socket) } })
        .then((user) => {
          return HomebrewBundle.create({
            userID: user.id,
            name: 'Homebrew Bundle',
            description: '',
            contactInfo: '',
            isPublished: 0,
            authorName: user.username
          }).then((homebrewBundle) => {
            return homebrewBundle;
          });
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
    HomebrewBundle.hasMany(UserHomebrewBundle, {foreignKey: 'homebrewID'});
    UserHomebrewBundle.belongsTo(HomebrewBundle, {foreignKey: 'homebrewID'});
    return HomebrewBundle.findAll({
      where: { userID: getUserID(socket) },
      include: {
        model: UserHomebrewBundle,
        attributes:['homebrewID'],
      }
    }).then(hBundles => {
      return hBundles;
    });
  }

  static getIncompleteHomebrewBundles(socket) {
    return HomebrewBundle.findAll({ where: { userID: getUserID(socket), isPublished: 0 } })
    .then((homebrewBundles) => {
      return homebrewBundles;
    });
  }

  static getHomebrewBundle(socket, homebrewID) {
    return HomebrewBundle.findOne({ where: { id: homebrewID } })
    .then((homebrewBundle) => {
      if(homebrewBundle != null && canAccessHomebrew(socket, homebrewBundle)) {
        return homebrewBundle;
      } else {
        return null;
      }
    });
  }

  static hasHomebrewBundle(socket, homebrewID) {
    return UserHomebrewBundle.findOne({
      where: { userID: getUserID(socket), homebrewID: homebrewID }
    }).then(userBundle => {
      return (userBundle != null);
    });
  }

  static getCollectedHomebrewBundles(socket){
    User.hasMany(UserHomebrewBundle, {foreignKey: 'userID'});
    UserHomebrewBundle.belongsTo(User, {foreignKey: 'userID'});
    HomebrewBundle.hasMany(UserHomebrewBundle, {foreignKey: 'homebrewID'});
    UserHomebrewBundle.belongsTo(HomebrewBundle, {foreignKey: 'homebrewID'});

    return UserHomebrewBundle.findAll({
      where: { userID: getUserID(socket) },
      include: [HomebrewBundle]
    }).then(hBundles => {
      return hBundles;
    });
  }

  static publishHomebrew(socket, homebrewID) {
    return AuthCheck.isMember(socket)
    .then((isMember) => {
      if(isMember){
        return HomebrewBundle.findOne({ where: { id: homebrewID, userID: getUserID(socket) } })
        .then((homebrewBundle) => {
            if(homebrewBundle.isPublished === 0){
              return User.findOne({ where: { id: getUserID(socket) } })
              .then((user) => {
                return HomebrewBundle.update({ isPublished: 1, authorName: user.username }, {
                  where: {
                    id: homebrewBundle.id,
                    userID: user.id,
                  }
                }).then((result) => {
                  return true;
                });
              });
            } else {
              return false;
            }
        }).catch((error) => {
            return false;
        });
      } else {
        return false;
      }
    });
  }

  static addToHomebrewCollection(socket, homebrewID) {
    return User.findOne({ where: { id: getUserID(socket)} })
    .then((user) => {
      if(user != null){
        return HomebrewBundle.findOne({ where: { id: homebrewID } })
        .then((homebrewBundle) => {
          if(homebrewBundle.isPublished === 1){
            return UserHomebrewBundle.create({
              userID: user.id,
              homebrewID: homebrewID,
            }).then((userHomebrewBundle) => {
                return true;
            });
          } else {
            return false;
          }
        });
      } else {
        return false;
      }
    });
  }

  static removeFromHomebrewCollection(socket, homebrewID) {
    return User.findOne({ where: { id: getUserID(socket)} })
    .then((user) => {
      if(user != null){
        return UserHomebrewBundle.destroy({
          where: {
            userID: user.id,
            homebrewID: homebrewID,
          }
        }).then((result) => {
            return true;
        });
      } else {
        return false;
      }
    });
  }

  static findPublishedBundles(){
    HomebrewBundle.hasMany(UserHomebrewBundle, {foreignKey: 'homebrewID'});
    UserHomebrewBundle.belongsTo(HomebrewBundle, {foreignKey: 'homebrewID'});
    return HomebrewBundle.findAll({
      where: { isPublished: 1 },
      include: {
        model: UserHomebrewBundle,
        attributes:['homebrewID'],
      }
    }).then(hBundles => {
      return hBundles;
    });
  }

  

};