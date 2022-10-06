
const User = require('../models/contentDB/User');
const Character = require('../models/contentDB/Character');
const InvItem = require('../models/contentDB/InvItem');
const Build = require('../models/contentDB/Build');
const Campaign = require('../models/contentDB/Campaign');

const CharStateUtils = require('./CharStateUtils');
const CampaignGathering = require('./CampaignGathering');

module.exports = class AuthCheck {

  static isLoggedIn(userID) {
    return (userID != -1);
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

        if(character.userID === userID){
          return true;
        }
        if(CharStateUtils.isPublic(character)){
          return true;
        }

        return CampaignGathering.getCampaign(character.id)
        .then((campaign) => {
          if(!campaign) { return false; }

          return campaign.userID === userID;

        });
        
      }).catch((error) => {
        return false;
      });
  }

  static canEditCharacter(userID, charID) {
    return Character.findOne({ where: { id: charID } })
      .then((character) => {

        if(!character){ return false; }
        
        if(character.userID === userID){
          return true;
        }

        return CampaignGathering.getCampaign(character.id)
        .then((campaign) => {
          if(!campaign) { return false; }

          return campaign.userID === userID;

        });

      }).catch((error) => {
        return false;
      });
  }

  static canEditInv(userID, invID) {
    return Character.findOne({ where: { inventoryID: invID } })
      .then((character) => {
        return AuthCheck.canEditCharacter(userID, character.id);
      }).catch((error) => {
        return false;
      });
  }

  static canEditInvItem(userID, invItemID) {
    return InvItem.findOne({ where: { id: invItemID } })
      .then((invItem) => {
        return AuthCheck.canEditInv(userID, invItem.invID);
      }).catch((error) => {
        return false;
      });
  }

  static canEditBuild(userID, buildID) {
    return Build.findOne({ where: { id: buildID, userID: userID, isPublished: 0 } })
      .then((build) => {
        return (build != null);
      }).catch((error) => {
        return false;
      });
  }

  static canViewBuild(userID, buildID) {
    return Build.findOne({ where: { id: buildID } })
      .then((build) => {
        if (build != null) {
          return (build.userID == userID || build.isPublished == 1);
        } else {
          return false;
        }
      }).catch((error) => {
        return false;
      });
  }

  static ownsBuild(userID, buildID) {
    return Build.findOne({ where: { id: buildID, userID: userID } })
      .then((build) => {
        return (build != null);
      }).catch((error) => {
        return false;
      });
  }

  static ownsCampaign(userID, campaignID) {
    return Campaign.findOne({ where: { id: campaignID, userID: userID } })
      .then((campaign) => {
        return (campaign != null);
      }).catch((error) => {
        return false;
      });
  }

  /* -------- */

  static getPermissions(userID) {
    return User.findOne({ where: { id: userID } })
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