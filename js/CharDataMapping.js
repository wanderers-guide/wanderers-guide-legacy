
const { Op } = require("sequelize");

const CharDataMappingModel = require('../models/contentDB/CharDataMapping');

module.exports = class CharDataMapping {

    /*
    Types of sourceCodes:
            - none
            - inits-#
            - inits-phyFeat-#
            - inits-bonus-#
            - inits-misc-#
            - ancestryFeat-#
            - classAbility-#
            - classAbilitySelector-#
            - boost-choose
            - boost-nonChoose-#
            - flaw-nonChoose-#
        
        Special (Single) Cases:
            - heritage
            - background
            - keyAbility
            - classArchetype

    
    */

    static setData(charID, source, srcStruct, value, deleteSelfData=true){
        //console.log("Set and Delete SNum - Source:"+source+" Value:"+value);
        //console.log(srcStruct);
        return CharDataMapping.deleteDataSNumChildren(charID, srcStruct)
        .then((result) => {
          if(deleteSelfData){
            return CharDataMappingModel.destroy({
              where: {
                  charID,
                  sourceType: srcStruct.sourceType,
                  sourceLevel: srcStruct.sourceLevel,
                  sourceCode: srcStruct.sourceCode,
                  sourceCodeSNum: srcStruct.sourceCodeSNum,
              }
            }).then((result) => {
              return CharDataMappingModel.upsert({
                charID,
                source,
                sourceType: srcStruct.sourceType,
                sourceLevel: srcStruct.sourceLevel,
                sourceCode: srcStruct.sourceCode,
                sourceCodeSNum: srcStruct.sourceCodeSNum,
                value,
              }).then(result => {
                  return;
              });
            });
          } else {
            return CharDataMappingModel.upsert({
              charID,
              source,
              sourceType: srcStruct.sourceType,
              sourceLevel: srcStruct.sourceLevel,
              sourceCode: srcStruct.sourceCode,
              sourceCodeSNum: srcStruct.sourceCodeSNum,
              value,
            }).then(result => {
                return;
            });
          }
        });
    }

    static getDataSingle(charID, source, srcStruct){
        //console.log("Get Single - "+source);
        return CharDataMappingModel.findOne({
            where: {
                charID,
                source,
                sourceType: srcStruct.sourceType,
                sourceLevel: srcStruct.sourceLevel,
                sourceCode: srcStruct.sourceCode,
                sourceCodeSNum: srcStruct.sourceCodeSNum,
            },
            raw: true,
        }).then((charData) => {
            //console.log(charData);
            if(charData != null){
                return charData;
            } else {
                return null;
            }
        });
    }

    static getDataAll(charID, source, ModelForMap){
      //console.log("Get All - "+source);
      if(ModelForMap != null){
        ModelForMap.hasMany(CharDataMappingModel, {foreignKey: 'value'});
        CharDataMappingModel.belongsTo(ModelForMap, {foreignKey: 'value'});
        return CharDataMappingModel.findAll({
          where: {
            charID,
            source,
          },
          raw: true,
          include: {
            model: ModelForMap,
          }
        }).then(dataArray => {
          let newDataArray = [];
          for(let data of dataArray){
            let isNull = true;
            let dataValue = {};
            for(let dPart of Object.keys(data)){
              if(dPart.includes('.')){
                if(data[dPart] != null) {isNull = false;}
                let lastPart = dPart.split('.')[1];
                dataValue[lastPart] = data[dPart];
              }
            }
            if(isNull){ dataValue = null; }
            newDataArray.push({
              charID: data.charID,
              source: data.source,
              sourceType: data.sourceType,
              sourceLevel: data.sourceLevel,
              sourceCode: data.sourceCode,
              sourceCodeSNum: data.sourceCodeSNum,
              value: dataValue,
            });
          }
          return newDataArray;
        });
      } else {
        return CharDataMappingModel.findAll({
          where: {
            charID,
            source,
          },
          raw: true,
        }).then((dataArray) => {
          return dataArray;
        });
      }
    }


    static deleteData(charID, source, srcStruct){
        //console.log("Delete and Delete SNum - Source:"+source);
        //console.log(srcStruct);
        return CharDataMapping.deleteDataSNumChildren(charID, srcStruct)
        .then((result) => {
            return CharDataMappingModel.destroy({
                where: {
                    charID,
                    source,
                    sourceType: srcStruct.sourceType,
                    sourceLevel: srcStruct.sourceLevel,
                    sourceCode: srcStruct.sourceCode,
                    sourceCodeSNum: srcStruct.sourceCodeSNum,
                }
            }).then((result) => {
                return;
            });
        });
    }

    static deleteDataOnly(charID, source, srcStruct){
      //console.log("Delete Only - Source:"+source);
      //console.log(srcStruct);
      return CharDataMappingModel.destroy({
        where: {
            charID,
            source,
            sourceType: srcStruct.sourceType,
            sourceLevel: srcStruct.sourceLevel,
            sourceCode: srcStruct.sourceCode,
            sourceCodeSNum: srcStruct.sourceCodeSNum,
        }
      }).then((result) => {
        return;
      });
    }

    static deleteDataBySourceStruct(charID, srcStruct){
        //console.log("Delete and Delete SNum - Source:"+source);
        //console.log(srcStruct);
        return CharDataMapping.deleteDataSNumChildren(charID, srcStruct)
        .then((result) => {
            return CharDataMappingModel.destroy({
                where: {
                    charID,
                    sourceType: srcStruct.sourceType,
                    sourceLevel: srcStruct.sourceLevel,
                    sourceCode: srcStruct.sourceCode,
                    sourceCodeSNum: srcStruct.sourceCodeSNum,
                }
            }).then((result) => {
                return;
            });
        });
    }

    static deleteDataSNumChildren(charID, srcStruct){
        return CharDataMappingModel.destroy({
            where: {
                charID,
                sourceType: srcStruct.sourceType,
                sourceLevel: srcStruct.sourceLevel,
                sourceCode: srcStruct.sourceCode,
                sourceCodeSNum: {
                    [Op.endsWith]: srcStruct.sourceCodeSNum,
                },
                [Op.not]: [
                    { sourceCodeSNum: srcStruct.sourceCodeSNum },
                ]
            }
        }).then((result) => {
            return;
        });
    }

    static deleteDataBySource(charID, source){
        //console.log("Delete by Source - "+source);
        return CharDataMappingModel.destroy({
            where: {
                charID,
                source,
            }
        }).then((result) => {
            return;
        });
    }

    static deleteDataBySourceType(charID, sourceType){
        //console.log("Delete by SourceType - "+sourceType);
        return CharDataMappingModel.destroy({
            where: {
                charID,
                sourceType,
            }
        }).then((result) => {
            return;
        });
    }

    static deleteDataBySourceAndType(charID, source, sourceType){
        //console.log("Delete by Source and Type - "+source+" "+sourceType);
        return CharDataMappingModel.destroy({
            where: {
                charID,
                source,
                sourceType,
            }
        }).then((result) => {
            return;
        });
    }

    static deleteDataByGreaterThanSourceLevel(charID, level){
        //console.log("Delete by Greater Than Level - "+level);
        return CharDataMappingModel.destroy({
            where: {
                charID,
                sourceLevel: {
                    [Op.gt]: level
                },
            }
        }).then((result) => {
            return;
        });
    }

    static deleteDataBySourceCode(charID, sourceCode){
        //console.log("Delete by SourceCode - "+sourceCode);
        return CharDataMappingModel.destroy({
            where: {
                charID,
                sourceCode,
                // Ignores sourceCodeSNum
            }
        }).then((result) => {
            return;
        });
    }

};
