
const APIClientApp = require('../models/contentDB/APIClientApp');
const AccessToken = require('../models/contentDB/AccessToken');

function getUserClientLimit(){ return 3; }

// Returns UserID or -1 if not logged in.
function getUserID(socket){
  if(socket.request.session.passport != null){
      return socket.request.session.passport.user;
  } else {
      return -1;
  }
}

// ID Generation //
function getRandomClientID(){
  return Math.floor(1000+Math.random()*9000) + '-' +
      Math.floor(10000+Math.random()*90000) + '-' +
      Math.floor(1000+Math.random()*9000) + '-' +
      Math.floor(10+Math.random()*90);
}

function getUUIDv4() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    let r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

function getAccessToken(){
  let rand = function() {
    return Math.random().toString(36).substr(2); // remove `0.`
  };
  return rand()+rand();
}
// ~~~~~~~~~~~~~~ //

// Single-Use Codes //
let activeSingleUseCodes = new Map();

function generateSingleUseCode(clientID, charID, accessRights){
  let code = Math.random().toString(36).substr(2); // remove `0.`
  activeSingleUseCodes.set(code, { clientID, charID, accessRights });
  return code;
}

function expireSingleUseCode(code){
  let codeData = activeSingleUseCodes.get(code);
  activeSingleUseCodes.delete(code);
  return codeData;
}
// ~~~~~~~~~~~~~~~~ //

// Access Tokens //
function getTokenExpirationLength(){
  // In seconds, (approx a month)
  return 2629800;
}
// ~~~~~~~~~~~~~ //

module.exports = class ClientAPI {

  static getRequestAccessData(clientID, charID, accessRights){
    return APIClientApp.findOne({ where: { clientID: clientID } })
    .then((apiClient) => {
      if(apiClient.accessRights !== accessRights) { return null; }
      let code = generateSingleUseCode(clientID, charID, accessRights);
      let redirectURI = apiClient.redirectURI;
      return { singleUseCode: code, redirectURI: redirectURI };
    });
  }

  static generateAccessToken(singleUseCode, clientID, apiKey){
    let codeData = expireSingleUseCode(singleUseCode);
    if(codeData != null && codeData.clientID === clientID){

      return APIClientApp.findOne({
        where: {
          clientID: clientID,
          apiKey: apiKey,
        }
      }).then((apiClient) => {
        
        // Sequelize has been comparing MySQL queries as case-insensitive, confirm IDs and keys are exactly the same
        if(apiClient != null && apiClient.clientID === clientID && apiClient.apiKey === apiKey){

          return AccessToken.create({
            accessToken: getAccessToken(),
            clientID: clientID,
            charID: codeData.charID,
            accessRights: codeData.accessRights,
          }).then((accessTokenModel) => {
              return {
                "access_token": accessTokenModel.accessToken,
                "expires_in": getTokenExpirationLength(),
                "char_id": accessTokenModel.charID,
                "access_rights": accessTokenModel.accessRights,
                "token_type": "Bearer",
              };
          });

        } else {
          return null;
        }

      });

    } else {
      return Promise.resolve();
    }
  }

  ///

  static hasAccessToCharacter(charID, accessToken){
    return AccessToken.findOne({ where: { charID: charID, accessToken: accessToken } })
    .then((accessTokenModel) => {
      // Sequelize has been comparing MySQL queries as case-insensitive, confirm accessTokens are exactly the same
      if(accessTokenModel != null && accessTokenModel.accessToken === accessToken){
        
        let currentDate = new Date();
        let expireDate = new Date(accessTokenModel.createdAt.getTime() + getTokenExpirationLength()*1000);
        if(expireDate > currentDate){
          return accessTokenModel.accessRights;
        } else {
          return AccessToken.destroy({
            where: {
                id: accessTokenModel.id
            }
          }).then((result) => {
              return null;
          });
        }

      } else {
        return null;
      }
    });
  }

  ///

  static removeAccessToken(charID, clientID){
    return AccessToken.destroy({
      where: {
        clientID: clientID,
        charID: charID
      }
    }).then((result) => {
        return;
    });
  }

  ///

  static getClientsWhoAccess(charID){
    return AccessToken.findAll({where: { charID: charID }})
    .then((accessTokens) => {
        let clientPromises = [];
        for(const accessToken of accessTokens) {
            let newPromise = APIClientApp.findOne({
              where: { clientID: accessToken.clientID },
              attributes: ['clientID', 'appName', 'description', 'companyName', 'accessRights']
            });
            clientPromises.push(newPromise);
        }
        return Promise.all(clientPromises)
        .then(function(apiClients) {
            return apiClients;
        });
    });
  }

  ///

  static validAPIKey(apiKey){
    return APIClientApp.findOne({ where: { apiKey: apiKey } })
    .then((apiClient) => {
      // Sequelize has been comparing MySQL queries as case-insensitive, confirm keys are exactly the same
      return (apiClient != null && apiClient.apiKey === apiKey);
    });
  }

  static getNumberOfClients(userID){
    return APIClientApp.count({ where: { userID: userID } })
    .then((clientsNum) => {
      return clientsNum;
    });
  }

  static getAllClients(socket){
    let userID = getUserID(socket);
    if(userID != -1){
      return APIClientApp.findAll({ where: { userID: userID } })
      .then((apiClients) => {
        return apiClients;
      });
    } else {
      return Promise.resolve();
    }
  }

  static addClient(socket, clientData) {
    let userID = getUserID(socket);
    if(userID != -1){
      return ClientAPI.getNumberOfClients(userID)
      .then((clientsNum) => {
        if(getUserClientLimit() > clientsNum) {
          return APIClientApp.create({
            userID: userID,
            clientID: getRandomClientID(),
            apiKey: getUUIDv4(),
            appName: clientData.appName,
            redirectURI: clientData.redirectURI,
            companyName: clientData.companyName,
            description: clientData.description,
            iconURL: clientData.iconURL,
            accessRights: clientData.appPermissions,
          }).then((apiClient) => {
              return apiClient;
          });
        } else {
          return;
        }
      });
    } else {
      return Promise.resolve();
    }
  }

  static deleteClient(socket, clientData) {
    let userID = getUserID(socket);
    if(userID != -1){
      return APIClientApp.destroy({
        where: {
          userID: userID,
          clientID: clientData.clientID,
          apiKey: clientData.apiKey,
        },
        limit: 1,
      }).then((result) => {
          return;
      });
    } else {
      return Promise.resolve();
    }
  }

  static updateClient(socket, clientData) {
    let userID = getUserID(socket);
    if(userID != -1){
      let updateValues = {
        appName: clientData.appName,
        redirectURI: clientData.redirectURI,
        companyName: clientData.companyName,
        description: clientData.description,
        iconURL: clientData.iconURL,
        accessRights: clientData.appPermissions,
      };
      return APIClientApp.update(updateValues, {
          where: {
            userID: userID,
            clientID: clientData.clientID,
            apiKey: clientData.apiKey,
          }
      }).then((result) => {
          return;
      });
    } else {
      return Promise.resolve();
    }
  }

  static refreshAPIKey(socket, clientData) {
    let userID = getUserID(socket);
    if(userID != -1){
      let updateValues = {
        apiKey: getUUIDv4(),
      };
      return APIClientApp.update(updateValues, {
          where: {
            userID: userID,
            clientID: clientData.clientID,
            apiKey: clientData.apiKey,
          }
      }).then((result) => {
          return;
      });
    } else {
      return Promise.resolve();
    }
  }

};