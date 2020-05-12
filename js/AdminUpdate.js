
const Character = require('../models/contentDB/Character');
const Ancestry = require('../models/contentDB/Ancestry');
const AncestryBoost = require('../models/contentDB/AncestryBoost');
const AncestryFlaw = require('../models/contentDB/AncestryFlaw');
const AncestryLanguage = require('../models/contentDB/AncestryLanguage');
const Tag = require('../models/contentDB/Tag');
const Heritage = require('../models/contentDB/Heritage');
const Feat = require('../models/contentDB/Feat');
const FeatTag = require('../models/contentDB/FeatTag');

const CharSaving = require('./CharSaving');

module.exports = class AdminUpdate {

    static addAncestry(data) {
        /* Data:
            ancestryName,
            ancestryVersion,
            ancestryHitPoints,
            ancestrySize,
            ancestrySpeed,
            ancestryVisionSenseID,
            ancestryAdditionalSenseID,
            ancestryDescription,
            ancestryBoostsArray,
            ancestryFlawsArray,
            ancestryLangsArray,
            ancestryBonusLangsArray,
            ancestryHeritagesArray,
            ancestryFeatsArray,
            ancestryTagDesc
        */
        for(let d in data) { if(data[d] === ''){ data[d] = null; } }
        if(data.ancestryDescription == null){ data.ancestryDescription = 'No Description'; }
        if(data.ancestryTagDesc == null){ data.ancestryTagDesc = 'No Description'; }
        return Tag.create({ // Create Ancestry Tag
            name: data.ancestryName,
            description: data.ancestryTagDesc
        }).then(ancestryTag => {
            return Ancestry.create({ // Create Ancestry
                name: data.ancestryName,
                version: data.ancestryVersion,
                hitPoints: data.ancestryHitPoints,
                size: data.ancestrySize,
                speed: data.ancestrySpeed,
                description: data.ancestryDescription,
                visionSenseID: data.ancestryVisionSenseID,
                additionalSenseID: data.ancestryAdditionalSenseID,
                tagID: ancestryTag.id
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
                                        ancestryFeat.isArchived = 0;
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
                                                where: { id: featTag.featID }
                                            });
                                            ancestryFeatsPromises.push(newPromise);
                                        }
                                        return Promise.all(ancestryFeatsPromises)
                                        .then(function(result) {
                                            return Tag.destroy({ // Delete Tag (which will cascade to FeatTags)
                                                where: { name: ancestry.tagID }
                                            }).then((result) => {
                                                return Ancestry.destroy({ // Finally, delete Ancestry
                                                    where: { id: ancestry.id }
                                                }).then((result) => {
                                                    return true;
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
            return;
        });
    }


    static addHeritage(ancestryID, data) {
        /* Data:
            name,
            description,
            code
        */
        for(let d in data) { if(data[d] === ''){ data[d] = null; } }
        if(data.description == null){ data.description = 'No Description'; }
        return Heritage.create({
            name: data.name,
            ancestryID: ancestryID,
            description: data.description,
            code: data.code
        }).then(heritage => {
            return heritage;
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
            featTrigger,
            featDesc,
            featSpecial,
            featSelectMultiple,
            featCode,
            featVersion
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
        } else if(data.builderType == "BASIC-ACTION"){
            data.isDefault = 1;
        } else if(data.builderType == "SKILL-ACTION"){
            data.isDefault = 1;
        }
        return AdminUpdate.addFeatPreparedData({
            name: data.featName,
            actions: data.featActions,
            level: data.featLevel,
            rarity: data.featRarity,
            prerequisites: data.featPrereq,
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
            isArchived: data.isArchived,
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
            isArchived,
            version
        */
        for(let d in data) { if(data[d] === ''){ data[d] = null; } }
        if(data.description == null){ data.description = 'No Description'; }
        if(data.level == null){ data.level = -1; }
        return Feat.create({
            name: data.name,
            actions: data.actions,
            level: data.level,
            rarity: data.rarity,
            prerequisites: data.prerequisites,
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
            isArchived: data.isArchived,
            version: data.version
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

};