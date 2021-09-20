

const ADMIN_USER_IDS = ['1', '11', '13'];

module.exports = class TempUnpublishedBooks {

  static getSourcesArray(userID){
    if(ADMIN_USER_IDS.includes(userID+'')){
      return [''];
    } else {
      return ['DARK-ARCHIVE'];// Unpublished books
    }
  }

  static getSourcesArrayPrisma(userID){
    if(ADMIN_USER_IDS.includes(userID+'')){
      return [{contentSrc:''}];
    } else {
      return [{contentSrc:'DARK-ARCHIVE'}];// Unpublished books
    }
  }

};