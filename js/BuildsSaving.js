const Build = require("../models/contentDB/Build");
const BuildDataMapping = require("../models/contentDB/BuildDataMapping");
const User = require("../models/contentDB/User");

const UserHomebrew = require('./UserHomebrew');
const CharContentSources = require('./CharContentSources');
const CharContentHomebrew = require('./CharContentHomebrew');

module.exports = class BuildsSaving {

  static saveName(buildID, name){
    let buildUpVals = {name: name };
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

};