
const Build = require("../models/contentDB/Build");
const BuildDataMapping = require("../models/contentDB/BuildDataMapping");

const Character = require("../models/contentDB/Character");

const Ancestry = require("../models/contentDB/Ancestry");
const Background = require("../models/contentDB/Background");
const Class = require("../models/contentDB/Class");
const Heritage = require("../models/contentDB/Heritage");
const UniHeritage = require("../models/contentDB/UniHeritage");

const GeneralGathering = require('./GeneralGathering');
const CharGathering = require('./CharGathering');
const UserHomebrew = require('./UserHomebrew');

function mapToObj(strMap) {
  let obj = Object.create(null);
  for (let [k,v] of strMap) {
    // We don’t escape the key '__proto__'
    // which can cause problems on older engines
    obj[k] = v;
  }
  return obj;
}

module.exports = class BuildsGathering {

  static getBuild(buildID){
    
    return Build.findOne({
      where: { id: buildID },
    }).then(build => {
      return build;
    });

  }

  static findPublishedBuilds(){

    Build.hasMany(Character, {foreignKey: 'buildID'});
    Character.belongsTo(Build, {foreignKey: 'buildID'});
    return Build.findAll({
      where: { isPublished: 1 },
      include: {
        model: Character,
        attributes:['buildID'],
      }
    }).then(builds => {
      return builds;
    });

  }

  static findTopPublishedBuilds(top=10){
    return BuildsGathering.findPublishedBuilds().then((builds)=>{

      builds = builds.sort(
        function(a, b) {
          let aRating = a.characters.length;
          let bRating = b.characters.length;
          if (aRating === bRating) {
            // Name is only important when ratings are the same
            return a.name > b.name ? 1 : -1;
          }
          return bRating - aRating;
        }
      );

      return builds.slice(0, top);

    });
  }

  static findUserBuilds(userID){
    
    return Build.findAll({
      where: { userID: userID },
    }).then(builds => {
      return builds;
    });

  }

  static getAllMetadata(buildID){
    
    return BuildDataMapping.findAll({
      where: { buildID: buildID },
    }).then(data => {
      return data;
    });

  }

  static getBasicBuildInfo(userID, buildID){
    return Build.findOne({
      where: { id: buildID },
    }).then(build => {
      
      // If build is not published and is owned by someone else, deny access
      if(build != null && build.isPublished == 0 && build.userID != userID){
        return null;
      } else {
        return build;
      }

    });
  }

  static getBuildInfo(buildID){
    if(buildID == null) { return Promise.resolve(null); }
    return Build.findOne({
      where: { id: buildID },
    }).then(build => {
      if(build != null){
        return BuildDataMapping.findAll({
          where: { buildID: build.id },
        }).then(buildData => {
          return {
            build,
            buildData,
          };
        });
      } else {
        return null;
      }
    });
  }

  static getBuildContents(userID, buildID){

    return Build.findOne({
      where: { id: buildID },
    }).then(build => {

      if(build == null){
        return null;
      }
      
      // If build is not published and is owned by someone else, deny access
      if(build.isPublished == 0 && build.userID != userID){
        return null;
      }

      // Get buildData
      return BuildDataMapping.findAll({
        where: { buildID: build.id },
      }).then(buildData => {

        // Get Main Selections
        return Ancestry.findOne({
          where: { id: build.ancestryID },
        }).then(bAncestry => {
          return Background.findOne({
            where: { id: build.backgroundID },
          }).then(bBackground => {
            return CharGathering.getClass(userID, null, build.classID, build.enabledSources, build.enabledHomebrew)
            .then(bClass => {
              return Heritage.findOne({
                where: { id: build.heritageID },
              }).then(bHeritage => {
                return UniHeritage.findOne({
                  where: { id: build.uniHeritageID },
                }).then(bUniHeritage => {
                  
                  // Source Material
                  return GeneralGathering.getAllSkills(userID).then((skillObject) => {
                    return CharGathering.getAllTags(userID, build.enabledHomebrew).then((allTags) => {
                      return CharGathering.getAllFeats(userID, build.enabledSources, build.enabledHomebrew, null, allTags).then((featsObject) => {
                        return CharGathering.getAllItems(userID, build.enabledSources, build.enabledHomebrew, null, allTags).then((itemMap) => {
                          return CharGathering.getAllSpells(userID, build.enabledSources, build.enabledHomebrew, null, null, allTags).then((spellMap) => {
                            return CharGathering.getAllLanguagesBasic(userID, build.enabledHomebrew).then((allLanguages) => {
                              return CharGathering.getAllConditions(userID).then((allConditions) => {
                    
                                // User Collected Bundles
                                return UserHomebrew.getCollectedHomebrewBundles(userID).then((hBundlesCollected) => {
                                  return UserHomebrew.getIncompleteHomebrewBundles(userID).then((hBundlesProgess) => {


                                    return {
                                      buildData,
                                      build,
                                      mainSelections: {
                                        bAncestry,
                                        bBackground,
                                        bClass,
                                        bHeritage,
                                        bUniHeritage,
                                      },
                                      userInfo: {
                                        hBundlesCollected,
                                        hBundlesProgess,
                                      },
                                      sourceMaterial: {
                                        skillObject,
                                        featsObject,
                                        itemsObject: mapToObj(itemMap),
                                        spellsObject: mapToObj(spellMap),
                                        allTags,
                                        allLanguages,
                                        allConditions,
                                      }
                                    };


                                  });
                                });
                              });
                            });
                          });
                        });
                      });
                    });
                  });


                });
              });
            });
          });
        });


      });

    });

  }

};