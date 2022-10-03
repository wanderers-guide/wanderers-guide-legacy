
const Campaign = require("../models/contentDB/Campaign");
const CampaignAccessToken = require("../models/contentDB/CampaignAccessToken");

function getAccessTokenShort(startNum) {
  let rand = function () {
    return Math.random().toString(36).substr(2); // remove `0.`
  };
  return `${startNum.toString(16)}-${rand()}`.substring(0, 15);// limited to max 15 length
}

module.exports = class CampaignSaving {

  static addCampaign(userID, name = 'New Campaign', description = '', imageURL = '') {

    return Campaign.create({
      userID: userID,
      accessID: getAccessTokenShort(userID),
      name: name,
      description: description,
      imageURL: imageURL,
    }).then((campaign) => {
      return campaign;
    });

  }

  static deleteCampaign(campaignID) {

    return Campaign.destroy({
      where: {
        id: campaignID
      }
    }).then((result) => {
      return;
    });

  }

  static updateCampaign(campaignID, updates) {
    let updateValues = {
      name: updates.name,
      description: updates.description,
      imageURL: updates.imageURL,
    };
    return Campaign.update(updateValues, { where: { id: campaignID } })
      .then((result) => {
        return;
      });
  }

  static refreshCampaignAccessID(campaignID) {
    let updateValues = {
      accessID: getAccessTokenShort(),
    };
    return Campaign.update(updateValues, { where: { id: campaignID } })
      .then((result) => {
        return;
      });
  }

  static updateCampaign(campaignID, updates) {
    let updateValues = {
      name: updates.name,
      description: updates.description,
      imageURL: updates.imageURL,
    };
    return Campaign.update(updateValues, { where: { id: campaignID } })
      .then((result) => {
        return;
      });
  }

  static joinCampaign(charID, accessID) {

    return Campaign.findOne({
      where: { accessID: accessID },
    }).then((campaign) => {

      if (campaign != null) {

        return CampaignAccessToken.create({
          campaignID: campaign.id,
          charID: charID,
        }).then((token) => {
          return campaign;
        });

      }

    });

  }

  static leaveCampaign(charID) {

    return CampaignAccessToken.destroy({
      where: {
        charID: charID
      }
    }).then((result) => {
      return;
    });

  }

};