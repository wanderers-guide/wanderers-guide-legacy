
const Campaign = require("../models/contentDB/Campaign");
const CampaignAccessToken = require("../models/contentDB/CampaignAccessToken");

module.exports = class CampaignGathering {

    static getOwnedCampaigns(userID){
    
        return Campaign.findAll({
          where: { userID: userID },
        }).then(campaigns => {
          return campaigns;
        });
    
    }

    static getCampaign(charID){

        return CampaignAccessToken.findOne({
            where: { charID: charID },
        }).then((token) => {
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



};