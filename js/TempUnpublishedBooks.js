

const ADMIN_USER_IDS = ['1', '11', '13'];

module.exports = class TempUnpublishedBooks {

  static getSourcesArray(userID){
    if(ADMIN_USER_IDS.includes(userID+'')){
      return [''];
    } else {
      return ['SECRETS-OF-MAGIC'];
    }
  }

  static getSourcesArrayPrisma(userID){
    if(ADMIN_USER_IDS.includes(userID+'')){
      return [{contentSrc:''}];
    } else {
      return [{contentSrc:'SECRETS-OF-MAGIC'}];
    }
  }

};