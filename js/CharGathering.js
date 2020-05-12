
const Character = require('../models/contentDB/Character');
const Class = require('../models/contentDB/Class');
const ClassAbility = require('../models/contentDB/ClassAbility');
const Feat = require('../models/contentDB/Feat');
const FeatTag = require('../models/contentDB/FeatTag');
const Tag = require('../models/contentDB/Tag');
const Skill = require('../models/contentDB/Skill');
const Background = require('../models/contentDB/Background');
const Inventory = require('../models/contentDB/Inventory');
const Language = require('../models/contentDB/Language');
const Ancestry = require('../models/contentDB/Ancestry');
const Heritage = require('../models/contentDB/Heritage');
const AncestryLanguage = require('../models/contentDB/AncestryLanguage');
const AncestryBoost = require('../models/contentDB/AncestryBoost');
const AncestryFlaw = require('../models/contentDB/AncestryFlaw');
const SenseType = require('../models/contentDB/SenseType');
const Condition = require('../models/contentDB/Condition');
const CharCondition = require('../models/contentDB/CharCondition');
const Item = require('../models/contentDB/Item');
const InvItem = require('../models/contentDB/InvItem');
const InvItemRune = require('../models/contentDB/InvItemRune');
const Weapon = require('../models/contentDB/Weapon');
const DamageType = require('../models/contentDB/DamageType');
const TaggedItem = require('../models/contentDB/TaggedItem');
const Armor = require('../models/contentDB/Armor');
const Storage = require('../models/contentDB/Storage');
const Shield = require('../models/contentDB/Shield');
const ItemRune = require('../models/contentDB/ItemRune');

const CharDataStoring = require('./CharDataStoring');

function mapToObj(strMap) {
    let obj = Object.create(null);
    for (let [k,v] of strMap) {
      // We don’t escape the key '__proto__'
      // which can cause problems on older engines
      obj[k] = v;
    }
    return obj;
}

function objToMap(obj) {
    let strMap = new Map();
    for (let k of Object.keys(obj)) {
      strMap.set(k, obj[k]);
    }
    return strMap;
}

function getUpAmt(profType){
    if(profType == "Up"){
        return 1;
    }
    if(profType == "Down"){
        return -1;
    }
    return 0;
}

function getBonus(profBonus){
    let numBonus = parseInt(profBonus);
    return (isNaN(numBonus) ? 0 : numBonus);
}

function profTypeToNumber(profType){
    switch(profType){
        case 'U': return 0;
        case 'T': return 1;
        case 'E': return 2;
        case 'M': return 3;
        case 'L': return 4;
        default: return -1; 
    }
}

function getBetterProf(prof1, prof2){
    let profNumber1 = profTypeToNumber(prof1);
    let profNumber2 = profTypeToNumber(prof2);
    return (profNumber1 > profNumber2) ? prof1 : prof2;
}

function findItemDataByName(itemMap, itemName){
    for(const [itemID, itemData] of itemMap.entries()){
        if(itemData.Item.name.toLowerCase() == itemName){
            return itemData;
        }
    }
    return null;
}

module.exports = class CharGathering {

    static getAllClasses() {
        return Class.findAll()
        .then((classes) => {
            return ClassAbility.findAll()
            .then((allClassAbilities) => {
                
                let classMap = new Map();

                for (const cClass of classes) {
                    classMap.set(cClass.id, {Class : cClass, Abilities : []}); 
                }

                for (const classAbil of allClassAbilities) {
                    let classID = classAbil.classID;

                    let classStruct = classMap.get(classID);
                    classStruct.Abilities.push(classAbil);

                }

                return mapToObj(classMap);

            });
        });
    }


    static getAllFeats() {
        return Feat.findAll()
        .then((feats) => {
            return FeatTag.findAll()
            .then((featTags) => {
                return Tag.findAll()
                .then((tags) => {
    
                    let featMap = new Map();

                    for (const feat of feats) {
                        featMap.set(feat.id, {Feat : feat, Tags : []});
                    }

                    for (const featTag of featTags) {

                        let tag = tags.find(tag => {
                            return tag.id === featTag.tagID;
                        });

                        let featStruct = featMap.get(featTag.featID);
                        featStruct.Tags.push(tag);

                    }

                    return mapToObj(featMap);
    
                });
            });
        });
    }

    static getAllItems(){
        return Item.findAll()
        .then((items) => {
            return Tag.findAll()
            .then((tags) => {
                return TaggedItem.findAll()
                .then((taggedItems) => {
                    return Weapon.findAll()
                    .then((weapons) => {
                        return Armor.findAll()
                        .then((armors) => {
                            return Storage.findAll()
                            .then((storages) => {
                                return Shield.findAll()
                                .then((shields) => {
                                    return ItemRune.findAll()
                                    .then((runes) => {
                                                
                                        let itemMap = new Map();

                                        for(const item of items){

                                            let tagArray = [];
                                            for(const taggedItem of taggedItems){
                                                if(taggedItem.itemID == item.id) {

                                                    let tag = tags.find(tag => {
                                                        return tag.id == taggedItem.tagID;
                                                    });
            
                                                    tagArray.push({
                                                        Tag : tag,
                                                        TagDetails : taggedItem.tagDetails
                                                    });

                                                }
                                            }

                                            let weapon = weapons.find(weapon => {
                                                return weapon.itemID == item.id;
                                            });

                                            let armor = armors.find(armor => {
                                                return armor.itemID == item.id;
                                            });

                                            let storage = storages.find(storage => {
                                                return storage.itemID == item.id;
                                            });

                                            let shield = shields.find(shield => {
                                                return shield.itemID == item.id;
                                            });

                                            let rune = runes.find(rune => {
                                                return rune.itemID == item.id;
                                            });

                                            itemMap.set(item.id, {
                                                Item : item,
                                                WeaponData : weapon,
                                                ArmorData : armor,
                                                StorageData : storage,
                                                ShieldData : shield,
                                                RuneData : rune,
                                                TagArray : tagArray
                                            });

                                        }

                                        return itemMap;
                                    });
                                });
                            });
                        });
                    });
                });
            });
        });
    }

    static getInvIDFromInvItemID(invItemID){
        return InvItem.findOne({ where: { id: invItemID } })
        .then((invItem) => {
            return invItem.invID;
        });
    }

    static getInventory(inventoryID){
        return Inventory.findOne({ where: { id: inventoryID} })
        .then((inventory) => {
            return InvItem.findAll({
                where: { invID: inventory.id},
                order: [['name', 'ASC'],]
            }).then((invItems) => {
                return InvItemRune.findAll()
                .then((invItemRunes) => {

                    for(let invItem of invItems){
                        let invItemRune = invItemRunes.find(invItemRune => {
                            return invItemRune.invItemID == invItem.id;
                        });
                        if(invItemRune != null){
                            invItem.itemRuneData = {
                                id : invItemRune.id,
                                invItemID : invItemRune.invItemID,
                                fundRuneID : invItemRune.fundRuneID,
                                fundPotencyRuneID : invItemRune.fundPotencyRuneID,
                                propRune1ID : invItemRune.propRune1ID,
                                propRune2ID : invItemRune.propRune2ID,
                                propRune3ID : invItemRune.propRune3ID,
                                propRune4ID : invItemRune.propRune4ID
                            };
                        } else {
                            invItem.itemRuneData = null;
                        }
                    }

                    return {
                        Inventory : inventory,
                        InvItems : invItems
                    };
                });

            });
        });
    }

    static getAllSkills(charID) {
        return Skill.findAll()
        .then((skills) => {
            return CharDataStoring.getProficiencies(charID, "GET_ALL")
            .then((proficiencyMap) => {
                return CharDataStoring.getBasicData(charID, "GET_ALL", 'dataLoreCategories', null)
                .then((loreObject) => {
                    let loreMap = objToMap(loreObject);
                    
                    let skillArray = [];

                    for(const skill of skills){
                        if(skill.name != "Lore"){
                            skillArray.push({ SkillName : skill.name, Skill : skill });
                        }
                    }

                    let loreSkill = skills.find(skill => {
                        return skill.name === "Lore";
                    });

                    for(const [dataSrc, dataValArray] of loreMap.entries()){
                        for(const dataVal of dataValArray){
                            skillArray.push({ SkillName : dataVal+" Lore", Skill : loreSkill });
                        }
                    }

                    let skillMap = new Map();

                    let tempCount = 0;
                    for(const skillData of skillArray){
                        let bestProf = 'U';
                        let numUps = 0;
                        let totalBonus = 0;
                        for(const [dataSrc, dataValArray] of proficiencyMap.entries()){
                            for(const dataVal of dataValArray){
                                tempCount++;

                                if(dataVal.For == "Skill"){
                                    dataVal.To = dataVal.To.replace(/_/g," ");
                                    if(dataVal.To == skillData.SkillName) {
                                        numUps += getUpAmt(dataVal.Prof);
                                        totalBonus += getBonus(dataVal.Prof);
                                        bestProf = getBetterProf(bestProf, dataVal.Prof);
                                    }
                                }

                            }
                        }

                        skillMap.set(skillData.SkillName, {
                            NumUps : profTypeToNumber(bestProf)+numUps,
                            Bonus : totalBonus,
                            Skill : skillData.Skill
                        });
                    }

                    console.log("Did "+tempCount+" comparisons.");
                    console.log(skillMap);

                    return mapToObj(skillMap);

                });
            });
        });
    }

    static getAllAncestries(includeTag) {
        return Ancestry.findAll()
        .then((ancestries) => {
            return Heritage.findAll()
            .then((heritages) => {
                return Language.findAll()
                .then((languages) => {
                    return AncestryLanguage.findAll()
                    .then((ancestLangs) => {
                        return AncestryBoost.findAll()
                        .then((ancestBoosts) => {
                            return AncestryFlaw.findAll()
                            .then((ancestFlaws) => {
                                return Tag.findAll()
                                .then((tags) => {
                                    return SenseType.findAll()
                                    .then((senseTypes) => {

                                        let ancestryMap = new Map();

                                        for (const ancestry of ancestries) {
                                            let tag = null;
                                            if(includeTag){
                                                tag = tags.find(tag => {
                                                    return tag.id === ancestry.tagID;
                                                });
                                            }
                                            let visionSense, additionalSense = null;
                                            for(let senseType of senseTypes){
                                                if(senseType.id === ancestry.visionSenseID){
                                                    visionSense = senseType;
                                                }
                                                if(senseType.id === ancestry.additionalSenseID){
                                                    additionalSense = senseType;
                                                }
                                            }
                                            ancestryMap.set(ancestry.id, {Ancestry : ancestry, Heritages : [],
                                                Languages : [], BonusLanguages : [], Boosts : [], Flaws : [],
                                                Tag : tag, VisionSense : visionSense, AdditionalSense : additionalSense});
                                        }

                                        for (const heritage of heritages) {

                                            let ancestryStruct = ancestryMap.get(heritage.ancestryID);
                                            ancestryStruct.Heritages.push(heritage);

                                        }

                                        for (const ancestLang of ancestLangs) {

                                            if(ancestLang.isBonus === 1) {

                                                let language = languages.find(language => {
                                                    return language.id === ancestLang.langID;
                                                });
                        
                                                let ancestryStruct = ancestryMap.get(ancestLang.ancestryID);
                                                ancestryStruct.BonusLanguages.push(language);

                                            } else {

                                                let language = languages.find(language => {
                                                    return language.id === ancestLang.langID;
                                                });
                        
                                                let ancestryStruct = ancestryMap.get(ancestLang.ancestryID);
                                                ancestryStruct.Languages.push(language);

                                            }

                                        }

                                        for (const ancestBoost of ancestBoosts) {

                                            let ancestryStruct = ancestryMap.get(ancestBoost.ancestryID);
                                            ancestryStruct.Boosts.push(ancestBoost.boostedAbility);

                                        }

                                        for (const ancestFlaw of ancestFlaws) {

                                            let ancestryStruct = ancestryMap.get(ancestFlaw.ancestryID);
                                            ancestryStruct.Flaws.push(ancestFlaw.flawedAbility);

                                        }

                                        return mapToObj(ancestryMap);

                                    });
                                });
                            });
                        });
                    });
                });
            });
        });
    }

    static getAllLanguages(charID) {
        return Character.findOne({ where: { id: charID} })
        .then((character) => {
            return AncestryLanguage.findAll({ where: { ancestryID: character.ancestryID} })
            .then((ancestLangs) => {
                return Language.findAll()
                .then((languages) => {

                    let langMap = new Map();

                    for(const lang of languages){
                        let isBonus = ancestLangs.find(ancestLang => {
                            if(ancestLang.langID === lang.id) {
                                return ancestLang.isBonus == 1;
                            }
                        });

                        langMap.set(lang.id, {Lang : lang, IsBonus : isBonus});
                    }

                    return mapToObj(langMap);

                });
            });
        });
    }

    static getAllConditions(charID) {
        return Condition.findAll()
        .then((conditions) => {
            return CharCondition.findAll({ where: { charID: charID} })
            .then((charConditions) => {

                let conditionMap = new Map();

                for(const charCondition of charConditions){
                    let condition = conditions.find(condition => {
                        return charCondition.conditionID === condition.id;
                    });
                    conditionMap.set(charCondition.conditionID, {
                        Condition : condition,
                        Value : charCondition.value,
                        SourceText : charCondition.sourceText,
                        IsActive : (charCondition.isActive == 1) ? true : false
                    });
                }

                return mapToObj(conditionMap);

            });
        });
    }

    static getAllBackgrounds() {
        return Background.findAll()
        .then((backgrounds) => {
            return backgrounds;
        });
    }
    

    static getCharChoices(charID) {

        return Character.findOne({ where: { id: charID} })
        .then((character) => {
            return Heritage.findOne({ where: { id: character.heritageID} })
            .then((heritage) => {
                return CharDataStoring.getCharTags(charID)
                .then((charTagsArray) => {
                    return Class.findOne({ where: { id: character.classID} })
                    .then((cClass) => {
                        return CharDataStoring.getBasicData(charID, "GET_ALL", 'dataChosenFeats', Feat)
                        .then((featObject) => {
                            return CharDataStoring.getAbilityBonus(charID, "GET_ALL")
                            .then((bonusMap) => {
                                return CharDataStoring.getAbilityChoice(charID, "GET_ALL")
                                .then((abilityObject) => {
                                    return CharDataStoring.getProficiencies(charID, "GET_ALL")
                                    .then((proficiencyMap) => {
                                        return CharDataStoring.getBasicData(charID, "GET_ALL", 'dataLanguages', Language)
                                        .then((langObject) => {
                                            return CharDataStoring.getBasicData(charID, "GET_ALL", 'dataSenses', SenseType)
                                            .then((senseObject) => {

                                                let choiceStruct = {
                                                    Level : character.level,
                                                    Heritage : heritage,
                                                    Class : cClass,
                                                    CharTagsArray : charTagsArray,
                                                    FeatObject : featObject,
                                                    BonusObject : mapToObj(bonusMap),
                                                    AbilityObject : abilityObject,
                                                    ProficiencyObject : mapToObj(proficiencyMap),
                                                    LangObject : langObject,
                                                    SenseObject : senseObject
                                                };
                        
                                                return choiceStruct;

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


    static getAncestry(ancestryID) {
        return Ancestry.findOne({ where: { id: ancestryID} })
        .then((ancestry) => {
            return ancestry;
        });
    }

    static getHeritage(heritageID) {
        return Heritage.findOne({ where: { id: heritageID} })
        .then((heritage) => {
            return heritage;
        });
    }

    static getClass(classID) {
        return Class.findOne({ where: { id: classID} })
        .then((cClass) => {
            return cClass;
        });
    }

    static getCharacter(charID) {
        return Character.findOne({ where: { id: charID} })
        .then((character) => {
            return character;
        });
    }

    static getAllAbilityTypes() {
        return ['Strength','Dexterity','Constitution','Intelligence','Wisdom','Charisma'];
    }

    static getAncestryLanguages(ancestryID){
        return AncestryLanguage.findAll({ where: { ancestryID: ancestryID} })
        .then((ancestLangs) => {
            return ancestLangs;
        });
    }

    static getLanguageByName(langName) {
        return Language.findOne({ where: { name: langName} })
        .then((language) => {
            return language;
        });
    }

    static getFeatByName(featName) {
        return Feat.findOne({ where: { name: featName} })
        .then((feat) => {
            return feat;
        });
    }

    static getAbilityScores(charID) {

        return CharDataStoring.getAbilityBonus(charID, 'GET_ALL')
        .then((bonusMap) => {

            let abilMap = new Map();
            abilMap.set("STR", 10);
            abilMap.set("DEX", 10);
            abilMap.set("CON", 10);
            abilMap.set("INT", 10);
            abilMap.set("WIS", 10);
            abilMap.set("CHA", 10);

            let boostMap = new Map();

            for(const [dataSrc, dataValArray] of bonusMap.entries()){
                for(const dataVal of dataValArray){
                    if(dataVal.Bonus == "Boost") {
                        let boostNums = boostMap.get(dataVal.Ability);
                        if(boostNums == null){
                            boostMap.set(dataVal.Ability, 1);
                        } else {
                            boostMap.set(dataVal.Ability, boostNums+1);
                        }
                    } else if(dataVal.Bonus == "Flaw") {
                        let boostNums = boostMap.get(dataVal.Ability);
                        if(boostNums == null){
                            boostMap.set(dataVal.Ability, -1);
                        } else {
                            boostMap.set(dataVal.Ability, boostNums-1);
                        }
                    } else {
                        let abilBonus = abilMap.get(dataVal.Ability);
                        abilMap.set(dataVal.Ability, abilBonus+parseInt(dataVal.Bonus));
                    }
                }
            }

            for(const [ability, boostNums] of boostMap.entries()){
                let abilityScore = abilMap.get(ability);
                for (let i = 0; i < boostNums; i++) {
                    if(abilityScore < 18){
                        abilityScore += 2;
                    } else {
                        abilityScore += 1;
                    }
                }
                if(boostNums < 0) {
                    abilityScore = abilityScore+boostNums*2
                }
                abilMap.set(ability, abilityScore);
            }

            return mapToObj(abilMap);

        });

    }

    

    static getFinalProfs(charID) {
        return CharDataStoring.getProficiencies(charID, "GET_ALL")
        .then((proficiencyMap) => {
            let newProfMap = new Map();
            for(const [dataSrc, dataValArray] of proficiencyMap.entries()){
                for(const dataVal of dataValArray){

                    let profMapValue = newProfMap.get(dataVal.To);
                    if(profMapValue != null){

                        newProfMap.set(dataVal.To, {
                            BestProf : getBetterProf(profMapValue.BestProf, dataVal.Prof),
                            NumIncreases : profMapValue.NumIncreases+getUpAmt(dataVal.Prof),
                            Bonus : profMapValue.Bonus+getBonus(dataVal.Prof),
                            For : profMapValue.For
                        });

                    } else {

                        newProfMap.set(dataVal.To, {
                            BestProf : getBetterProf('U', dataVal.Prof),
                            NumIncreases : getUpAmt(dataVal.Prof),
                            Bonus : getBonus(dataVal.Prof),
                            For : dataVal.For
                        });

                    }

                }
            }

            for(const [profName, profData] of newProfMap.entries()){

                newProfMap.set(profName, {
                    Name : profName,
                    NumUps : profTypeToNumber(profData.BestProf)+profData.NumIncreases,
                    Bonus : profData.Bonus,
                    For : profData.For
                });
                        
            }

            return newProfMap;
        });
    }

    static gatherWeaponProfs(profMap, itemMap){

        let weaponProfMap = new Map(); // Key: ItemID Value: { NumUps, Bonus }

        for(const [profName, profData] of profMap.entries()){
            if(profData.For == "Attack"){

                if(profName == 'Simple_Weapons'){
                    for(const [itemID, itemData] of itemMap.entries()){
                        if(itemData.WeaponData != null && itemData.WeaponData.category == "SIMPLE"){
                            weaponProfMap.set(itemID, {
                                NumUps : profData.NumUps,
                                Bonus : profData.Bonus
                            });
                        }
                    }
                } else if(profName == 'Martial_Weapons'){
                    for(const [itemID, itemData] of itemMap.entries()){
                        if(itemData.WeaponData != null && itemData.WeaponData.category == "MARTIAL"){
                            weaponProfMap.set(itemID, {
                                NumUps : profData.NumUps,
                                Bonus : profData.Bonus
                            });
                        }
                    }
                } else if(profName == 'Advanced_Weapons'){
                    for(const [itemID, itemData] of itemMap.entries()){
                        if(itemData.WeaponData != null && itemData.WeaponData.category == "ADVANCED"){
                            weaponProfMap.set(itemID, {
                                NumUps : profData.NumUps,
                                Bonus : profData.Bonus
                            });
                        }
                    }
                } else if(profName == 'Unarmed_Attacks'){
                    for(const [itemID, itemData] of itemMap.entries()){
                        if(itemData.WeaponData != null && itemData.WeaponData.category == "UNARMED"){
                            weaponProfMap.set(itemID, {
                                NumUps : profData.NumUps,
                                Bonus : profData.Bonus
                            });
                        }
                    }
                } else {
                    let dProfName = profName.toLowerCase().replace(/_/g,' ');
                    let itemData = findItemDataByName(itemMap, dProfName);
                    if(itemData != null){
                        weaponProfMap.set(itemData.Item.id, {
                            NumUps : profData.NumUps,
                            Bonus : profData.Bonus
                        });
                    }
                }

            }
        }

        return weaponProfMap;
    }


    static gatherArmorProfs(profMap, itemMap){

        let armorProfMap = new Map(); // Key: ItemID Value: { NumUps, Bonus }

        for(const [profName, profData] of profMap.entries()){
            if(profData.For == "Defense"){

                if(profName == 'Light_Armor'){
                    for(const [itemID, itemData] of itemMap.entries()){
                        if(itemData.ArmorData != null && itemData.ArmorData.category == "LIGHT"){
                            armorProfMap.set(itemID, {
                                NumUps : profData.NumUps,
                                Bonus : profData.Bonus
                            });
                        }
                    }
                } else if(profName == 'Medium_Armor'){
                    for(const [itemID, itemData] of itemMap.entries()){
                        if(itemData.ArmorData != null && itemData.ArmorData.category == "MEDIUM"){
                            armorProfMap.set(itemID, {
                                NumUps : profData.NumUps,
                                Bonus : profData.Bonus
                            });
                        }
                    }
                } else if(profName == 'Heavy_Armor'){
                    for(const [itemID, itemData] of itemMap.entries()){
                        if(itemData.ArmorData != null && itemData.ArmorData.category == "HEAVY"){
                            armorProfMap.set(itemID, {
                                NumUps : profData.NumUps,
                                Bonus : profData.Bonus
                            });
                        }
                    }
                } else if(profName == 'Unarmored_Defense'){
                    for(const [itemID, itemData] of itemMap.entries()){
                        if(itemData.ArmorData != null && itemData.ArmorData.category == "UNARMORED"){
                            armorProfMap.set(itemID, {
                                NumUps : profData.NumUps,
                                Bonus : profData.Bonus
                            });
                        }
                    }
                } else {
                    let dProfName = profName.toLowerCase().replace(/_/g,' ');
                    let itemData = findItemDataByName(itemMap, dProfName);
                    if(itemData != null){
                        armorProfMap.set(itemData.Item.id, {
                            NumUps : profData.NumUps,
                            Bonus : profData.Bonus
                        });
                    }
                }

            }
        }

        return armorProfMap;
    }

    static getCharacterInfo(charID){

        return Character.findOne({ where: { id: charID } })
        .then((character) => {
            return Class.findOne({ where: { id: character.classID} })
            .then((cClass) => {
                return Background.findOne({ where: { id: character.backgroundID} })
                .then((background) => {
                    return Ancestry.findOne({ where: { id: character.ancestryID} })
                    .then((ancestry) => {
                        return Heritage.findOne({ where: { id: character.heritageID} })
                        .then((heritage) => {
                            return Inventory.findOne({ where: { id: character.inventoryID} })
                            .then((inventory) => {
                                return CharGathering.getAbilityScores(charID)
                                .then((abilObject) => {
                                    return CharGathering.getAllSkills(charID)
                                    .then((skillObject) => {
                                        return CharGathering.getCharChoices(charID)
                                        .then( (choicesStruct) => {
                                            return CharGathering.getAllFeats()
                                            .then( (featObject) => {
                                                return CharGathering.getAllItems()
                                                .then( (itemMap) => {
                                                    return CharGathering.getAllConditions(charID)
                                                    .then( (conditionsObject) => {
                                                        return Condition.findAll()
                                                        .then((allConditions) => {
                                                            return CharGathering.getFinalProfs(charID)
                                                            .then( (profMap) => {
                                                                return CharGathering.getInventory(character.inventoryID)
                                                                .then( (invStruct) => {
                                                                    
                                                                    let weaponProfMap = CharGathering.gatherWeaponProfs(profMap, itemMap);
                                                                    let armorProfMap = CharGathering.gatherArmorProfs(profMap, itemMap);
                                                                    
                                                                    let charInfo = {
                                                                        Character : character,
                                                                        Class : cClass,
                                                                        Background : background,
                                                                        Ancestry : ancestry,
                                                                        Heritage : heritage,
                                                                        Inventory : inventory,
                                                                        AbilObject : abilObject,
                                                                        SkillObject : skillObject,
                                                                        FeatObject : featObject,
                                                                        ProfObject : mapToObj(profMap),
                                                                        ChoicesStruct : choicesStruct,
                                                                        InvStruct : invStruct,
                                                                        ItemObject : mapToObj(itemMap),
                                                                        ConditionsObject : conditionsObject,
                                                                        WeaponProfObject : mapToObj(weaponProfMap),
                                                                        ArmorProfObject : mapToObj(armorProfMap),
                                                                        AllConditions : allConditions
                                                                    };
                                            
                                                                    return charInfo;

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

    static getAllCharacterBuilderInfo(character) {

        return Class.findOne({ where: { id: character.classID} })
        .then((charClass) => {
            return Background.findOne({ where: { id: character.backgroundID} })
            .then((charBackground) => {
                return Ancestry.findOne({ where: { id: character.ancestryID} })
                .then((charAncestry) => {
                    return Heritage.findOne({ where: { id: character.heritageID} })
                    .then((charHeritage) => {
                        return CharDataStoring.getAbilityBonus(character.id, 
                            'Type-Other_Level-1_Code-None')
                        .then((bonusMap) => {

                            let bonusArray = bonusMap.get('Type-Other_Level-1_Code-None');
                            let charAbilities = null;
                            console.log(bonusMap);
                            if(bonusMap != null && bonusArray != null && bonusArray.length == 6) {
                                charAbilities = {
                                    STR : 10 + parseInt(bonusArray[0].Bonus),
                                    DEX : 10 + parseInt(bonusArray[1].Bonus),
                                    CON : 10 + parseInt(bonusArray[2].Bonus),
                                    INT : 10 + parseInt(bonusArray[3].Bonus),
                                    WIS : 10 + parseInt(bonusArray[4].Bonus),
                                    CHA : 10 + parseInt(bonusArray[5].Bonus),
                                };
                            } else {
                                charAbilities = {
                                    STR : 10,
                                    DEX : 10,
                                    CON : 10,
                                    INT : 10,
                                    WIS : 10,
                                    CHA : 10,
                                };
                            }
                                
                            return {
                                char: character,
                                cClass: charClass,
                                background: charBackground,
                                ancestry: charAncestry,
                                heritage: charHeritage,
                                charAbilities: charAbilities
                            };

                        });
                    });
                });
            });
        });

    }

};