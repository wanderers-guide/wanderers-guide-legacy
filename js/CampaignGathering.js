
const Campaign = require("../models/contentDB/Campaign");
const CampaignAccessToken = require("../models/contentDB/CampaignAccessToken");
const Character = require("../models/contentDB/Character");
const CalculatedStat = require("../models/contentDB/CalculatedStat");

module.exports = class CampaignGathering {

  static getOwnedCampaigns(userID) {

    return Campaign.findAll({
      where: { userID: userID },
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

    /*
    Campaign.hasMany(CampaignAccessToken, {foreignKey: 'campaignID'});
    CampaignAccessToken.belongsTo(Campaign, {foreignKey: 'campaignID'});
    return Campaign.findAll({
        order: [['name', 'ASC'],],
        where: { charID: charID },
        include: [CampaignAccessToken]
    }).then((campaigns) => {
        return campaigns;
    });
    */

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

  static getUsersInCampaign(charID) {

    return CampaignAccessToken.findOne({
      where: { charID: charID },
    }).then((charToken) => {
      if (!charToken) { return []; }

      return CampaignAccessToken.findAll({
        where: {
          campaignID: charToken.campaignID,
        },
      }).then((tokens) => {

        let userIDs = new Set();
        for(let token of tokens){
          userIDs.add(token.userID);
        }
        return Array.from(userIDs);

      });

    });

  }



};