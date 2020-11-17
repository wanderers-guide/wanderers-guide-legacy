
const User = require('../models/contentDB/User');
const HomebrewBundle = require('../models/contentDB/HomebrewBundle');
const UserHomebrewBundle = require('../models/contentDB/UserHomebrewBundle');
const HomebrewBundleKey = require('../models/contentDB/HomebrewBundleKey');

const AuthCheck = require('./AuthCheck');

function getUUIDv4() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    let r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

// Returns UserID or -1 if not logged in.
function getUserID(socket){
  if(socket.request.session.passport != null){
      return socket.request.session.passport.user;
  } else {
      return -1;
  }
}

module.exports = class UserHomebrew {

  static canAccessHomebrewBundle(socket, homebrewID){
    return UserHomebrewBundle.findOne({
      where: { userID: getUserID(socket), homebrewID: homebrewID },
    }).then(userHomebrewBundle => {
      return HomebrewBundle.findOne({ where: { id: homebrewID } })
      .then((homebrewBundle) => {
        return (userHomebrewBundle != null || homebrewBundle.userID === getUserID(socket));
      });
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
              hasKeys: inUpdateValues.HasKeys,
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
      return UserHomebrew.canAccessHomebrewBundle(socket, homebrewID)
      .then((canAccess) => {
        if(canAccess){
          return homebrewBundle;
        } else {
          return null;
        }
      });
    });
  }

  static hasHomebrewBundle(socket, homebrewID) {
    return UserHomebrewBundle.findOne({
      where: { userID: getUserID(socket), homebrewID: homebrewID }
    }).then(userBundle => {
      return (userBundle != null);
    });
  }

  static ownsHomebrewBundle(socket, homebrewID) {
    return HomebrewBundle.findOne({
      where: { id: homebrewID, userID: getUserID(socket) }
    }).then(homebrewBundle => {
      return (homebrewBundle != null);
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

  static addToHomebrewCollection(socket, homebrewID, keyCode='None') {
    return User.findOne({ where: { id: getUserID(socket)} })
    .then((user) => {
      if(user != null){
        return HomebrewBundle.findOne({ where: { id: homebrewID } })
        .then((homebrewBundle) => {
          if(homebrewBundle.isPublished === 1){
            if(homebrewBundle.hasKeys === 1) {

              return HomebrewBundleKey.findOne({ where: { homebrewID: homebrewID, keyCode: keyCode } })
              .then((bundleKey) => {

                if(bundleKey != null){
                  return UserHomebrewBundle.create({
                    userID: user.id,
                    homebrewID: homebrewID,
                  }).then((userHomebrewBundle) => {
                    if(bundleKey.isOneTimeUse === 1){
                      return HomebrewBundleKey.destroy({
                        where: {
                          homebrewID: bundleKey.homebrewID,
                          keyCode: bundleKey.keyCode,
                        }
                      }).then((result) => {
                        return true;
                      });
                    } else {
                      return true;
                    }
                  });
                } else {
                  return false;
                }

              });

            } else {

              return UserHomebrewBundle.create({
                userID: user.id,
                homebrewID: homebrewID,
              }).then((userHomebrewBundle) => {
                  return true;
              });

            }
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

  
  // Key Management //

  static addBundleKeys(socket, homebrewID, amount, isOneTimeUse){
    return UserHomebrew.ownsHomebrewBundle(socket, homebrewID).then(ownsBundle => {
      if(ownsBundle) {
        let bundleKeyPromise = [];
        for (let i = 0; i < amount; i++) {
            let newPromise = HomebrewBundleKey.create({
              homebrewID: homebrewID,
              keyCode: getUUIDv4(),
              isOneTimeUse: (isOneTimeUse) ? 1 : 0,
            });
            bundleKeyPromise.push(newPromise);
        }
        return Promise.all(bundleKeyPromise)
        .then(function(result) {
          return;
        });
      }
    });
  }

  static removeBundleKey(socket, homebrewID, keyCode){
    return UserHomebrew.ownsHomebrewBundle(socket, homebrewID).then(ownsBundle => {
      if(ownsBundle) {
        return HomebrewBundleKey.destroy({
          where: {
            homebrewID: homebrewID,
            keyCode: keyCode,
          }
        }).then((result) => {
          return;
        });
      }
    });
  }

  static getBundleKeys(socket, homebrewID){
    return UserHomebrew.ownsHomebrewBundle(socket, homebrewID).then(ownsBundle => {
      if(ownsBundle) {
        return HomebrewBundleKey.findAll({ where: { homebrewID: homebrewID } })
        .then((bundleKeys) => {
          return bundleKeys;
        });
      }
    });
  }

  // Update Bundle //

  static updateBundle(socket, homebrewID) {
    return AuthCheck.isMember(socket)
    .then((isMember) => {
      if(isMember){
        return UserHomebrew.ownsHomebrewBundle(socket, homebrewID).then(ownsBundle => {
          if(ownsBundle) {
            return HomebrewBundle.update({ isPublished: 0 }, {
              where: {
                id: homebrewID,
                userID: getUserID(socket),
              }
            }).then((result) => {
              return;
            });
          }
        });
      }
    });
  }

};