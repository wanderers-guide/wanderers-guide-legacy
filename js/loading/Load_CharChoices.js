
const Domain = require('./../../models/contentDB/Domain');
const Language = require('./../../models/contentDB/Language');
const Heritage = require('./../../models/contentDB/Heritage');
const SenseType = require('./../../models/contentDB/SenseType');
const PhysicalFeature = require('./../../models/contentDB/PhysicalFeature');

const CharDataMapping = require('./../CharDataMapping');
const CharDataMappingExt = require('./../CharDataMappingExt');

const CharGathering = require('./../CharGathering');
const CharTags = require('./../CharTags');
const CharSpells = require('./../CharSpells');

const { Prisma } = require('./../PrismaConnection');

function mapToObj(strMap) {
  let obj = Object.create(null);
  for (let [k,v] of strMap) {
    // We don’t escape the key '__proto__'
    // which can cause problems on older engines
    obj[k] = v;
  }
  return obj;
}

module.exports = async function(userID, charID, character=null, background=null, ancestry=null, heritage=null, ancestries=null, charTagsArray=null, classDetails=null, featDataArray=null, bonusDataArray=null, choiceDataArray=null, profDataArray=null, innateSpellDataArray=null, langDataArray=null, senseDataArray=null, phyFeatDataArray=null, loreDataArray=null, scfsDataArray=null, focusPointDataArray=null, profMap=null, domains=null, domainDataArray=null, advancedDomainDataArray=null, extraClassFeatures=null, heritageEffectsArray=null) {

  console.log('~ STARTING CHAR-CHOICES LOAD ~');

  if(character==null){
    character = await CharGathering.getCharacter(userID, charID);
  }

  if(background==null){
    background = CharGathering.getBackground(userID, charID, character);
  }

  if(ancestry==null){
    ancestry = CharGathering.getAncestry(userID, charID, character);
  }

  if(heritage==null){
    heritage = CharGathering.getHeritage(userID, charID, character);
  }

  if(ancestries==null){
    ancestries = CharGathering.getAllAncestriesBasic(userID, character.enabledSources, character.enabledHomebrew);
  }

  if(charTagsArray==null){
    charTagsArray = CharTags.getTags(charID);
  }

  if(classDetails==null){
    classDetails = CharGathering.getClass(userID, charID, character.classID, character.enabledSources, character.enabledHomebrew);
  }

  if(featDataArray==null){
    featDataArray = CharGathering.getChoicesFeats(userID, charID);
  }

  if(bonusDataArray==null){
    bonusDataArray = CharGathering.getChoicesAbilityBonus(userID, charID);
  }

  if(choiceDataArray==null){
    choiceDataArray = CharDataMappingExt.getDataAllClassChoice(charID);
  }

  if(profDataArray==null){
    profDataArray = CharDataMappingExt.getDataAllProficiencies(charID);
  }

  if(innateSpellDataArray==null){
    innateSpellDataArray = CharDataMappingExt.getDataAllInnateSpell(charID);
  }

  if(langDataArray==null){
    langDataArray = CharDataMapping.getDataAll(charID,"languages",Language);
  }

  if(senseDataArray==null){
    senseDataArray = CharDataMapping.getDataAll(charID,"senses",SenseType);
  }

  if(phyFeatDataArray==null){
    phyFeatDataArray = CharDataMapping.getDataAll(charID,"phyFeats",PhysicalFeature);
  }

  if(loreDataArray==null){
    loreDataArray = CharDataMapping.getDataAll(charID,"loreCategories",null);
  }

  if(scfsDataArray==null){
    scfsDataArray = CharDataMapping.getDataAll(charID,"scfs",null);
  }

  if(focusPointDataArray==null){
    focusPointDataArray = CharSpells.getFocusPoints(charID);
  }

  if(profMap==null){
    profMap = CharGathering.getProfs(userID, charID);
  }

  if(domains==null){
    domains = CharGathering.getAllDomains(userID, character.enabledSources, character.enabledHomebrew);
  }

  if(domainDataArray==null){
    domainDataArray = CharGathering.getChoicesDomains(userID, charID);
  }

  if(advancedDomainDataArray==null){
    advancedDomainDataArray = CharDataMapping.getDataAll(charID,"advancedDomains",Domain);
  }

  if(extraClassFeatures==null){
    extraClassFeaturesArray = CharGathering.getAllExtraClassFeatures(userID, charID);
  }

  if(heritageEffectsArray==null){
    heritageEffectsArray = CharDataMapping.getDataAll(charID,"heritageExtra",Heritage);
  }

  const classArchetypeID = CharGathering.getClassArchetypeID(userID, charID);

  let promise = await Promise.all([heritage,background,ancestry,classDetails,charTagsArray,featDataArray,bonusDataArray,choiceDataArray,profDataArray,langDataArray,senseDataArray,phyFeatDataArray,innateSpellDataArray,profMap,domains,ancestries,domainDataArray,advancedDomainDataArray,scfsDataArray,focusPointDataArray,loreDataArray,extraClassFeaturesArray,heritageEffectsArray,classArchetypeID]);

  let choiceStruct = {
    Character: character,
    Heritage: promise[0],
    Background: promise[1],
    Ancestry: promise[2],
    ClassDetails: promise[3],
    CharTagsArray: promise[4],
    FeatArray: promise[5],
    BonusArray: promise[6],
    ChoiceArray: promise[7],
    ProfArray: promise[8],
    LangArray: promise[9],
    SenseArray: promise[10],
    PhyFeatArray: promise[11],
    InnateSpellArray: promise[12],
    ProfObject: mapToObj(promise[13]),
    AllDomains: promise[14],
    AllAncestries: promise[15],
    DomainArray: promise[16],
    AdvancedDomainArray: promise[17],
    SCFSDataArray: promise[18],
    FocusPointArray: promise[19],
    LoreArray: promise[20],
    ExtraClassFeaturesArray: promise[21],
    HeritageEffectsArray: promise[22],
    ClassArchetypeID: promise[23],
  };

  console.log('~ COMPLETE CHAR-CHOICES LOAD! ~');

  return choiceStruct;


};