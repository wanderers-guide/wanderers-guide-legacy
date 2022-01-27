const Build = require("../models/contentDB/Build");
const BuildDataMapping = require("../models/contentDB/BuildDataMapping");
const User = require("../models/contentDB/User");

const UserHomebrew = require('./UserHomebrew');
const CharContentSources = require('./CharContentSources');
const CharContentHomebrew = require('./CharContentHomebrew');

function objToMap(obj) {
  let strMap = new Map();
  for (let k of Object.keys(obj)) {
    strMap.set(k, obj[k]);
  }
  return strMap;
}

module.exports = class BuildsSaving {

  static saveName(buildID, name){
    let buildUpVals = {name: name };
    return Build.update(buildUpVals, { where: { id: buildID } })
    .then((result) => {
        return;
    });
  }

  static saveDescription(buildID, description){
    let buildUpVals = {description: description };
    return Build.update(buildUpVals, { where: { id: buildID } })
    .then((result) => {
        return;
    });
  }

  static saveContactInfo(buildID, contactInfo){
    let buildUpVals = {contactInfo: contactInfo };
    return Build.update(buildUpVals, { where: { id: buildID } })
    .then((result) => {
        return;
    });
  }

  static saveArtworkURL(buildID, artworkURL){
    let buildUpVals = {artworkURL: artworkURL };
    return Build.update(buildUpVals, { where: { id: buildID } })
    .then((result) => {
        return;
    });
  }

  static saveCustomCode(buildID, code) {
    let buildUpVals = { customCode: code };
    return Build.update(buildUpVals, { where: { id: buildID } })
    .then((result) => {
        return;
    });
  }

  
  static saveOption(buildID, optionName, value) {

    let buildUpVals = null;
    if(optionName === 'optionCustomCodeBlock'){
      buildUpVals = {
        optionCustomCodeBlock: value
      };
    } else if(optionName === 'optionClassArchetypes'){
      buildUpVals = {
        optionClassArchetypes: value
      };
    } else if(optionName === 'variantFreeArchetype'){
      buildUpVals = {
        variantFreeArchetype: value
      };
    } else if(optionName === 'variantGradualAbilityBoosts'){
      buildUpVals = {
        variantGradualAbilityBoosts: value
      };
    } else if(optionName === 'variantAncestryParagon'){
      buildUpVals = {
        variantAncestryParagon: value
      };
    } else if(optionName === 'variantStamina'){
      buildUpVals = {
        variantStamina: value
      };
    }

    if(buildUpVals != null){
        return Build.update(buildUpVals, { where: { id: buildID } })
        .then((result) => {
            return;
        });
    } else {
        return Promise.resolve();
    }

  }

  static clearMetaData(buildID) {

    return BuildDataMapping.destroy({
      where: { buildID: buildID }
    }).then((result) => {
      return;
    });

  }


  static addSource(buildID, sourceName){
    return Build.findOne({ where: { id: buildID} })
    .then((build) => {
        let sourceArray = CharContentSources.getSourceArray(build.enabledSources);
        sourceArray.push(sourceName);
        let buildUpVals = {enabledSources: JSON.stringify(sourceArray) };
        return Build.update(buildUpVals, { where: { id: build.id } })
        .then((result) => {
            return;
        });
    });
  }

  static removeSource(buildID, sourceName){
    return Build.findOne({ where: { id: buildID} })
    .then((build) => {
        let sourceArray = CharContentSources.getSourceArray(build.enabledSources);
        let sourceIndex = sourceArray.indexOf(sourceName);
        if (sourceIndex > -1) {
            sourceArray.splice(sourceIndex, 1);
        }
        let buildUpVals = {enabledSources: JSON.stringify(sourceArray) };
        return Build.update(buildUpVals, { where: { id: build.id } })
        .then((result) => {
            return;
        });
    });
  }

  static setSources(buildID, inputSourceArray){
    return Build.findOne({ where: { id: buildID} })
    .then((build) => {
      let sourceArray = [];
      try{
        for(let source of inputSourceArray){
          sourceArray.push(source+'');
        }
      } catch (err){}
      let buildUpVals = {enabledSources: JSON.stringify(sourceArray) };
      return Build.update(buildUpVals, { where: { id: build.id } })
      .then((result) => {
        return;
      });
    });
  }


  static addHomebrewBundle(userID, buildID, homebrewID){
    return UserHomebrew.canAccessHomebrewBundle(userID, homebrewID)
    .then((canAccess) => {
      if(canAccess){
        return Build.findOne({ where: { id: buildID } })
        .then((build) => {
            let homebrewArray = CharContentHomebrew.getHomebrewArray(build.enabledHomebrew);
            homebrewArray.push(homebrewID);
            let buildUpVals = {enabledHomebrew: JSON.stringify(homebrewArray) };
            return Build.update(buildUpVals, { where: { id: build.id } })
            .then((result) => {
                return;
            });
        });
      }
    });
  }

  static removeHomebrewBundle(buildID, homebrewID){
    return Build.findOne({ where: { id: buildID } })
      .then((build) => {
          let homebrewArray = CharContentHomebrew.getHomebrewArray(build.enabledHomebrew);
          let bundleIndex = homebrewArray.indexOf(homebrewID);
          if (bundleIndex > -1) {
            homebrewArray.splice(bundleIndex, 1);
          }
          let buildUpVals = {enabledHomebrew: JSON.stringify(homebrewArray) };
          return Build.update(buildUpVals, { where: { id: build.id } })
          .then((result) => {
              return;
          });
      });
  }

  static createNewBuild(userID) {

    return User.findOne({ where: { id: userID } })
    .then((user) => {
      return Build.create({
        userID: userID,
        name: 'New Build',
        isPublished: 0,
        authorName: user.username,
      }).then((build) => {
        return build;
      });
    });

  }


  static updateMetaData(buildID, metaDataObject) {

    return BuildsSaving.clearMetaData(buildID)
    .then(() => {

      let metaDataMap = objToMap(metaDataObject);

      let entryPromises = [];
      for(const [JSON_srcStruct, value] of metaDataMap.entries()){
        let srcStruct = JSON.parse(JSON_srcStruct);
        
        let newPromise = BuildDataMapping.upsert({
          buildID,
          source: srcStruct.source,
          sourceType: srcStruct.sourceType,
          sourceLevel: srcStruct.sourceLevel,
          sourceCode: srcStruct.sourceCode,
          sourceCodeSNum: srcStruct.sourceCodeSNum,
          value,
        });
        entryPromises.push(newPromise);
      }

      return Promise.all(entryPromises)
      .then(function(result) {
        return;
      });

    });

  }

  static updateInfo(buildID, buildInfo){

    let updateValues = {
      ancestryID: buildInfo.ancestryID,
      heritageID: buildInfo.heritageID,
      uniHeritageID: buildInfo.uniHeritageID,
      backgroundID: buildInfo.backgroundID,
      classID: buildInfo.classID,
    };

    return Build.update(updateValues, { where: { id: buildID } })
    .then((result) => {
        return;
    });

  }

  static updateFinalStats(buildID, finalStatistics){

    let updateValues = {
      finalStatsJSON: JSON.stringify(finalStatistics),
    };

    return Build.update(updateValues, { where: { id: buildID } })
    .then((result) => {
        return;
    });

  }

  static publishBuild(buildID){

    return Build.update({ isPublished: 1 }, { where: { id: buildID } })
    .then((result) => {
        return;
    });

  }

  static updateBuild(buildID){

    return Build.update({ isPublished: 0 }, { where: { id: buildID } })
    .then((result) => {
        return;
    });

  }

  static deleteBuild(buildID){

    return Build.destroy({
      where: { id: buildID }
    }).then((result) => {
      return;
    });

  }

};