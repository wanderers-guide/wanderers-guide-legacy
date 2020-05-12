const Character = require('../models/contentDB/Character');
const CharData = require('../models/contentDB/CharData');

function mapToObj(strMap) {
    let obj = Object.create(null);
    for (let [k,v] of strMap) {
      // Doesn't escape the key '__proto__'
      // which can cause problems on older engines
      obj[k] = v;
    }
    return obj;
}

module.exports = class CharDataStoring {

    static getAllID(){
        return "GET_ALL";
    }

    static getBasicDataNames(){
        return ['dataLoreCategories','dataSpellLists','dataSenses','dataChosenFeats','dataLanguages'];
    }
    static getAllDataNames(){
        let allDataNames = CharDataStoring.getBasicDataNames();
        allDataNames.push('dataAbilityBonus','dataAbilityChoices','dataProficiencies');
        return allDataNames;
    }

    /*
    
    SrcID: 'Type-(Class/Ancestry/Background/Other)_Level-#_Code-(Feat#/Ability#/Other#/None)'

    --- Basic Datas ---
    dataLoreCategories: "SrcID:Sailing,SrcID:Underwater Golfing,SrcID:Clubbing"

    dataSpellLists: "SrcID:Primal,SrcID:Occult,SrcID:Divine,SrcID:Arcane,SrcID:34"

    dataSenses: "SrcID:1,SrcID:0,SrcID:3,SrcID:4"

    dataChosenFeats: "SrcID:1,SrcID:0,SrcID:3,SrcID:4"

    dataLanguages: "SrcID:1,SrcID:0,SrcID:3,SrcID:4"

    --- Special Datas ---
    dataAbilityBonus: "SrcID:DEX=5,SrcID:CHA=Boost,SrcID:WIS=Flaw" (ability=Bonus)

    dataAbilityChoices: "SrcID:3=6,SrcID:7=11" (selectorAbility=selectOptionAbility)

    dataProficiencies: "SrcID:Diplomacy=Up,SrcID:Society=4,SrcID:Skill~Diplomacy=2,SrcID:Skill~Perception=Up,
            SrcID:Skill~Sailing_Lore=Up,SrcID:Defense~Light_Armor=Up"

    --- Char Tags ---
    charTags: "Human,Half-Elf,Elf"


    */

    // Basic Data //
    static getBasicData(charID, srcID, dataName, dataModelForMap){
        return Character.findOne({ where: { id: charID} })
        .then((character) => {
            return CharData.findOne({ where: { id: character.dataID} })
            .then((charData) => {
                let attrib = charData[dataName];

                if(attrib == null || attrib == '') {
                    return new Map();
                }

                let sections = attrib.split(",");

                let dataMap = new Map();

                for(const section of sections){
                    let subsec = section.split(":");
                    let dataSrc = subsec[0];
                    let data = subsec[1];

                    if(srcID === "GET_ALL" || srcID === dataSrc){
                        if(dataMap.has(dataSrc)){
                            let dataArray = dataMap.get(dataSrc);
                            dataArray.push(data);
                            dataMap.set(dataSrc, dataArray);
                        } else {
                            let dataArray = [];
                            dataArray.push(data);
                            dataMap.set(dataSrc, dataArray);
                        }
                    }

                }

                if(dataModelForMap != null) {
                    // Find all dataModels from Data Array
                    return dataModelForMap.findAll()
                    .then((dataModelsArray) => {
                        let modelMap = new Map();
                        for(const [dataSrc, dataArray] of dataMap.entries()){
                            for(const dataID of dataArray){
                                let dataModel = dataModelsArray.find(dataModel => {
                                    return dataModel.id == dataID;
                                });
                                if(modelMap.has(dataSrc)){
                                    let modelDataArray = modelMap.get(dataSrc);
                                    modelDataArray.push(dataModel);
                                    modelMap.set(dataSrc, modelDataArray);
                                } else {
                                    let modelDataArray = [];
                                    modelDataArray.push(dataModel);
                                    modelMap.set(dataSrc, modelDataArray);
                                }
                            }
                        }
                        return mapToObj(modelMap);
                    });
                } else {
                    return mapToObj(dataMap);
                }

            });

        });
    }

    static replaceBasicData(charID, srcID, dataArray, dataName) {
        return Character.findOne({ where: { id: charID} })
        .then((character) => {
            return CharData.findOne({ where: { id: character.dataID} })
            .then((charData) => {
                let attrib = charData[dataName];

                let arrayStr = "";
                if(attrib != null){
                    let sections = attrib.split(",");
                    for(const section of sections){
                        let subsec = section.split(":");
                        let dataSrc = subsec[0];
    
                        if(dataSrc != srcID){
                            if(arrayStr === "") {
                                arrayStr = section;
                            } else {
                                arrayStr += ","+section;
                            }
                        }
                    }
                }

                for(const data of dataArray) {
                    if(data != null){
                        if(arrayStr === "") {
                            arrayStr = srcID+":"+data;
                        } else {
                            arrayStr += ","+srcID+":"+data;
                        }
                    }
                }

                let dataUpVals = {};
                dataUpVals[dataName] = arrayStr;

                return CharData.update(dataUpVals, { where: { id: character.dataID } })
                .then((result) => {
                    return;
                });
            });
        });
    }

    static deleteBasicData(charID, srcID, contains, dataName) {
        // contains is true/false on whether the delete any records in which the srcID is present
       return Character.findOne({ where: { id: charID} })
       .then((character) => {
           return CharData.findOne({ where: { id: character.dataID} })
           .then((charData) => {
               let attrib = charData[dataName];

               let arrayStr = "";
               if(attrib != null){
                   let sections = attrib.split(",");
                   for(const section of sections){
                       let subsec = section.split(":");
                       let dataSrc = subsec[0];
                       if(contains) {
                           if(!dataSrc.includes(srcID)){
                               if(arrayStr === "") {
                                   arrayStr = section;
                               } else {
                                   arrayStr = arrayStr+","+section;
                               }
                           }
                       } else {
                           if(dataSrc != srcID){
                               if(arrayStr === "") {
                                   arrayStr = section;
                               } else {
                                   arrayStr = arrayStr+","+section;
                               }
                           }
                       }
                   }
               }

               let dataUpVals = {};
               dataUpVals[dataName] = arrayStr;

               return CharData.update(dataUpVals, { where: { id: character.dataID } })
               .then((result) => {
                   return;
               });
           });
       });
    }


    // Proficiencies // Struct = { For : "Skill", To : "Light_Armor", Prof : "5"}

    static replaceProficiencies(charID, id, proficiencyArray) {

        return Character.findOne({ where: { id: charID} })
        .then((character) => {

            return CharData.findOne({ where: { id: character.dataID} })
            .then((charData) => {

                let attrib = charData.dataProficiencies;

                let arrayStr = "";
                if(attrib != null){

                    let sections = attrib.split(",");

                    for(const section of sections){
                        let subsec = section.split(":");
                        let dataSrc = subsec[0];
    
                        if(dataSrc != id){
                            if(arrayStr === "") {
                                arrayStr = section;
                            } else {
                                arrayStr = arrayStr+","+section;
                            }
                        }
    
                    }

                }

                if(proficiencyArray != null){
                    for(const proficiency of proficiencyArray) {
                        if(proficiency != null){
                            if(arrayStr === "") {
                                arrayStr = id+":"+proficiency.For+"~"+proficiency.To+"="+proficiency.Prof;
                            } else {
                                arrayStr = arrayStr+","+id+":"+proficiency.For+"~"+proficiency.To+"="+proficiency.Prof;
                            }
                        }
                    }
                }

                let dataUpVals = {
                    dataProficiencies: arrayStr
                };

                return CharData.update(dataUpVals, { where: { id: character.dataID } })
                .then((result) => {
                    return;
                });

            });

        });

    }

    static deleteProficiencies(charID, id, contains) {
         // contains is true/false on whether the delete any records in which the id is present
        return Character.findOne({ where: { id: charID} })
        .then((character) => {

            return CharData.findOne({ where: { id: character.dataID} })
            .then((charData) => {

                let attrib = charData.dataProficiencies;

                let arrayStr = "";
                if(attrib != null){

                    let sections = attrib.split(",");

                    for(const section of sections){
                        let subsec = section.split(":");
                        let dataSrc = subsec[0];
    
                        if(contains) {
                            if(!dataSrc.includes(id)){
                                if(arrayStr === "") {
                                    arrayStr = section;
                                } else {
                                    arrayStr = arrayStr+","+section;
                                }
                            }
                        } else {
                            if(dataSrc != id){
                                if(arrayStr === "") {
                                    arrayStr = section;
                                } else {
                                    arrayStr = arrayStr+","+section;
                                }
                            }
                        }
    
                    }

                }

                let dataUpVals = {
                    dataProficiencies: arrayStr
                };

                return CharData.update(dataUpVals, { where: { id: character.dataID } })
                .then((result) => {
                    return;
                });

            });

        });

    }

    static getProficiencies(charID, id) {

        return Character.findOne({ where: { id: charID} })
        .then((character) => {

            return CharData.findOne({ where: { id: character.dataID} })
            .then((charData) => {

                let attrib = charData.dataProficiencies;

                if(attrib == null || attrib == '') {
                    return new Map();
                }

                let sections = attrib.split(",");

                let dataMap = new Map();

                for(const section of sections){
                    let subsec = section.split(":");
                    let dataSrc = subsec[0];
                    let data = subsec[1];

                    if(id === "GET_ALL" || dataSrc === id){

                        let subdata = data.split("=");
                        let frontdata = subdata[0];
                        let subfrontdata = frontdata.split("~");
                        let forData = subfrontdata[0];
                        let toData = subfrontdata[1];
                        let profData = subdata[1];

                        if(dataMap.has(dataSrc)){
                            let dataValArray = dataMap.get(dataSrc);
                            dataValArray.push({ For : forData, To : toData, Prof : profData });
                            dataMap.set(dataSrc, dataValArray);
                        } else {
                            let dataValArray = [];
                            dataValArray.push({ For : forData, To : toData, Prof : profData });
                            dataMap.set(dataSrc, dataValArray);
                        }
                        
                    }

                }

                return dataMap;

            });

        });

    }


    // Ability Bonus // Struct = { Ability : "DEX", Bonus : "Boost"}

    static addAbilityBonus(charID, id, abilityBonusArray) {

        return Character.findOne({ where: { id: charID} })
        .then((character) => {

            return CharData.findOne({ where: { id: character.dataID} })
            .then((charData) => {

                let attrib = charData.dataAbilityBonus;
                
                let arrayStr = attrib;
                if(abilityBonusArray != null){
                    for(const abilityBonus of abilityBonusArray) {
                        if(arrayStr == null || arrayStr == '') {
                            arrayStr = id+":"+abilityBonus.Ability+"="+abilityBonus.Bonus;
                        } else {
                            arrayStr = arrayStr+","+id+":"+abilityBonus.Ability+"="+abilityBonus.Bonus;
                        }
                    }
                }
                
                let dataUpVals = {
                    dataAbilityBonus: arrayStr
                };

                return CharData.update(dataUpVals, { where: { id: character.dataID } })
                .then((result) => {
                    return;
                });

            });

        });

    }

    static deleteAbilityBonus(charID, id, contains) {
        // contains is true/false on whether the delete any records in which the id is present
       return Character.findOne({ where: { id: charID} })
       .then((character) => {

           return CharData.findOne({ where: { id: character.dataID} })
           .then((charData) => {

               let attrib = charData.dataAbilityBonus;

               let arrayStr = "";
               if(attrib != null){

                   let sections = attrib.split(",");

                   for(const section of sections){
                       let subsec = section.split(":");
                       let dataSrc = subsec[0];
   
                       if(contains) {
                           if(!dataSrc.includes(id)){
                               if(arrayStr === "") {
                                   arrayStr = section;
                               } else {
                                   arrayStr = arrayStr+","+section;
                               }
                           }
                       } else {
                           if(dataSrc != id){
                               if(arrayStr === "") {
                                   arrayStr = section;
                               } else {
                                   arrayStr = arrayStr+","+section;
                               }
                           }
                       }
   
                   }

                }

                let dataUpVals = {
                    dataAbilityBonus: arrayStr
                };

               return CharData.update(dataUpVals, { where: { id: character.dataID } })
               .then((result) => {
                   return;
               });

           });

       });

   }

    static replaceAbilityBonus(charID, id, abilityBonusArray) {

        return Character.findOne({ where: { id: charID} })
        .then((character) => {

            return CharData.findOne({ where: { id: character.dataID} })
            .then((charData) => {

                let attrib = charData.dataAbilityBonus;

                let arrayStr = "";
                if(attrib != null){

                    let sections = attrib.split(",");

                    for(const section of sections){
                        let subsec = section.split(":");
                        let dataSrc = subsec[0];
    
                        if(dataSrc != id){
                            if(arrayStr === "") {
                                arrayStr = section;
                            } else {
                                arrayStr = arrayStr+","+section;
                            }
                        }
    
                    }

                }

                if(abilityBonusArray != null){
                    for(const abilityBonus of abilityBonusArray) {
                        if(abilityBonus != null){
                            if(arrayStr === "") {
                                arrayStr = id+":"+abilityBonus.Ability+"="+abilityBonus.Bonus;
                            } else {
                                arrayStr = arrayStr+","+id+":"+abilityBonus.Ability+"="+abilityBonus.Bonus;
                            }
                        }
                    }
                }

                let dataUpVals = {
                    dataAbilityBonus: arrayStr
                };

                return CharData.update(dataUpVals, { where: { id: character.dataID } })
                .then((result) => {
                    return;
                });

            });

        });

    }

    static getAbilityBonus(charID, id) {

        return Character.findOne({ where: { id: charID} })
        .then((character) => {

            return CharData.findOne({ where: { id: character.dataID} })
            .then((charData) => {

                let attrib = charData.dataAbilityBonus;

                if(attrib == null || attrib == '') {
                    return new Map();
                }

                let sections = attrib.split(",");

                let dataMap = new Map();

                for(const section of sections){
                    let subsec = section.split(":");
                    let dataSrc = subsec[0];
                    let data = subsec[1];

                    if(id === "GET_ALL" || dataSrc === id){

                        let subdata = data.split("=");
                        let ability = subdata[0];
                        let bonus = subdata[1];

                        if(dataMap.has(dataSrc)){
                            let dataValArray = dataMap.get(dataSrc);
                            dataValArray.push({ Ability : ability, Bonus : bonus });
                            dataMap.set(dataSrc, dataValArray);
                        } else {
                            let dataValArray = [];
                            dataValArray.push({ Ability : ability, Bonus : bonus });
                            dataMap.set(dataSrc, dataValArray);
                        }
                        
                    }

                }

                return dataMap;

            });

        });

    }

    // Ability Choice "C:3=6,C:7=11" (selectorAbility=selectOptionAbility)

    static getAbilityChoice(charID, id) {

        return Character.findOne({ where: { id: charID} })
        .then((character) => {

            return CharData.findOne({ where: { id: character.dataID} })
            .then((charData) => {

                let attrib = charData.dataAbilityChoices;

                if(attrib == null || attrib == '') {
                    return mapToObj(new Map());
                }

                let sections = attrib.split(",");

                let dataMap = new Map();

                for(const section of sections){
                    let subsec = section.split(":");
                    let dataSrc = subsec[0];
                    let data = subsec[1];

                    if(id === "GET_ALL" || dataSrc === id){

                        let subdata = data.split("=");
                        let selectorAbility = subdata[0];
                        let selectOptionAbility = subdata[1];


                        dataMap.set(selectorAbility, selectOptionAbility);
                        /*
                        if(dataMap.has(dataSrc)){
                            let dataValArray = dataMap.get(dataSrc);
                            dataValArray.push({ SelectorAbilityID : selectorAbility, SelectOptionAbilityID : selectOptionAbility });
                            dataMap.set(dataSrc, dataValArray);
                        } else {
                            let dataValArray = [];
                            dataValArray.push({ SelectorAbilityID : selectorAbility, SelectOptionAbilityID : selectOptionAbility });
                            dataMap.set(dataSrc, dataValArray);
                        }*/

                    }

                }

                return mapToObj(dataMap);

            });

        });

    }

    static replaceAbilityChoice(charID, id, abilityChoiceArray) {

        return Character.findOne({ where: { id: charID} })
        .then((character) => {

            return CharData.findOne({ where: { id: character.dataID} })
            .then((charData) => {

                let attrib = charData.dataAbilityChoices;

                let arrayStr = "";
                if(attrib != null){

                    let sections = attrib.split(",");

                    for(const section of sections){
                        let subsec = section.split(":");
                        let dataSrc = subsec[0];
    
                        if(dataSrc != id){
                            if(arrayStr === "") {
                                arrayStr = section;
                            } else {
                                arrayStr = arrayStr+","+section;
                            }
                        }
    
                    }

                }

                for(const abilityChoice of abilityChoiceArray) {
                    if(abilityChoice != null){
                        if(arrayStr === "") {
                            arrayStr = id+":"+abilityChoice.SelectorAbility+"="+abilityChoice.SelectOptionAbility;
                        } else {
                            arrayStr = arrayStr+","+id+":"+abilityChoice.SelectorAbility+"="+abilityChoice.SelectOptionAbility;
                        }
                    }
                }

                let dataUpVals = {
                    dataAbilityChoices: arrayStr
                };

                return CharData.update(dataUpVals, { where: { id: character.dataID } })
                .then((result) => {
                    return;
                });

            });

        });

    }

    static deleteAbilityChoice(charID, id, contains) {
        // contains is true/false on whether the delete any records in which the id is present
        return Character.findOne({ where: { id: charID} })
        .then((character) => {

            return CharData.findOne({ where: { id: character.dataID} })
            .then((charData) => {

                let attrib = charData.dataAbilityChoices;

                let arrayStr = "";
                if(attrib != null){

                    let sections = attrib.split(",");

                    for(const section of sections){
                        let subsec = section.split(":");
                        let dataSrc = subsec[0];
    
                        if(contains) {
                            if(!dataSrc.includes(id)){
                                if(arrayStr === "") {
                                    arrayStr = section;
                                } else {
                                    arrayStr = arrayStr+","+section;
                                }
                            }
                        } else {
                            if(dataSrc != id){
                                if(arrayStr === "") {
                                    arrayStr = section;
                                } else {
                                    arrayStr = arrayStr+","+section;
                                }
                            }
                        }
    
                    }

                }
                
                let dataUpVals = {
                    dataAbilityChoices: arrayStr
                };

                return CharData.update(dataUpVals, { where: { id: character.dataID } })
                .then((result) => {
                    return;
                });

            });

        });

    }


    // Char Tags // charTags: "Human,Half-Elf,Elf"

    static addCharTag(charID, charTag) {

        return Character.findOne({ where: { id: charID} })
        .then((character) => {

            return CharData.findOne({ where: { id: character.dataID} })
            .then((charData) => {

                let attrib = charData.charTags;

                let arrayStr = attrib;
                if(arrayStr == null || arrayStr == '') {
                    arrayStr = charTag;
                } else {
                    arrayStr = arrayStr+","+charTag;
                }

                let dataUpVals = {
                    charTags: arrayStr
                };

                return CharData.update(dataUpVals, { where: { id: character.dataID } })
                .then((result) => {
                    return;
                });

            });

        });

    }

    static getCharTags(charID) {

        return Character.findOne({ where: { id: charID} })
        .then((character) => {

            return CharData.findOne({ where: { id: character.dataID} })
            .then((charData) => {

                let attrib = charData.charTags;

                if(attrib == null || attrib == '') {
                    return [];
                }

                return attrib.split(",");

            });

        });

    }

    static removeCharTag(charID, charTag) {

        return Character.findOne({ where: { id: charID} })
        .then((character) => {

            return CharData.findOne({ where: { id: character.dataID} })
            .then((charData) => {

                let attrib = charData.charTags;

                if(attrib == null) {
                    return;
                }

                let sections = attrib.split(",");

                let arrayStr = '';
                for(const section of sections){
    
                    if(section != charTag){
                        if(arrayStr === "") {
                            arrayStr = section;
                        } else {
                            arrayStr = arrayStr+","+section;
                        }
                    }
    
                }
                
                let dataUpVals = {
                    charTags: arrayStr
                };

                return CharData.update(dataUpVals, { where: { id: character.dataID } })
                .then((result) => {
                    return;
                });

            });

        });

    }



    // Delete Data of Higher Level
    static deleteDataOfHigherLevel(charID, dataType, level) {
       return Character.findOne({ where: { id: charID} })
       .then((character) => {

           return CharData.findOne({ where: { id: character.dataID} })
           .then((charData) => {

               let attrib = charData[dataType];

               let arrayStr = "";
               if(attrib != null && attrib != ''){

                    let sections = attrib.split(",");

                    for(const section of sections){
                       let subsec = section.split(":");
                       let dataSrc = subsec[0];
   
                        // Ex of Data: 'Type-Class_Level-4_Code-None'
                        let dataSrcSec = dataSrc.split('_');
                        let dataSubSrcSec = dataSrcSec[1].split('-');
                        let dataLevel = parseInt(dataSubSrcSec[1]);

                        if(dataLevel <= level){
                            if(arrayStr === "") {
                                arrayStr = section;
                            } else {
                                arrayStr = arrayStr+","+section;
                            }
                        }
                    }
                }

                let dataUpVals = {};
                dataUpVals[dataType] = arrayStr;

                return CharData.update(dataUpVals, { where: { id: character.dataID } })
                .then((result) => {
                    return;
                });
            });
        });
    }



};