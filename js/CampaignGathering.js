
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



};