const Character = require('../models/contentDB/Character');
const CharData = require('../models/contentDB/CharData');

const Language = require('../models/contentDB/Language');
const Feat = require('../models/contentDB/Feat');

function mapToObj(strMap) {
    let obj = Object.create(null);
    for (let [k,v] of strMap) {
      // We don’t escape the key '__proto__'
      // which can cause problems on older engines
      obj[k] = v;
    }
    return obj;
}

module.exports = class CharDataStoring {

    static getAllID(){
        return "GET_ALL";
    }

    /*
    
    charTags: "Human,Half-Elf,Elf"

            
    SrcID: 'Type-(Class/Ancestry/Background/Other)_Level-#_Code-(Feat#/Ability#/Other#/None)'


    dataAbilityBonus: "SrcID:DEX=5,SrcID:CHA=Boost,SrcID:WIS=Flaw" (ability=Bonus)

    dataLanguages: (lang ID split by ',') "SrcID:1,SrcID:0,SrcID:3,SrcID:4"

    dataProficiencies: "SrcID:Diplomacy=Up,SrcID:Society=4,SrcID:Skill~Diplomacy=2,SrcID:Skill~Perception=Up,
            SrcID:Skill~Sailing_Lore=Up,SrcID:Defense~Light_Armor=Up"

    dataChosenFeats: (feat ID split by ',') "SrcID:1,SrcID:0,SrcID:3,SrcID:4"

    dataAbilityChoices: "SrcID:3=6,SrcID:7=11" (selectorAbility=selectOptionAbility)

    dataLoreCategories: "SrcID:Sailing,SrcID:Underwater Golfing,SrcID:Clubbing"


    */

    // Lore Categories //

    static addLore(charID, id, loreArray) {

        return Character.findOne({ where: { id: charID} })
        .then((character) => {

            return CharData.findOne({ where: { id: character.dataID} })
            .then((charData) => {

                let attrib = charData['dataLoreCategories'];

                let arrayStr = attrib;
                for(const lore of loreArray) {
                    if(arrayStr == null || arrayStr == '') {
                        arrayStr = id+":"+lore;
                    } else {
                        arrayStr = arrayStr+","+id+":"+lore;
                    }
                }

                let dataUpVals = new Object;
                dataUpVals['dataLoreCategories'] = arrayStr;

                return CharData.update(dataUpVals, { where: { id: character.dataID } })
                .then((result) => {
                    return;
                });

            });

        });

    }

    static getLore(charID, id) {

        return Character.findOne({ where: { id: charID} })
        .then((character) => {

            return CharData.findOne({ where: { id: character.dataID} })
            .then((charData) => {

                let attrib = charData['dataLoreCategories'];

                if(attrib == null || attrib == '') {
                    return new Map();
                }

                let sections = attrib.split(",");

                let loreMap = new Map();

                for(const section of sections){
                    let subsec = section.split(":");
                    let dataSrc = subsec[0];
                    let data = subsec[1];

                    if(id === "GET_ALL" || dataSrc === id){
                        if(loreMap.has(dataSrc)){
                            let dataArray = loreMap.get(dataSrc);
                            dataArray.push(data);
                            loreMap.set(dataSrc, dataArray);
                        } else {
                            let dataArray = [];
                            dataArray.push(data);
                            loreMap.set(dataSrc, dataArray);
                        }
                    }

                }

                return loreMap;

            });

        });

    }

    static replaceLore(charID, id, loreArray) {

        return Character.findOne({ where: { id: charID} })
        .then((character) => {

            return CharData.findOne({ where: { id: character.dataID} })
            .then((charData) => {

                let attrib = charData['dataLoreCategories'];

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

                for(const lore of loreArray) {
                    if(lore != null){
                        if(arrayStr === "") {
                            arrayStr = id+":"+lore;
                        } else {
                            arrayStr = arrayStr+","+id+":"+lore;
                        }
                    }
                }

                let dataUpVals = new Object;
                dataUpVals['dataLoreCategories'] = arrayStr;

                return CharData.update(dataUpVals, { where: { id: character.dataID } })
                .then((result) => {
                    return;
                });

            });

        });

    }

    static deleteLore(charID, id, contains) {
        // contains is true/false on whether the delete any records in which the id is present
       return Character.findOne({ where: { id: charID} })
       .then((character) => {

           return CharData.findOne({ where: { id: character.dataID} })
           .then((charData) => {

               let attrib = charData['dataLoreCategories'];

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

               let dataUpVals = new Object;
               dataUpVals['dataLoreCategories'] = arrayStr;

               return CharData.update(dataUpVals, { where: { id: character.dataID } })
               .then((result) => {
                   return;
               });

           });

       });

    }

    // Proficiencies // Struct = { For : "Skill", To : "Light_Armor", Prof : "5"}

    static addProficiencies(charID, id, proficiencyArray) {

        return Character.findOne({ where: { id: charID} })
        .then((character) => {

            return CharData.findOne({ where: { id: character.dataID} })
            .then((charData) => {

                let attrib = charData['dataProficiencies'];
                
                let arrayStr = attrib;
                for(const proficiency of proficiencyArray) {
                    if(arrayStr == null || arrayStr == '') {
                        arrayStr = id+":"+proficiency.For+"~"+proficiency.To+"="+proficiency.Prof;
                    } else {
                        arrayStr = arrayStr+","+id+":"+proficiency.For+"~"+proficiency.To+"="+proficiency.Prof;
                    }
                }

                let dataUpVals = new Object;
                dataUpVals['dataProficiencies'] = arrayStr;

                return CharData.update(dataUpVals, { where: { id: character.dataID } })
                .then((result) => {
                    return;
                });

            });

        });

    }

    static replaceProficiencies(charID, id, proficiencyArray) {

        return Character.findOne({ where: { id: charID} })
        .then((character) => {

            return CharData.findOne({ where: { id: character.dataID} })
            .then((charData) => {

                let attrib = charData['dataProficiencies'];

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

                for(const proficiency of proficiencyArray) {
                    if(proficiency != null){
                        if(arrayStr === "") {
                            arrayStr = id+":"+proficiency.For+"~"+proficiency.To+"="+proficiency.Prof;
                        } else {
                            arrayStr = arrayStr+","+id+":"+proficiency.For+"~"+proficiency.To+"="+proficiency.Prof;
                        }
                    }
                }

                let dataUpVals = new Object;
                dataUpVals['dataProficiencies'] = arrayStr;

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

                let attrib = charData['dataProficiencies'];

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

                let dataUpVals = new Object;
                dataUpVals['dataProficiencies'] = arrayStr;

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

                let attrib = charData['dataProficiencies'];

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

                let attrib = charData['dataAbilityBonus'];
                
                let arrayStr = attrib;
                for(const abilityBonus of abilityBonusArray) {
                    if(arrayStr == null || arrayStr == '') {
                        arrayStr = id+":"+abilityBonus.Ability+"="+abilityBonus.Bonus;
                    } else {
                        arrayStr = arrayStr+","+id+":"+abilityBonus.Ability+"="+abilityBonus.Bonus;
                    }
                }

                let dataUpVals = new Object;
                dataUpVals['dataAbilityBonus'] = arrayStr;

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

               let attrib = charData['dataAbilityBonus'];

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

               let dataUpVals = new Object;
               dataUpVals['dataAbilityBonus'] = arrayStr;

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

                let attrib = charData['dataAbilityBonus'];

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

                for(const abilityBonus of abilityBonusArray) {
                    if(abilityBonus != null){
                        if(arrayStr === "") {
                            arrayStr = id+":"+abilityBonus.Ability+"="+abilityBonus.Bonus;
                        } else {
                            arrayStr = arrayStr+","+id+":"+abilityBonus.Ability+"="+abilityBonus.Bonus;
                        }
                    }
                }

                let dataUpVals = new Object;
                dataUpVals['dataAbilityBonus'] = arrayStr;

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

                let attrib = charData['dataAbilityBonus'];

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
    


    // Language //

    static addLanguages(charID, id, langIDArray) {

        return Character.findOne({ where: { id: charID} })
        .then((character) => {

            return CharData.findOne({ where: { id: character.dataID} })
            .then((charData) => {

                let attrib = charData['dataLanguages'];

                let arrayStr = attrib;
                for(const langID of langIDArray) {
                    if(arrayStr == null || arrayStr == '') {
                        arrayStr = id+":"+langID;
                    } else {
                        arrayStr = arrayStr+","+id+":"+langID;
                    }
                }

                let dataUpVals = new Object;
                dataUpVals['dataLanguages'] = arrayStr;

                return CharData.update(dataUpVals, { where: { id: character.dataID } })
                .then((result) => {
                    return;
                });

            });

        });

    }

    static getLanguages(charID, id) {

        return Character.findOne({ where: { id: charID} })
        .then((character) => {

            return CharData.findOne({ where: { id: character.dataID} })
            .then((charData) => {

                let attrib = charData['dataLanguages'];

                if(attrib == null || attrib == '') {
                    return mapToObj(new Map());
                }

                let sections = attrib.split(",");

                let idMap = new Map();

                for(const section of sections){
                    let subsec = section.split(":");
                    let dataSrc = subsec[0];
                    let dataID = subsec[1];

                    if(id === "GET_ALL" || dataSrc === id){
                        if(idMap.has(dataSrc)){
                            let dataIDArray = idMap.get(dataSrc);
                            dataIDArray.push(dataID);
                            idMap.set(dataSrc, dataIDArray);
                        } else {
                            let dataIDArray = [];
                            dataIDArray.push(dataID);
                            idMap.set(dataSrc, dataIDArray);
                        }
                    }

                }

                // Find all languages from ID Array
                return Language.findAll()
                .then((languages) => {

                    let langMap = new Map();

                    for(const [dataSrc, dataIDArray] of idMap.entries()){
                        for(const dataID of dataIDArray){
                            let language = languages.find(language => {
                                return language.id == dataID;
                            });
                            if(langMap.has(dataSrc)){
                                let langDataArray = langMap.get(dataSrc);
                                langDataArray.push(language);
                                langMap.set(dataSrc, langDataArray);
                            } else {
                                let langDataArray = [];
                                langDataArray.push(language);
                                langMap.set(dataSrc, langDataArray);
                            }
                        }
                    }

                    return mapToObj(langMap);

                });

            });

        });

    }

    static replaceLanguages(charID, id, langIDArray) {

        return Character.findOne({ where: { id: charID} })
        .then((character) => {

            return CharData.findOne({ where: { id: character.dataID} })
            .then((charData) => {

                let attrib = charData['dataLanguages'];

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

                for(const langID of langIDArray) {
                    if(langID != null){
                        if(arrayStr === "") {
                            arrayStr = id+":"+langID;
                        } else {
                            arrayStr = arrayStr+","+id+":"+langID;
                        }
                    }
                }

                let dataUpVals = new Object;
                dataUpVals['dataLanguages'] = arrayStr;

                return CharData.update(dataUpVals, { where: { id: character.dataID } })
                .then((result) => {
                    return;
                });

            });

        });

    }

    static deleteLanguages(charID, id, contains) {
        // contains is true/false on whether the delete any records in which the id is present
       return Character.findOne({ where: { id: charID} })
       .then((character) => {

           return CharData.findOne({ where: { id: character.dataID} })
           .then((charData) => {

               let attrib = charData['dataLanguages'];

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

               let dataUpVals = new Object;
               dataUpVals['dataLanguages'] = arrayStr;

               return CharData.update(dataUpVals, { where: { id: character.dataID } })
               .then((result) => {
                   return;
               });

           });

       });

   }

    // Feat //

    static addFeats(charID, id, featIDArray) {

        return Character.findOne({ where: { id: charID} })
        .then((character) => {

            return CharData.findOne({ where: { id: character.dataID} })
            .then((charData) => {

                let attrib = charData['dataChosenFeats'];

                let arrayStr = attrib;
                for(const featID of featIDArray) {
                    if(arrayStr == null || arrayStr == '') {
                        arrayStr = id+":"+featID;
                    } else {
                        arrayStr = arrayStr+","+id+":"+featID;
                    }
                }

                let dataUpVals = new Object;
                dataUpVals['dataChosenFeats'] = arrayStr;

                return CharData.update(dataUpVals, { where: { id: character.dataID } })
                .then((result) => {
                    return;
                });

            });

        });

    }

    static getFeats(charID, id) {

        return Character.findOne({ where: { id: charID} })
        .then((character) => {

            return CharData.findOne({ where: { id: character.dataID} })
            .then((charData) => {

                let attrib = charData['dataChosenFeats'];

                if(attrib == null || attrib == '') {
                    return mapToObj(new Map());
                }

                let sections = attrib.split(",");

                let idMap = new Map();

                for(const section of sections){
                    let subsec = section.split(":");
                    let dataSrc = subsec[0];
                    let dataID = subsec[1];

                    if(id === "GET_ALL" || dataSrc === id){
                        if(idMap.has(dataSrc)){
                            let dataIDArray = idMap.get(dataSrc);
                            dataIDArray.push(dataID);
                            idMap.set(dataSrc, dataIDArray);
                        } else {
                            let dataIDArray = [];
                            dataIDArray.push(dataID);
                            idMap.set(dataSrc, dataIDArray);
                        }
                    }

                }

                // Find all feats from ID Array
                return Feat.findAll()
                .then((feats) => {

                    let featMap = new Map();

                    for(const [dataSrc, dataIDArray] of idMap.entries()){
                        for(const dataID of dataIDArray){
                            let feat = feats.find(feat => {
                                return feat.id == dataID;
                            });
                            if(featMap.has(dataSrc)){
                                let featDataArray = featMap.get(dataSrc);
                                featDataArray.push(feat);
                                featMap.set(dataSrc, featDataArray);
                            } else {
                                let featDataArray = [];
                                featDataArray.push(feat);
                                featMap.set(dataSrc, featDataArray);
                            }
                        }
                    }

                    return mapToObj(featMap);

                });

            });

        });

    }

    static replaceFeats(charID, id, featIDArray) {

        return Character.findOne({ where: { id: charID} })
        .then((character) => {

            return CharData.findOne({ where: { id: character.dataID} })
            .then((charData) => {

                let attrib = charData['dataChosenFeats'];

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

                for(const featID of featIDArray) {
                    if(featID != null){
                        if(arrayStr === "") {
                            arrayStr = id+":"+featID;
                        } else {
                            arrayStr = arrayStr+","+id+":"+featID;
                        }
                    }
                }

                let dataUpVals = new Object;
                dataUpVals['dataChosenFeats'] = arrayStr;

                return CharData.update(dataUpVals, { where: { id: character.dataID } })
                .then((result) => {
                    return;
                });

            });

        });

    }

    static deleteFeats(charID, id, contains) {
        // contains is true/false on whether the delete any records in which the id is present
       return Character.findOne({ where: { id: charID} })
       .then((character) => {

           return CharData.findOne({ where: { id: character.dataID} })
           .then((charData) => {

               let attrib = charData['dataChosenFeats'];

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

               let dataUpVals = new Object;
               dataUpVals['dataChosenFeats'] = arrayStr;

               return CharData.update(dataUpVals, { where: { id: character.dataID } })
               .then((result) => {
                   return;
               });

           });

       });

   }


    // Ability Choice "C:3=6,C:7=11" (selectorAbility=selectOptionAbility)

    static addAbilityChoice(charID, id, abilityChoiceArray) {

        return Character.findOne({ where: { id: charID} })
        .then((character) => {

            return CharData.findOne({ where: { id: character.dataID} })
            .then((charData) => {

                let attrib = charData['dataAbilityChoices'];
                
                let arrayStr = attrib;
                for(const abilityChoice of abilityChoiceArray) {
                    if(arrayStr == null || arrayStr == '') {
                        arrayStr = id+":"+abilityChoice.SelectorAbility+"="+abilityChoice.SelectOptionAbility;
                    } else {
                        arrayStr = arrayStr+","+id+":"+abilityChoice.SelectorAbility+"="+abilityChoice.SelectOptionAbility;
                    }
                }

                let dataUpVals = new Object;
                dataUpVals['dataAbilityChoices'] = arrayStr;

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

               let attrib = charData['dataAbilityChoices'];

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

               let dataUpVals = new Object;
               dataUpVals['dataAbilityChoices'] = arrayStr;

               return CharData.update(dataUpVals, { where: { id: character.dataID } })
               .then((result) => {
                   return;
               });

           });

       });

   }

    static replaceAbilityChoice(charID, id, abilityChoiceArray) {

        return Character.findOne({ where: { id: charID} })
        .then((character) => {

            return CharData.findOne({ where: { id: character.dataID} })
            .then((charData) => {

                let attrib = charData['dataAbilityChoices'];

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

                let dataUpVals = new Object;
                dataUpVals['dataAbilityChoices'] = arrayStr;

                return CharData.update(dataUpVals, { where: { id: character.dataID } })
                .then((result) => {
                    return;
                });

            });

        });

    }

    static getAbilityChoice(charID, id) {

        return Character.findOne({ where: { id: charID} })
        .then((character) => {

            return CharData.findOne({ where: { id: character.dataID} })
            .then((charData) => {

                let attrib = charData['dataAbilityChoices'];

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



    // Char Tags // charTags: "Human,Half-Elf,Elf"

    static addCharTag(charID, charTag) {

        return Character.findOne({ where: { id: charID} })
        .then((character) => {

            return CharData.findOne({ where: { id: character.dataID} })
            .then((charData) => {

                let attrib = charData['charTags'];

                let arrayStr = attrib;
                if(arrayStr == null || arrayStr == '') {
                    arrayStr = charTag;
                } else {
                    arrayStr = arrayStr+","+charTag;
                }

                let dataUpVals = new Object;
                dataUpVals['charTags'] = arrayStr;

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

                let attrib = charData['charTags'];

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

                let attrib = charData['charTags'];

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

                let dataUpVals = new Object;
                dataUpVals['charTags'] = arrayStr;

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

                let dataUpVals = new Object;
                dataUpVals[dataType] = arrayStr;

                return CharData.update(dataUpVals, { where: { id: character.dataID } })
                .then((result) => {
                    return;
                });
            });
        });
    }



};