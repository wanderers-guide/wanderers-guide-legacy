
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

module.exports = class UserHomebrew {

  static canAccessHomebrewBundle(userID, homebrewID){
    return UserHomebrewBundle.findOne({
      where: { userID: userID, homebrewID: homebrewID },
    }).then(userHomebrewBundle => {
      return HomebrewBundle.findOne({ where: { id: homebrewID } })
      .then((homebrewBundle) => {
        return (userHomebrewBundle != null || homebrewBundle.userID === userID || homebrewBundle.isPublished === 1);
      });
    });
  }

  static createHomebrewBundle(userID) {
    return AuthCheck.isMember(userID)
    .then((isMember) => {
      if(isMember){
        return User.findOne({ where: { id: userID } })
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

  static updateHomebrewBundle(userID, homebrewID, inUpdateValues) {
    return AuthCheck.isMember(userID)
    .then((isMember) => {
      if(isMember){
        return HomebrewBundle.findOne({ where: { id: homebrewID, userID: userID } })
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
                userID: userID,
              }
            }).then((result) => {
              return HomebrewBundle.findOne({ where: { id: homebrewID, userID: userID } })
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

  static deleteHomebrewBundle(userID, homebrewID) {
    return HomebrewBundle.findOne({ where: { id: homebrewID, userID: userID } })
    .then((homebrewBundle) => {
      if(homebrewBundle != null){
        return HomebrewBundle.destroy({
          where: {
            id: homebrewBundle.id,
            userID: userID
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

  static canEditHomebrew(userID, homebrewID) {
    return AuthCheck.isMember(userID)
    .then((isMember) => {
      if(isMember){
        return HomebrewBundle.findOne({ where: { id: homebrewID, userID: userID } })
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

  static getHomebrewBundles(userID) {
    HomebrewBundle.hasMany(UserHomebrewBundle, {foreignKey: 'homebrewID'});
    UserHomebrewBundle.belongsTo(HomebrewBundle, {foreignKey: 'homebrewID'});
    return HomebrewBundle.findAll({
      where: { userID: userID },
      include: {
        model: UserHomebrewBundle,
        attributes:['homebrewID'],
      }
    }).then(hBundles => {
      return hBundles;
    });
  }

  static getIncompleteHomebrewBundles(userID) {
    return HomebrewBundle.findAll({ where: { userID: userID, isPublished: 0 } })
    .then((homebrewBundles) => {
      return homebrewBundles;
    });
  }

  static getHomebrewBundle(userID, homebrewID) {
    return HomebrewBundle.findOne({ where: { id: homebrewID } })
    .then((homebrewBundle) => {
      return UserHomebrew.canAccessHomebrewBundle(userID, homebrewID)
      .then((canAccess) => {
        if(canAccess){
          return homebrewBundle;
        } else {
          return null;
        }
      });
    });
  }

  static hasHomebrewBundle(userID, homebrewID) {
    return UserHomebrewBundle.findOne({
      where: { userID: userID, homebrewID: homebrewID }
    }).then(userBundle => {
      return (userBundle != null);
    });
  }

  static ownsHomebrewBundle(userID, homebrewID) {
    return HomebrewBundle.findOne({
      where: { id: homebrewID, userID: userID }
    }).then(homebrewBundle => {
      return (homebrewBundle != null);
    });
  }

  static getCollectedHomebrewBundles(userID){
    User.hasMany(UserHomebrewBundle, {foreignKey: 'userID'});
    UserHomebrewBundle.belongsTo(User, {foreignKey: 'userID'});
    HomebrewBundle.hasMany(UserHomebrewBundle, {foreignKey: 'homebrewID'});
    UserHomebrewBundle.belongsTo(HomebrewBundle, {foreignKey: 'homebrewID'});

    return UserHomebrewBundle.findAll({
      where: { userID: userID },
      include: [HomebrewBundle]
    }).then(hBundles => {
      return hBundles;
    });
  }

  static publishHomebrew(userID, homebrewID) {
    return AuthCheck.isMember(userID)
    .then((isMember) => {
      if(isMember){
        return HomebrewBundle.findOne({ where: { id: homebrewID, userID: userID } })
        .then((homebrewBundle) => {
            if(homebrewBundle.isPublished === 0){
              return User.findOne({ where: { id: userID } })
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

  static getValidKey(homebrewID, keyCode){
    return HomebrewBundleKey.findOne({ where: { homebrewID: homebrewID, keyCode: keyCode } })
    .then((bundleKey) => {
      return bundleKey;
    });
  }

  static addToHomebrewCollection(userID, homebrewID, keyCode='None') {
    return User.findOne({ where: { id: userID} })
    .then((user) => {
      if(user != null){
        return HomebrewBundle.findOne({ where: { id: homebrewID } })
        .then((homebrewBundle) => {
          if(homebrewBundle.isPublished === 1){
            if(homebrewBundle.hasKeys === 1) {

              return UserHomebrew.getValidKey(homebrewID, keyCode)
              .then((bundleKey) => {
                if(bundleKey != null) {
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

  static removeFromHomebrewCollection(userID, homebrewID) {
    return User.findOne({ where: { id: userID} })
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

  static addBundleKeys(userID, homebrewID, amount, isOneTimeUse){
    return UserHomebrew.ownsHomebrewBundle(userID, homebrewID).then(ownsBundle => {
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

  static removeBundleKey(userID, homebrewID, keyCode){
    return UserHomebrew.ownsHomebrewBundle(userID, homebrewID).then(ownsBundle => {
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

  static getBundleKeys(userID, homebrewID){
    return UserHomebrew.ownsHomebrewBundle(userID, homebrewID).then(ownsBundle => {
      if(ownsBundle) {
        return HomebrewBundleKey.findAll({ where: { homebrewID: homebrewID } })
        .then((bundleKeys) => {
          return bundleKeys;
        });
      }
    });
  }

  // Update Bundle //

  static updateBundle(userID, homebrewID) {
    return AuthCheck.isMember(userID)
    .then((isMember) => {
      if(isMember){
        return UserHomebrew.ownsHomebrewBundle(userID, homebrewID).then(ownsBundle => {
          if(ownsBundle) {
            return HomebrewBundle.update({ isPublished: 0 }, {
              where: {
                id: homebrewID,
                userID: userID,
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