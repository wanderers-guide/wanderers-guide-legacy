
const Character = require('../models/contentDB/Character');
const Class = require('../models/contentDB/Class');
const ClassAbility = require('../models/contentDB/ClassAbility');
const Archetype = require('../models/contentDB/Archetype');
const Background = require('../models/contentDB/Background');
const Ancestry = require('../models/contentDB/Ancestry');
const AncestryBoost = require('../models/contentDB/AncestryBoost');
const AncestryFlaw = require('../models/contentDB/AncestryFlaw');
const AncestryLanguage = require('../models/contentDB/AncestryLanguage');
const UniHeritage = require('../models/contentDB/UniHeritage');
const Tag = require('../models/contentDB/Tag');
const Heritage = require('../models/contentDB/Heritage');
const Feat = require('../models/contentDB/Feat');
const FeatTag = require('../models/contentDB/FeatTag');
const Item = require('../models/contentDB/Item');
const TaggedItem = require('../models/contentDB/TaggedItem');
const Storage = require('../models/contentDB/Storage');
const Weapon = require('../models/contentDB/Weapon');
const Armor = require('../models/contentDB/Armor');
const Shield = require('../models/contentDB/Shield');
const ItemRune = require('../models/contentDB/ItemRune');
const Spell = require('../models/contentDB/Spell');
const TaggedSpell = require('../models/contentDB/TaggedSpell');

const CharSaving = require('./CharSaving');

function becomeNegative(number){
    if(number > 0){
        return -1*number;
    } else {
        return number;
    }
}

module.exports = class AdminUpdate {

    static addBackground(data) {
        /* Data:
            backgroundID,
            backgroundName,
            backgroundVersion,
            backgroundRarity,
            backgroundDescription,
            backgroundBoosts,
            backgroundCode,
            backgroundContentSrc,
        */
        for(let d in data) { if(data[d] === ''){ data[d] = null; } }
        data.backgroundName = data.backgroundName.replace(/’/g,"'");
        if(data.backgroundDescription == null){ data.backgroundDescription = '__No Description__'; }
        if(data.backgroundVersion == null){ data.backgroundVersion = '1.0'; }
        return Background.create({ // Create Background
            name: data.backgroundName,
            version: data.backgroundVersion,
            rarity: data.backgroundRarity,
            description: data.backgroundDescription,
            boostOne: data.backgroundBoosts,
            boostTwo: 'ALL',
            code: data.backgroundCode,
            contentSrc: data.backgroundContentSrc,
            homebrewID: null,
        }).then(background => {
            return background;
        });

    }

    static deleteBackground(backgroundID){
        if(backgroundID == null) {return;}
        return Background.findOne({where: { id: backgroundID}})
        .then((background) => {
            // Clear Background Details for every Character that had this Background
            return Character.findAll({where: { backgroundID: background.id }})
            .then((charactersWithBackground) => {
                let characterBackgroundClearPromises = [];
                for(const charWithBackground of charactersWithBackground) {
                    let newPromise = CharSaving.saveBackground(charWithBackground.id, null);
                    characterBackgroundClearPromises.push(newPromise);
                }
                return Promise.all(characterBackgroundClearPromises)
                .then(function(result) {
                    return Background.destroy({ // Finally, delete Background
                        where: { id: background.id }
                    }).then((result) => {
                        return;
                    });
                });
            });
        });
    }

    static archiveBackground(backgroundID, isArchived){
        let archived = (isArchived) ? 1 : 0;
        let updateValues = { isArchived: archived };
        return Background.update(updateValues, { where: { id: backgroundID } })
        .then((result) => {
            return;
        });
    }


    static addClass(data) {
        /* Data:
            classID,
            className,
            classVersion,
            classHitPoints,
            classKeyAbility,
            classPerception,
            classSkills,
            classSkillsMore,
            classFortitude,
            classReflex,
            classWill,
            classClassDC,
            classWeapons,
            classArmor,
            classDescription,
            classAbilitiesArray,
            classFeatsArray,
            classContentSrc,
        */
        for(let d in data) { if(data[d] === ''){ data[d] = null; } }
        data.className = data.className.replace(/’/g,"'");
        if(data.classDescription == null){ data.classDescription = '__No Description__'; }
        if(data.classVersion == null){ data.classVersion = '1.0'; }
        let tagDesc = 'This indicates content from the '+data.className.toLowerCase()+' class.';
        return Tag.create({ // Create Class Tag
            name: data.className,
            description: tagDesc,
            isHidden: 1,
        }).then(classTag => {
            return Class.create({ // Create Class
                name: data.className,
                version: data.classVersion,
                hitPoints: data.classHitPoints,
                keyAbility: data.classKeyAbility,
                description: data.classDescription,
                tPerception: data.classPerception,
                tFortitude: data.classFortitude,
                tReflex: data.classReflex,
                tWill: data.classWill,
                tClassDC: data.classClassDC,
                tSkills: data.classSkills,
                tSkillsMore: data.classSkillsMore,
                tWeapons: data.classWeapons,
                tArmor: data.classArmor,
                tagID: classTag.id,
                contentSrc: data.classContentSrc,
                homebrewID: null,
            }).then(cClass => {
                let classFeatPromises = []; // Create Class Feats
                if(data.classFeatsArray != null){
                    for(const classFeat of data.classFeatsArray) {
                        if(!classFeat.featTagsArray.includes(classTag.id)){
                            classFeat.featTagsArray.push(classTag.id);
                        }
                        classFeat.isDefault = 0;
                        classFeat.skillID = null;
                        classFeat.minProf = null;
                        classFeat.genericType = null;
                        classFeat.genTypeName = null;
                        classFeat.isArchived = 0;
                        classFeat.contentSrc = cClass.contentSrc;
                        classFeat.version = null;
                        let newPromise = AdminUpdate.addFeatPreparedData(classFeat);
                        classFeatPromises.push(newPromise);
                    }
                }
                return Promise.all(classFeatPromises)
                .then(function(result) {
                    let classAbilitiesPromises = []; // Create Class Abilities
                    if(data.classAbilitiesArray != null) {
                        for(const classAbility of data.classAbilitiesArray) {
                            classAbility.indivClassName = null;
                            classAbility.contentSrc = cClass.contentSrc;
                            let newPromise =  AdminUpdate.addClassAbility(cClass.id, classAbility);
                            classAbilitiesPromises.push(newPromise);
                        }
                    }
                    return Promise.all(classAbilitiesPromises)
                    .then(function(result) {
                        return cClass;
                    });
                });
            });
        });

    }

    static addClassAbility(classID, classAbility){
        let selectType = 'NONE';
        if(classAbility.options != null && classAbility.options.length > 0){
            selectType = 'SELECTOR';
        }
        return ClassAbility.create({
            classID: classID,
            name: classAbility.name,
            level: classAbility.level,
            description: classAbility.description,
            code: classAbility.code,
            selectType: selectType,
            selectOptionFor: null,
            displayInSheet: classAbility.displayInSheet,
            indivClassName: classAbility.indivClassName,
            contentSrc: classAbility.contentSrc,
        }).then(classAbilityModel => {
            let classAbilityOptionsPromises = [];
            if(classAbility.options.length > 0){
                for(let classAbilityOption of classAbility.options){
                    let newPromise =  ClassAbility.create({
                        classID: classID,
                        name: classAbilityOption.name,
                        level: classAbility.level,
                        description: classAbilityOption.description,
                        code: classAbilityOption.code,
                        selectType: 'SELECT_OPTION',
                        selectOptionFor: classAbilityModel.id,
                    });
                    classAbilityOptionsPromises.push(newPromise);
                }
            }
            return Promise.all(classAbilityOptionsPromises)
            .then(function(result) {
                return classAbilityModel;
            });
        });

    }

    static deleteClass(classID){
        if(classID == null) {return;}
        return Class.findOne({where: { id: classID}})
        .then((cClass) => {
            // Clear Class Details for every Character that had this Class
            return Character.findAll({where: { classID: cClass.id }})
            .then((charactersWithClass) => {
                let characterClassClearPromises = [];
                for(const charWithClass of charactersWithClass) {
                    let newPromise = CharSaving.saveClass(charWithClass.id, null);
                    characterClassClearPromises.push(newPromise);
                }
                return Promise.all(characterClassClearPromises)
                .then(function(result) {
                    return FeatTag.findAll({where: { tagID: cClass.tagID }})
                    .then((featTags) => {
                        let classFeatsPromises = []; // Delete Class Feats
                        for(const featTag of featTags) {
                            let newPromise = Feat.destroy({
                                where: {
                                    id: featTag.featID,
                                    genericType: null
                                }
                            });
                            classFeatsPromises.push(newPromise);
                        }
                        return Promise.all(classFeatsPromises)
                        .then(function(result) {
                            return Tag.destroy({ // Delete Tag (which will cascade to FeatTags)
                                where: { id: cClass.tagID }
                            }).then((result) => {
                                return Class.destroy({ // Finally, delete Class
                                    where: { id: cClass.id }
                                }).then((result) => {
                                    return;
                                });
                            });
                        });
                    });
                });
            });
        });
    }

    static archiveClass(classID, isArchived){
        let archived = (isArchived) ? 1 : 0;
        let updateValues = { isArchived: archived };
        return Class.update(updateValues, { where: { id: classID } })
        .then((result) => {
            return Class.findOne({where: { id: classID }})
            .then((cClass) => {
                return Tag.update(updateValues, { where: { id: cClass.tagID } })
                .then((result) => {
                    return FeatTag.findAll({where: { tagID: cClass.tagID }})
                    .then((featTags) => {
                        let classFeatsPromises = [];
                        for(const featTag of featTags) {
                            let newPromise = Feat.update(updateValues, {
                                where: {
                                    id: featTag.featID,
                                    genericType: null
                                }
                            });
                            classFeatsPromises.push(newPromise);
                        }
                        return Promise.all(classFeatsPromises)
                        .then(function(result) {
                            return;
                        });
                    });
                });
            });
        });
    }



    static addClassFeature(data) {
        /* Data:
            classFeatureID,
            classFeatureData,
            classFeatureClassName,
            classFeatureContentSrc
        */
        for(let d in data) { if(data[d] === ''){ data[d] = null; } }
        data.classFeatureData.indivClassName = data.classFeatureClassName;
        data.classFeatureData.contentSrc = data.classFeatureContentSrc;
        return AdminUpdate.addClassAbility(null, data.classFeatureData)
        .then(classAbility => {
            return classAbility;
        });
    }

    static deleteClassFeature(classFeatureID){
        if(classFeatureID == null) {return;}
        return ClassAbility.destroy({
            where: { id: classFeatureID }
        }).then((result) => { // Which will cascade to delect select options
            return;
        });
    }

    static archiveClassFeature(classFeatureID, isArchived){
        let archived = (isArchived) ? 1 : 0;
        let updateValues = { isArchived: archived };
        return ClassAbility.update(updateValues, { where: { id: classFeatureID } })
        .then((result) => {
            return;
        });
    }



    static addArchetype(data) {
        /* Data:
            archetypeID,
            archetypeName,
            archetypeVersion,
            archetypeIsMulticlass,
            archetypeDescription,
            archetypeDedicationFeat,
            archetypeFeatsArray,
            archetypeContentSrc
        */
        for(let d in data) { if(data[d] === ''){ data[d] = null; } }
        data.archetypeName = data.archetypeName.replace(/’/g,"'");
        if(data.archetypeDescription == null){ data.archetypeDescription = '__No Description__'; }
        if(data.archetypeVersion == null){ data.archetypeVersion = '1.0'; }
        let tagDesc = 'This indicates content from the '+data.archetypeName.toLowerCase()+' archetype.';
        return Tag.create({ // Create Archetype Tag
            name: data.archetypeName+' Archetype',
            description: tagDesc,
            isHidden: 1,
        }).then(archetypeTag => {

            data.archetypeDedicationFeat.featTagsArray.push(580);// Hardcoded Dedication Tag ID
            if(data.archetypeIsMulticlass === 1){
                data.archetypeDedicationFeat.featTagsArray.push(599);// Hardcoded Multiclass Tag ID
            }
            data.archetypeDedicationFeat.name = data.archetypeName+' Dedication';
            data.archetypeDedicationFeat.isDefault = 0;
            data.archetypeDedicationFeat.skillID = null;
            data.archetypeDedicationFeat.minProf = null;
            data.archetypeDedicationFeat.genericType = null;
            data.archetypeDedicationFeat.genTypeName = null;
            data.archetypeDedicationFeat.isArchived = 0;
            data.archetypeDedicationFeat.contentSrc = data.archetypeContentSrc;
            data.archetypeDedicationFeat.version = null;
            return AdminUpdate.addFeatPreparedData(data.archetypeDedicationFeat)
            .then(dedicationFeat => {

                return Archetype.create({ // Create Archetype
                    name: data.archetypeName,
                    version: data.archetypeVersion,
                    description: data.archetypeDescription,
                    dedicationFeatID: dedicationFeat.id,
                    isMulticlass: data.archetypeIsMulticlass,
                    tagID: archetypeTag.id,
                    contentSrc: data.archetypeContentSrc,
                    homebrewID: null,
                }).then(archetype => {
                    let archetypeFeatPromises = []; // Create Archetype Feats
                    if(data.archetypeFeatsArray != null){
                        for(const archetypeFeat of data.archetypeFeatsArray) {
                            if(!archetypeFeat.featTagsArray.includes(archetypeTag.id)){
                                archetypeFeat.featTagsArray.push(archetypeTag.id);
                            }
                            archetypeFeat.isDefault = 0;
                            archetypeFeat.skillID = null;
                            archetypeFeat.minProf = null;
                            archetypeFeat.genericType = null;
                            archetypeFeat.genTypeName = null;
                            archetypeFeat.isArchived = 0;
                            archetypeFeat.contentSrc = archetype.contentSrc;
                            archetypeFeat.version = null;
                            let newPromise = AdminUpdate.addFeatPreparedData(archetypeFeat);
                            archetypeFeatPromises.push(newPromise);
                        }
                    }
                    return Promise.all(archetypeFeatPromises)
                    .then(function(result) {
                        return archetype;
                    });
                });

            });
        });

    }

    static deleteArchetype(archetypeID){
        if(archetypeID == null) {return;}
        return Archetype.findOne({where: { id: archetypeID}})
        .then((archetype) => {
            return FeatTag.findAll({where: { tagID: archetype.tagID }})
            .then((featTags) => {
                let archetypeFeatsPromises = []; // Delete Archetype Feats
                for(const featTag of featTags) {
                    let newPromise = Feat.destroy({
                        where: { id: featTag.featID }
                    });
                    archetypeFeatsPromises.push(newPromise);
                }
                return Promise.all(archetypeFeatsPromises)
                .then(function(result) {
                    return Tag.destroy({ // Delete Tag (which will cascade to FeatTags)
                        where: { id: archetype.tagID }
                    }).then((result) => {
                        return Feat.destroy({ // Delete Dedication Feat
                            where: { id: archetype.dedicationFeatID }
                        }).then((result) => {
                            return Archetype.destroy({ // Finally, delete Archetype
                                where: { id: archetype.id }
                            }).then((result) => {
                                return;
                            });
                        });
                    });
                });
            });
        });
    }

    static archiveArchetype(archetypeID, isArchived){
        let archived = (isArchived) ? 1 : 0;
        let updateValues = { isArchived: archived };
        return Archetype.update(updateValues, { where: { id: archetypeID } })
        .then((result) => {
            return Archetype.findOne({where: { id: archetypeID }})
            .then((archetype) => {
                return Tag.update(updateValues, { where: { id: archetype.tagID } })
                .then((result) => {
                    return FeatTag.findAll({where: { tagID: archetype.tagID }})
                    .then((featTags) => {
                        let archetypeFeatsPromises = [];
                        for(const featTag of featTags) {
                            let newPromise = Feat.update(updateValues, {
                                where: { id: featTag.featID }
                            });
                            archetypeFeatsPromises.push(newPromise);
                        }
                        return Promise.all(archetypeFeatsPromises)
                        .then(function(result) {
                            return Feat.update(updateValues, {
                                where: { id: archetype.dedicationFeatID }
                            }).then((result) => {
                                return;
                            });
                        });
                    });
                });
            });
        });
    }



    static addAncestry(data) {
        /* Data:
            ancestryName,
            ancestryVersion,
            ancestryRarity,
            ancestryHitPoints,
            ancestrySize,
            ancestrySpeed,
            ancestryVisionSenseID,
            ancestryAdditionalSenseID,
            ancestryPhysicalFeatureOneID,
            ancestryPhysicalFeatureTwoID,
            ancestryDescription,
            ancestryBoostsArray,
            ancestryFlawsArray,
            ancestryLangsArray,
            ancestryBonusLangsArray,
            ancestryHeritagesArray,
            ancestryFeatsArray,
            ancestryTagDesc,
            ancestryContentSrc,
        */
        for(let d in data) { if(data[d] === ''){ data[d] = null; } }
        data.ancestryName = data.ancestryName.replace(/’/g,"'");
        if(data.ancestryDescription == null){ data.ancestryDescription = '__No Description__'; }
        if(data.ancestryVersion == null){ data.ancestryVersion = '1.0'; }
        let tagDesc = 'This indicates content from the '+data.ancestryName.toLowerCase()+' ancestry.';
        return Tag.create({ // Create Ancestry Tag
            name: data.ancestryName,
            description: tagDesc,
            isHidden: 1,
        }).then(ancestryTag => {
            return Ancestry.create({ // Create Ancestry
                name: data.ancestryName,
                version: data.ancestryVersion,
                rarity: data.ancestryRarity,
                hitPoints: data.ancestryHitPoints,
                size: data.ancestrySize,
                speed: data.ancestrySpeed,
                description: data.ancestryDescription,
                visionSenseID: data.ancestryVisionSenseID,
                additionalSenseID: data.ancestryAdditionalSenseID,
                physicalFeatureOneID: data.ancestryPhysicalFeatureOneID,
                physicalFeatureTwoID: data.ancestryPhysicalFeatureTwoID,
                tagID: ancestryTag.id,
                contentSrc: data.ancestryContentSrc,
                homebrewID: null,
            }).then(ancestry => {
                let ancestryBoostsPromises = []; // Create Ancestry Boosts
                if(data.ancestryBoostsArray != null){
                    for(const ancestryBoost of data.ancestryBoostsArray) {
                        let newPromise = AncestryBoost.create({
                            ancestryID: ancestry.id,
                            boostedAbility: ancestryBoost
                        });
                        ancestryBoostsPromises.push(newPromise);
                    }
                }
                return Promise.all(ancestryBoostsPromises)
                .then(function(result) {
                    let ancestryFlawsPromises = []; // Create Ancestry Flaws
                    if(data.ancestryFlawsArray != null){
                        for(const ancestryFlaw of data.ancestryFlawsArray) {
                            let newPromise = AncestryFlaw.create({
                                ancestryID: ancestry.id,
                                flawedAbility: ancestryFlaw
                            });
                            ancestryFlawsPromises.push(newPromise);
                        }
                    }
                    return Promise.all(ancestryFlawsPromises)
                    .then(function(result) {
                        let langsMap = new Map(); // Create Ancestry Languages
                        if(data.ancestryBonusLangsArray != null) {
                            for(const ancestryBonusLang of data.ancestryBonusLangsArray) {
                                langsMap.set(ancestryBonusLang, 1);
                            }
                        }
                        if(data.ancestryLangsArray != null){
                            for(const ancestryLang of data.ancestryLangsArray) {
                                langsMap.set(ancestryLang, 0);
                            }
                        }
                        let ancestryLangsPromises = [];
                        for(const [langID, isBonus] of langsMap.entries()){
                            let newPromise = AncestryLanguage.create({
                                ancestryID: ancestry.id,
                                langID,
                                isBonus
                            });
                            ancestryLangsPromises.push(newPromise);
                        }
                        return Promise.all(ancestryLangsPromises)
                        .then(function(result) {
                            let ancestryHeritagePromises = []; // Create Ancestry Heritages
                            if(data.ancestryHeritagesArray != null) {
                                for(const ancestryHeritage of data.ancestryHeritagesArray) {
                                    ancestryHeritage.name += ' '+data.ancestryName;
                                    ancestryHeritage.contentSrc = ancestry.contentSrc;
                                    ancestryHeritage.homebrewID = ancestry.homebrewID;
                                    let newPromise = AdminUpdate.addHeritage(ancestry.id, ancestryHeritage);
                                    ancestryHeritagePromises.push(newPromise);
                                }
                            }
                            return Promise.all(ancestryHeritagePromises)
                            .then(function(result) {
                                let ancestryFeatPromises = []; // Create Ancestry Feats
                                if(data.ancestryFeatsArray != null){
                                    for(const ancestryFeat of data.ancestryFeatsArray) {
                                        if(!ancestryFeat.featTagsArray.includes(ancestryTag.id)){
                                            ancestryFeat.featTagsArray.push(ancestryTag.id);
                                        }
                                        ancestryFeat.isDefault = 0;
                                        ancestryFeat.skillID = null;
                                        ancestryFeat.minProf = null;
                                        ancestryFeat.genericType = null;
                                        ancestryFeat.genTypeName = null;
                                        ancestryFeat.isArchived = 0;
                                        ancestryFeat.contentSrc = ancestry.contentSrc;
                                        ancestryFeat.version = null;
                                        let newPromise = AdminUpdate.addFeatPreparedData(ancestryFeat);
                                        ancestryFeatPromises.push(newPromise);
                                    }
                                }
                                return Promise.all(ancestryFeatPromises)
                                .then(function(result) {
                                    return ancestry;
                                });
                            });
                        });
                    });
                });
            });
        });

    }

    static deleteAncestry(ancestryID){
        if(ancestryID == null) {return;}
        return Ancestry.findOne({where: { id: ancestryID}})
        .then((ancestry) => {
            // Clear Ancestry Details for every Character that had this Ancestry
            return Character.findAll({where: { ancestryID: ancestry.id }})
            .then((charactersWithAncestry) => {
                let characterAncestryClearPromises = [];
                for(const charWithAnc of charactersWithAncestry) {
                    let newPromise = CharSaving.saveAncestry(charWithAnc.id, null);
                    characterAncestryClearPromises.push(newPromise);
                }
                return Promise.all(characterAncestryClearPromises)
                .then(function(result) {
                    return AncestryBoost.destroy({ // Delete Ancestry Boosts
                        where: { ancestryID: ancestry.id }
                    }).then((result) => {
                        return AncestryFlaw.destroy({ // Delete Ancestry Flaws
                            where: { ancestryID: ancestry.id }
                        }).then((result) => {
                            return AncestryLanguage.destroy({ // Delete Ancestry Languages
                                where: { ancestryID: ancestry.id }
                            }).then((result) => {
                                return Heritage.destroy({ // Delete Ancestry Heritages
                                    where: { ancestryID: ancestry.id }
                                }).then((result) => {
                                    return FeatTag.findAll({where: { tagID: ancestry.tagID }})
                                    .then((featTags) => {
                                        let ancestryFeatsPromises = []; // Delete Ancestry Feats
                                        for(const featTag of featTags) {
                                            let newPromise = Feat.destroy({
                                                where: {
                                                    id: featTag.featID,
                                                    genericType: null
                                                }
                                            });
                                            ancestryFeatsPromises.push(newPromise);
                                        }
                                        return Promise.all(ancestryFeatsPromises)
                                        .then(function(result) {
                                            return Tag.destroy({ // Delete Tag (which will cascade to FeatTags)
                                                where: { id: ancestry.tagID }
                                            }).then((result) => {
                                                return Ancestry.destroy({ // Finally, delete Ancestry
                                                    where: { id: ancestry.id }
                                                }).then((result) => {
                                                    return;
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

    static archiveAncestry(ancestryID, isArchived){
        let archived = (isArchived) ? 1 : 0;
        let updateValues = { isArchived: archived };
        return Ancestry.update(updateValues, { where: { id: ancestryID } })
        .then((result) => {
            return Ancestry.findOne({where: { id: ancestryID}})
            .then((ancestry) => {
                return Tag.update(updateValues, { where: { id: ancestry.tagID } })
                .then((result) => {
                    return FeatTag.findAll({where: { tagID: ancestry.tagID }})
                    .then((featTags) => {
                        let ancestryFeatsPromises = [];
                        for(const featTag of featTags) {
                            let newPromise = Feat.update(updateValues, {
                                where: {
                                    id: featTag.featID,
                                    genericType: null
                                }
                            });
                            ancestryFeatsPromises.push(newPromise);
                        }
                        return Promise.all(ancestryFeatsPromises)
                        .then(function(result) {
                            return;
                        });
                    });
                });
            });
        });
    }


    static addHeritage(ancestryID, data) {
        /* Data:
            name,
            description,
            code,
            contentSrc,
            homebrewID,
        */
        for(let d in data) { if(data[d] === ''){ data[d] = null; } }
        data.name = data.name.replace(/’/g,"'");
        if(data.description == null){ data.description = '__No Description__'; }
        return Heritage.create({
            name: data.name,
            ancestryID: ancestryID,
            description: data.description,
            code: data.code,
            contentSrc: data.contentSrc,
            homebrewID: data.homebrewID,
        }).then(heritage => {
            return heritage;
        });
    }


    static addUniHeritage(data) {
        /* Data:
            uniHeritageID,
            heritageName,
            heritageVersion,
            heritageDescription,
            heritageContentSrc,
            heritageCode,
            heritageFeatsArray,
        */
        for(let d in data) { if(data[d] === ''){ data[d] = null; } }
        data.heritageName = data.heritageName.replace(/’/g,"'");
        if(data.heritageDescription == null){ data.heritageDescription = '__No Description__'; }
        if(data.heritageVersion == null){ data.heritageVersion = '1.0'; }
        let tagDesc = 'This indicates content from the '+data.heritageName.toLowerCase()+' heritage.';
        return Tag.create({ // Create Heritage Tag
            name: data.heritageName,
            description: tagDesc,
            isHidden: 1,
        }).then(heritageTag => {
            return UniHeritage.create({ // Create Heritage
                name: data.heritageName,
                version: data.heritageVersion,
                description: data.heritageDescription,
                tagID: heritageTag.id,
                contentSrc: data.heritageContentSrc,
                code: data.heritageCode,
                homebrewID: null,
            }).then(uniHeritage => {
                let heritageFeatPromises = []; // Create Heritage Feats
                if(data.heritageFeatsArray != null){
                    for(const heritageFeat of data.heritageFeatsArray) {
                        if(!heritageFeat.featTagsArray.includes(heritageTag.id)){
                            heritageFeat.featTagsArray.push(heritageTag.id);
                        }
                        heritageFeat.isDefault = 0;
                        heritageFeat.skillID = null;
                        heritageFeat.minProf = null;
                        heritageFeat.genericType = null;
                        heritageFeat.genTypeName = null;
                        heritageFeat.isArchived = 0;
                        heritageFeat.contentSrc = uniHeritage.contentSrc;
                        heritageFeat.version = null;
                        let newPromise = AdminUpdate.addFeatPreparedData(heritageFeat);
                        heritageFeatPromises.push(newPromise);
                    }
                }
                return Promise.all(heritageFeatPromises)
                .then(function(result) {
                    return uniHeritage;
                });
            });
        });
    }

    static deleteUniHeritage(uniHeritageID){
        if(uniHeritageID == null) {return;}
        return UniHeritage.findOne({where: { id: uniHeritageID}})
        .then((uniHeritage) => {
            // Clear Heritage Details for every Character that had this Heritage
            return Character.findAll({where: { heritageID: uniHeritage.id }})
            .then((charactersWithHeritage) => {
                let characterHeritageClearPromises = [];
                for(const charWithHeritage of charactersWithHeritage) {
                    let newPromise = CharSaving.saveHeritage(charWithHeritage.id, null);
                    characterHeritageClearPromises.push(newPromise);
                }
                return Promise.all(characterHeritageClearPromises)
                .then(function(result) {
                    return FeatTag.findAll({where: { tagID: uniHeritage.tagID }})
                    .then((featTags) => {
                        let heritageFeatsPromises = []; // Delete Heritage Feats
                        for(const featTag of featTags) {
                            let newPromise = Feat.destroy({
                                where: { id: featTag.featID }
                            });
                            heritageFeatsPromises.push(newPromise);
                        }
                        return Promise.all(heritageFeatsPromises)
                        .then(function(result) {
                            return Tag.destroy({ // Delete Tag (which will cascade to FeatTags)
                                where: { id: uniHeritage.tagID }
                            }).then((result) => {
                                return UniHeritage.destroy({ // Finally, delete UniHeritage
                                    where: { id: uniHeritage.id }
                                }).then((result) => {
                                    return;
                                });
                            });
                        });
                    });
                });
            });
        });
    }

    static archiveUniHeritage(uniHeritageID, isArchived){
        let archived = (isArchived) ? 1 : 0;
        let updateValues = { isArchived: archived };
        return UniHeritage.update(updateValues, { where: { id: uniHeritageID } })
        .then((result) => {
            return UniHeritage.findOne({where: { id: uniHeritageID}})
            .then((uniHeritage) => {
                return Tag.update(updateValues, { where: { id: uniHeritage.tagID } })
                .then((result) => {
                    return FeatTag.findAll({where: { tagID: uniHeritage.tagID }})
                    .then((featTags) => {
                        let heritageFeatsPromises = [];
                        for(const featTag of featTags) {
                            let newPromise = Feat.update(updateValues, {
                                where: { id: featTag.featID }
                            });
                            heritageFeatsPromises.push(newPromise);
                        }
                        return Promise.all(heritageFeatsPromises)
                        .then(function(result) {
                            return;
                        });
                    });
                });
            });
        });
    }
    


    static addFeat(data){
        /* Data:
            builderType,
            featName,
            featLevel,
            featMinProf,
            featSkillID,
            featActions,
            featRarity,
            featTagsArray,
            featPrereq,
            featReq,
            featFreq,
            featCost,
            featTrigger,
            featDesc,
            featSpecial,
            featSelectMultiple,
            featCode,
            featVersion,
            featContentSrc,
            featGenTypeName,
        */
        data.isDefault = 0;
        data.isArchived = 0;
        data.genericType = data.builderType;
        const GENERAL_TAG_ID = 8; // Hardcoded General and Skill Tag IDs
        const SKILL_TAG_ID = 9;
        if(data.builderType == "GENERAL-FEAT"){
            if(!data.featTagsArray.includes(GENERAL_TAG_ID)){
                data.featTagsArray.push(GENERAL_TAG_ID);
            }
        } else if(data.builderType == "SKILL-FEAT"){
            if(!data.featTagsArray.includes(GENERAL_TAG_ID)){
                data.featTagsArray.push(GENERAL_TAG_ID);
            }
            if(!data.featTagsArray.includes(SKILL_TAG_ID)){
                data.featTagsArray.push(SKILL_TAG_ID);
            }
        } else if(data.builderType == "CLASS-FEAT"){
            //
        } else if(data.builderType == "ANCESTRY-FEAT"){
            //
        } else if(data.builderType == "BASIC-ACTION"){
            data.isDefault = 1;
        } else if(data.builderType == "SKILL-ACTION"){
            data.isDefault = 1;
        } else if(data.builderType == "SKILL-ACTION"){
            data.isDefault = 1;
        } else {
            console.error("Invalid BuilderType for Feat Creation: '"+data.builderType+"'!");
            return;
        }
        return AdminUpdate.addFeatPreparedData({
            name: data.featName,
            actions: data.featActions,
            level: data.featLevel,
            rarity: data.featRarity,
            prerequisites: data.featPrereq,
            cost: data.featCost,
            frequency: data.featFreq,
            trigger: data.featTrigger,
            requirements: data.featReq,
            description: data.featDesc,
            special: data.featSpecial,
            canSelectMultiple: data.featSelectMultiple,
            isDefault: data.isDefault,
            skillID: data.featSkillID,
            minProf: data.featMinProf,
            code: data.featCode,
            featTagsArray: data.featTagsArray,
            genericType: data.genericType,
            genTypeName: data.featGenTypeName,
            isArchived: data.isArchived,
            contentSrc: data.featContentSrc,
            version: data.featVersion
        }).then(feat => {
            return feat;
        });
    }

    static addFeatPreparedData(data) {
        /* Data:
            name,
            actions,
            level,
            rarity,
            prerequisites,
            cost,
            frequency,
            trigger,
            requirements,
            description,
            special,
            canSelectMultiple,
            isDefault,
            skillID,
            minProf,
            code,
            featTagsArray,
            genericType,
            genTypeName,
            isArchived,
            contentSrc
            version
        */
        for(let d in data) { if(data[d] === ''){ data[d] = null; } }
        if(data.name == null) { return Promise.resolve(); }
        data.name = data.name.replace(/’/g,"'");
        if(data.description == null){ data.description = '__No Description__'; }
        if(data.version == null){ data.version = '1.0'; }
        if(data.level == null){ data.level = -1; }
        return Feat.create({
            name: data.name,
            actions: data.actions,
            level: data.level,
            rarity: data.rarity,
            prerequisites: data.prerequisites,
            cost: data.cost,
            frequency: data.frequency,
            trigger: data.trigger,
            requirements: data.requirements,
            description: data.description,
            special: data.special,
            canSelectMultiple: data.canSelectMultiple,
            isDefault: data.isDefault,
            skillID: data.skillID,
            minProf: data.minProf,
            code: data.code,
            genericType: data.genericType,
            genTypeName: data.genTypeName,
            isArchived: data.isArchived,
            contentSrc: data.contentSrc,
            homebrewID: null,
            version: data.version,
        }).then(feat => {
            let featTagPromises = []; // Create Feat Tags
            if(data.featTagsArray != null) {
                for(const featTag of data.featTagsArray) {
                    let newPromise = FeatTag.create({
                        featID: feat.id,
                        tagID: featTag
                    });
                    featTagPromises.push(newPromise);
                }
            }
            return Promise.all(featTagPromises)
            .then(function(result) {
                return feat;
            });
        });
    }

    static deleteFeat(featID) {
        return Feat.destroy({ // Delete Feat (which will cascade to FeatTags)
            where: { id: featID }
        }).then((result) => {
            return;
        });
    }

    static archiveFeat(featID, isArchived){
        let archived = (isArchived) ? 1 : 0;
        let updateValues = { isArchived: archived };
        return Feat.update(updateValues, { where: { id: featID } })
        .then((result) => {
            return;
        });
    }


    static addItem(data){
        /* Data:
            itemID,
            builderType,
            data.itemCopyOfOther,
            itemName,
            itemVersion,
            itemPrice,
            itemLevel,
            itemCategory,
            itemRarity,
            itemTagsArray,
            itemUsage,
            itemDesc,
            itemCraftReq,
            itemCode,
            itemBulk,
            itemSize,
            itemMaterial,
            itemHands,
            itemIsShoddy,
            itemHasQuantity,
            itemQuantity,
            itemHitPoints,
            itemBrokenThreshold,
            itemHardness,
            itemWeaponData,
            itemArmorData,
            itemShieldData,
            itemStorageData,
            itemRuneData,
            itemContentSrc
        */

        data.hidden = 0;
        data.isArchived = 0;
        data.itemProfName = null;
        if(data.builderType == "GENERAL"){
            //
        } else if(data.builderType == "STORAGE"){
            data.itemHasQuantity = 0;
            data.itemQuantity = 1;
        } else if(data.builderType == "WEAPON"){
            
            if(data.itemCopyOfOther != null && data.itemCopyOfOther.WeaponData != null){
                // Set Prof Name
                data.itemProfName = data.itemCopyOfOther.WeaponData.profName;

                // Fill in all weapon data
                data.itemWeaponData = {};
                data.itemWeaponData.dieType = data.itemCopyOfOther.WeaponData.dieType;
                data.itemWeaponData.damageType = data.itemCopyOfOther.WeaponData.damageType;
                data.itemWeaponData.weaponCategory = data.itemCopyOfOther.WeaponData.category;
                data.itemWeaponData.isMelee = data.itemCopyOfOther.WeaponData.isMelee;
                data.itemWeaponData.meleeWeaponType = data.itemCopyOfOther.WeaponData.meleeWeaponType;
                data.itemWeaponData.isRanged = data.itemCopyOfOther.WeaponData.isRanged;
                data.itemWeaponData.rangedWeaponType = data.itemCopyOfOther.WeaponData.rangedWeaponType;
                data.itemWeaponData.range = data.itemCopyOfOther.WeaponData.rangedRange;
                data.itemWeaponData.reload = data.itemCopyOfOther.WeaponData.rangedReload;

                // Add traits from copy
                for(let otherCopyTag of data.itemCopyOfOther.TagArray){
                    if(otherCopyTag != null){
                        data.itemTagsArray.push(otherCopyTag.Tag.id);
                    }
                }

                // Set hardness, hitpoints, & broken threshold
                if(data.itemCopyOfOther.Item != null){
                    data.itemHitPoints = data.itemCopyOfOther.Item.hitPoints;
                    data.itemBrokenThreshold = data.itemCopyOfOther.Item.brokenThreshold;
                    data.itemHardness = data.itemCopyOfOther.Item.hardness;
                } else {
                    data.itemHitPoints = 0;
                    data.itemBrokenThreshold = 0;
                    data.itemHardness = 0;
                }
            }

            // Hardcoded Alchemical and Bomb ID
            if(data.itemWeaponData != null && data.itemTagsArray.includes('399') && data.itemTagsArray.includes('401')) {
                data.itemProfName = 'Alchemical Bombs';
            }

        } else if(data.builderType == "ARMOR"){
            data.itemHasQuantity = 0;
            data.itemQuantity = 1;
            data.itemHands = 'NONE';

            if(data.itemCopyOfOther != null && data.itemCopyOfOther.ArmorData != null){
                // Set Prof Name
                data.itemProfName = data.itemCopyOfOther.ArmorData.profName;

                // Fill in all armor data
                data.itemArmorData = {};
                data.itemArmorData.acBonus = data.itemCopyOfOther.ArmorData.acBonus;
                data.itemArmorData.dexCap = data.itemCopyOfOther.ArmorData.dexCap;
                data.itemArmorData.checkPenalty = data.itemCopyOfOther.ArmorData.checkPenalty;
                data.itemArmorData.speedPenalty = data.itemCopyOfOther.ArmorData.speedPenalty;
                data.itemArmorData.minStrength = data.itemCopyOfOther.ArmorData.minStrength;
                data.itemArmorData.type = data.itemCopyOfOther.ArmorData.armorType;
                data.itemArmorData.category = data.itemCopyOfOther.ArmorData.category;

                // Add traits from copy
                for(let otherCopyTag of data.itemCopyOfOther.TagArray){
                    if(otherCopyTag != null){
                        data.itemTagsArray.push(otherCopyTag.Tag.id);
                    }
                }

                // Set hardness, hitpoints, & broken threshold
                if(data.itemCopyOfOther.Item != null){
                    data.itemHitPoints = data.itemCopyOfOther.Item.hitPoints;
                    data.itemBrokenThreshold = data.itemCopyOfOther.Item.brokenThreshold;
                    data.itemHardness = data.itemCopyOfOther.Item.hardness;
                } else {
                    data.itemHitPoints = 0;
                    data.itemBrokenThreshold = 0;
                    data.itemHardness = 0;
                }
            }
        } else if(data.builderType == "SHIELD"){
            data.itemHasQuantity = 0;
            data.itemQuantity = 1;
            data.itemHands = 'NONE';

            if(data.itemCopyOfOther != null && data.itemCopyOfOther.ShieldData != null){
                // Set Prof Name
                data.itemProfName = data.itemCopyOfOther.ShieldData.profName;

                // Fill in all shield data
                data.itemShieldData = {};
                data.itemShieldData.acBonus = data.itemCopyOfOther.ShieldData.acBonus;
                data.itemShieldData.speedPenalty = data.itemCopyOfOther.ShieldData.speedPenalty;

                // Add traits from copy
                for(let otherCopyTag of data.itemCopyOfOther.TagArray){
                    if(otherCopyTag != null){
                        data.itemTagsArray.push(otherCopyTag.Tag.id);
                    }
                }
                
            }
        } else if(data.builderType == "RUNE"){
            data.itemName += ' Runestone';
            data.itemPrice = parseInt(data.itemPrice)+300; // 3gp for the cost of the runestone
            data.itemBulk = 0.1;
            data.itemSize = 'MEDIUM';
            data.itemMaterial = '';
            data.itemHands = 'ONE';
            data.itemIsShoddy = 0;
            data.itemHasQuantity = 0;
            data.itemQuantity = 1;
            data.itemHitPoints = 16;
            data.itemBrokenThreshold = 8;
            data.itemHardness = 4;
        } else {
            console.error("Invalid BuilderType for Item Creation: '"+data.builderType+"'!");
            return;
        }

        for(let d in data) { if(data[d] === ''){ data[d] = null; } }
        data.itemName = data.itemName.replace(/’/g,"'");
        if(data.itemDesc == null){ data.itemDesc = '__No Description__'; }
        if(data.itemVersion == null){ data.itemVersion = '1.0'; }
        if(data.itemProfName == null){ data.itemProfName = data.itemName; }
        return Item.create({ // Create Item
            name: data.itemName,
            version: data.itemVersion,
            price: data.itemPrice,
            bulk: data.itemBulk,
            level: data.itemLevel,
            rarity: data.itemRarity,
            description: data.itemDesc,
            itemType: data.itemCategory,
            hands: data.itemHands,
            materialType: data.itemMaterial,
            size: data.itemSize,
            craftRequirements: data.itemCraftReq,
            usage: data.itemUsage,
            isShoddy: data.itemIsShoddy,
            hasQuantity: data.itemHasQuantity,
            quantity: data.itemQuantity,
            hitPoints: data.itemHitPoints,
            brokenThreshold: data.itemBrokenThreshold,
            hardness: data.itemHardness,
            hidden: data.hidden,
            code: data.itemCode,
            itemStructType: data.builderType,
            isArchived: data.isArchived,
            contentSrc: data.itemContentSrc,
            homebrewID: null,
        }).then(item => {
            let itemTagsPromises = []; // Create Item Tags
            if(data.itemTagsArray != null){
                for(const tagID of data.itemTagsArray) {
                    let newPromise = TaggedItem.create({
                        itemID: item.id,
                        tagID: tagID
                    });
                    itemTagsPromises.push(newPromise);
                }
            }
            return Promise.all(itemTagsPromises)
            .then(function(result) {
                if(data.builderType == "STORAGE"){
                    if(data.itemStorageData != null){
                        return Storage.create({
                            itemID: item.id,
                            maxBulkStorage: data.itemStorageData.maxBulkStorage,
                            bulkIgnored: data.itemStorageData.bulkIgnored,
                            ignoreSelfBulkIfWearing: data.itemStorageData.ignoreSelfBulkIfWearing
                        }).then(storage => {
                            return item;
                        });
                    } else {
                        return item;
                    }
                } else if(data.builderType == "WEAPON"){
                    if(data.itemWeaponData != null){
                        return Weapon.create({
                            itemID: item.id,
                            profName: data.itemProfName,
                            diceNum: 1,
                            dieType: data.itemWeaponData.dieType,
                            damageType: data.itemWeaponData.damageType,
                            category: data.itemWeaponData.weaponCategory,
                            isMelee: data.itemWeaponData.isMelee,
                            meleeWeaponType: data.itemWeaponData.meleeWeaponType,
                            isRanged: data.itemWeaponData.isRanged,
                            rangedWeaponType: data.itemWeaponData.rangedWeaponType,
                            rangedRange: data.itemWeaponData.range,
                            rangedReload: data.itemWeaponData.reload
                        }).then(weapon => {
                            return item;
                        });
                    } else {
                        return item;
                    }
                } else if(data.builderType == "ARMOR"){
                    if(data.itemArmorData != null){
                        let cPenalty = becomeNegative(data.itemArmorData.checkPenalty);
                        let sPenalty = becomeNegative(data.itemArmorData.speedPenalty);
                        return Armor.create({
                            itemID: item.id,
                            profName: data.itemProfName,
                            acBonus: data.itemArmorData.acBonus,
                            dexCap: data.itemArmorData.dexCap,
                            checkPenalty: cPenalty,
                            speedPenalty: sPenalty,
                            minStrength: data.itemArmorData.minStrength,
                            armorType: data.itemArmorData.type,
                            category: data.itemArmorData.category
                        }).then(armor => {
                            return item;
                        });
                    } else {
                        return item;
                    }
                } else if(data.builderType == "SHIELD"){
                    if(data.itemShieldData != null){
                        let sPenalty = becomeNegative(data.itemShieldData.speedPenalty);
                        return Shield.create({
                            itemID: item.id,
                            profName: data.itemProfName,
                            acBonus: data.itemShieldData.acBonus,
                            speedPenalty: sPenalty
                        }).then(shield => {
                            return item;
                        });
                    } else {
                        return item;
                    }
                } else if(data.builderType == "RUNE"){
                    if(data.itemRuneData != null){
                        let fundamental = (data.itemRuneData.runeType === 'FUNDAMENTAL') ? 1 : 0;
                        return ItemRune.create({
                            itemID: item.id,
                            isFundamental: fundamental,
                            etchedType: data.itemRuneData.etchedType
                        }).then(rune => {
                            return item;
                        });
                    } else {
                        return item;
                    }
                } else {
                    return item;
                }
            });
        });
    }

    static deleteItem(itemID) {
        return Item.destroy({ // Delete Item (which will cascade into cleaning up (deleting) everything else)
            where: { id: itemID }
        }).then((result) => {
            return;
        });
    }

    static archiveItem(itemID, isArchived){
        let archived = (isArchived) ? 1 : 0;
        let updateValues = { isArchived: archived };
        return Item.update(updateValues, { where: { id: itemID } })
        .then((result) => {
            return;
        });
    }



    static addSpell(data){
        /* Data:
            spellID,
            spellName,
            spellVersion,
            spellIsFocus,
            spellLevel,
            spellRarity,
            spellTraditions,
            spellCasting,
            spellComponents,
            spellCost,
            spellTrigger,
            spellRequirements,
            spellTagsArray,
            spellRange,
            spellArea,
            spellTargets,
            spellSavingThrow,
            spellDuration,
            spellDesc,
            spellHeightenedOneVal,
            spellHeightenedOneText,
            spellHeightenedTwoVal,
            spellHeightenedTwoText,
            spellHeightenedThreeVal,
            spellHeightenedThreeText,
            spellHeightenedFourVal,
            spellHeightenedFourText,
            spellContentSrc,
        */

        data.isArchived = 0;

        for(let d in data) { if(data[d] === ''){ data[d] = null; } }
        data.spellName = data.spellName.replace(/’/g,"'");
        if(data.spellDesc == null){ data.spellDesc = '__No Description__'; }
        if(data.spellVersion == null){ data.spellVersion = '1.0'; }
        return Spell.create({ // Create Spell
            name: data.spellName,
            version: data.spellVersion,
            level: data.spellLevel,
            rarity: data.spellRarity,
            description: data.spellDesc,
            traditions: JSON.stringify(data.spellTraditions),
            cast: data.spellCasting,
            castingComponents: JSON.stringify(data.spellComponents),
            cost: data.spellCost,
            trigger: data.spellTrigger,
            requirements: data.spellRequirements,
            range: data.spellRange,
            area: data.spellArea,
            targets: data.spellTargets,
            savingThrow: data.spellSavingThrow,
            duration: data.spellDuration,
            heightenedOneVal: data.spellHeightenedOneVal,
            heightenedOneText: data.spellHeightenedOneText,
            heightenedTwoVal: data.spellHeightenedTwoVal,
            heightenedTwoText: data.spellHeightenedTwoText,
            heightenedThreeVal: data.spellHeightenedThreeVal,
            heightenedThreeText: data.spellHeightenedThreeText,
            heightenedFourVal: data.spellHeightenedFourVal,
            heightenedFourText: data.spellHeightenedFourText,
            isFocusSpell: data.spellIsFocus,
            isArchived: data.isArchived,
            contentSrc: data.spellContentSrc,
            homebrewID: null,
        }).then(spell => {
            let spellTagsPromises = []; // Create Spell Tags
            if(data.spellTagsArray != null){
                if(spell.level == 0) {
                    let cantripTagID = 123; // Hardcoded Cantrip tag ID
                    if(!data.spellTagsArray.includes(cantripTagID)){
                        data.spellTagsArray.push(cantripTagID);
                    }
                }
                for(const tagID of data.spellTagsArray) {
                    let newPromise = TaggedSpell.create({
                        spellID: spell.id,
                        tagID: tagID
                    });
                    spellTagsPromises.push(newPromise);
                }
            }
            return Promise.all(spellTagsPromises)
            .then(function(result) {
                return spell;
            });
        });
    }

    static deleteSpell(spellID) {
        return Spell.destroy({ // Delete Spell (which will cascade into cleaning up (deleting) everything else)
            where: { id: spellID }
        }).then((result) => {
            return;
        });
    }

    static archiveSpell(spellID, isArchived){
        let archived = (isArchived) ? 1 : 0;
        let updateValues = { isArchived: archived };
        return Spell.update(updateValues, { where: { id: spellID } })
        .then((result) => {
            return;
        });
    }

};