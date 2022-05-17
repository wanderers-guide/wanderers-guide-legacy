

const ADMIN_USER_IDS = ['1', '11'];

module.exports = class TempUnpublishedBooks {

  static getSourcesArray(userID){
    if(ADMIN_USER_IDS.includes(userID+'')){
      return [''];
    } else {
      return ['LOST-KNIGHTS-WALL'];// Unpublished books
    }
  }

  static getSourcesArrayPrisma(userID){
    if(ADMIN_USER_IDS.includes(userID+'')){
      return [{contentSrc:''}];
    } else {
      return [{contentSrc:'LOST-KNIGHTS-WALL'}];// Unpublished books
    }
  }

};