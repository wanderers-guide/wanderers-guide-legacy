const ADMIN_USER_IDS = ["1"];

module.exports = class TempUnpublishedBooks {
  static getSourcesArray(userID) {
    if (ADMIN_USER_IDS.includes(userID + "")) {
      return [""];
    } else {
      return ["RAGE-OF-ELEMENTS"]; // Unpublished books
    }
  }

  static getSourcesArrayPrisma(userID) {
    if (ADMIN_USER_IDS.includes(userID + "")) {
      return [{ contentSrc: "" }];
    } else {
      return [{ contentSrc: "RAGE-OF-ELEMENTS" }]; // Unpublished books
    }
  }
};
