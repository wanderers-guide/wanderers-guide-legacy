
const Campaign = require("../models/contentDB/Campaign");
const CampaignAccessToken = require("../models/contentDB/CampaignAccessToken");
const Character = require("../models/contentDB/Character");
const CalculatedStat = require("../models/contentDB/CalculatedStat");

module.exports = class CampaignGathering {

  static getOwnedCampaigns(userID) {

    Campaign.hasMany(CampaignAccessToken, { foreignKey: 'campaignID' });
    CampaignAccessToken.belongsTo(Campaign, { foreignKey: 'campaignID' });

    return Campaign.findAll({
      where: { userID: userID },
      include: [CampaignAccessToken]
    }).then(campaigns => {
      return campaigns;
    });

  }

  static getJoinedCampaigns(userID) {

    return CampaignAccessToken.findAll({
      where: { userID: userID },
    }).then((tokens) => {
      if (!tokens) { return []; }

      let campaignIDs = new Set();
      for(let token of tokens){
        campaignIDs.add(token.campaignID);
      }
      return Array.from(campaignIDs);

    });

  }

  static getCampaign(charID) {

    return CampaignAccessToken.findOne({
      where: { charID: charID },
    }).then((token) => {
      if (!token) { return null; }
      return Campaign.findOne({
        where: { id: token.campaignID },
      }).then((campaign) => {
        return campaign;
      });
    });

  }

  static getCampaignDetails(campaignID) {

    return Campaign.findOne({
      where: { id: campaignID },
    }).then(campaign => {

      Character.hasOne(CampaignAccessToken, { foreignKey: 'charID' });
      CampaignAccessToken.belongsTo(Character, { foreignKey: 'charID' });

      CalculatedStat.hasOne(CampaignAccessToken, { foreignKey: 'charID' });
      CampaignAccessToken.belongsTo(CalculatedStat, { foreignKey: 'charID' });

      return CampaignAccessToken.findAll({
        where: { campaignID: campaignID },
        include: [Character, CalculatedStat]
      }).then((accessTokens) => {
        return {
          campaign,
          accessTokens,
        };
      });

    });

  }

  static getCampaignDetailsFromChar(charID){

    return CampaignAccessToken.findOne({
      where: { charID: charID },
    }).then((token) => {
      if (!token) { return null; }
      return CampaignGathering.getCampaignDetails(token.campaignID)
      .then((details) => {
        return details;
      });
    });

  }


  static getUsersInCampaign(campaignID) {

    return CampaignAccessToken.findAll({
      where: {
        campaignID: campaignID,
      },
    }).then((tokens) => {

      let userIDs = new Set();
      for(let token of tokens){
        userIDs.add(token.userID);
      }
      return Array.from(userIDs);

    });

  }

  static getUsersInCampaignFromChar(charID) {

    return CampaignAccessToken.findOne({
      where: { charID: charID },
    }).then((token) => {
      if (!token) { return null; }
      return CampaignGathering.getUsersInCampaign(token.campaignID)
      .then((userIDs) => {
        return userIDs;
      });
    });

  }



};