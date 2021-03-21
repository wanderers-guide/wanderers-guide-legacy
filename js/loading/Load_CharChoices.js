
const Domain = require('./../../models/contentDB/Domain');
const Language = require('./../../models/contentDB/Language');
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

module.exports = async function(charID, character=null, background=null, ancestry=null, heritage=null, ancestries=null, charTagsArray=null, classDetails=null, featDataArray=null, bonusDataArray=null, choiceDataArray=null, profDataArray=null, innateSpellDataArray=null, langDataArray=null, senseDataArray=null, phyFeatDataArray=null, loreDataArray=null, focusPointDataArray=null, profMap=null, domains=null, domainDataArray=null, advancedDomainDataArray=null, extraClassFeatures=null, heritageEffectsArray=null) {

  console.log('~ STARTING CHAR-CHOICES LOAD ~');

  if(character==null){
    character = await CharGathering.getCharacter(charID);
  }

  if(background==null){
    background = await CharGathering.getBackground(charID, character);
  }

  if(ancestry==null){
    ancestry = await CharGathering.getAncestry(charID, character);
  }

  if(heritage==null){
    heritage = await CharGathering.getHeritage(charID, character);
  }

  if(ancestries==null){
    ancestries = await CharGathering.getAllAncestriesBasic(charID, character);
  }

  if(charTagsArray==null){
    charTagsArray = await CharTags.getTags(charID);
  }

  if(classDetails==null){
    classDetails = await CharGathering.getClass(charID, character.classID, character, cClass=null, keyBoostData=null);
  }

  if(featDataArray==null){
    featDataArray = await CharGathering.getChoicesFeats(charID);
  }

  if(bonusDataArray==null){
    bonusDataArray = await CharGathering.getChoicesAbilityBonus(charID);
  }

  if(choiceDataArray==null){
    choiceDataArray = await CharDataMappingExt.getDataAllClassChoice(charID);
  }

  if(profDataArray==null){
    profDataArray = await CharDataMappingExt.getDataAllProficiencies(charID);
  }

  if(innateSpellDataArray==null){
    innateSpellDataArray = await CharDataMappingExt.getDataAllInnateSpell(charID);
  }

  if(langDataArray==null){
    langDataArray = await CharDataMapping.getDataAll(charID,"languages",Language);
  }

  if(senseDataArray==null){
    senseDataArray = await CharDataMapping.getDataAll(charID,"senses",SenseType);
  }

  if(phyFeatDataArray==null){
    phyFeatDataArray = await CharDataMapping.getDataAll(charID,"phyFeats",PhysicalFeature);
  }

  if(loreDataArray==null){
    loreDataArray = await CharDataMapping.getDataAll(charID,"loreCategories",null);
  }

  if(focusPointDataArray==null){
    focusPointDataArray = await CharSpells.getFocusPoints(charID);
  }

  if(profMap==null){
    profMap = await CharGathering.getProfs(charID);
  }

  if(domains==null){
    domains = await CharGathering.getAllDomains(charID, character);
  }

  if(domainDataArray==null){
    domainDataArray = await CharGathering.getChoicesDomains(charID);
  }

  if(advancedDomainDataArray==null){
    advancedDomainDataArray = await CharDataMapping.getDataAll(charID,"advancedDomains",Domain);
  }

  if(extraClassFeatures==null){
    extraClassFeatures = await CharGathering.getAllExtraClassFeatures(charID);
  }

  if(heritageEffectsArray==null){
    heritageEffectsArray = await CharDataMapping.getDataAll(charID, "heritageExtra",null);
  }


  let choiceStruct = {
    Character: character,
    Heritage: heritage,
    Background: background,
    Ancestry: ancestry,
    ClassDetails: classDetails,
    CharTagsArray: charTagsArray,
    FeatArray: featDataArray,
    BonusArray: bonusDataArray,
    ChoiceArray: choiceDataArray,
    ProfArray: profDataArray,
    LangArray: langDataArray,
    SenseArray: senseDataArray,
    PhyFeatArray: phyFeatDataArray,
    InnateSpellArray: innateSpellDataArray,
    ProfObject: mapToObj(profMap),
    AllDomains: domains,
    AllAncestries: ancestries,
    DomainArray: domainDataArray,
    AdvancedDomainArray: advancedDomainDataArray,
    FocusPointArray: focusPointDataArray,
    LoreArray: loreDataArray,
    ExtraClassFeaturesArray: extraClassFeatures,
    HeritageEffectsArray: heritageEffectsArray,
  };

  console.log('~ COMPLETE CHAR-CHOICES LOAD! ~');

  return choiceStruct;


};