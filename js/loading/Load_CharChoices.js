
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

// Returns UserID or -1 if not logged in.
function getUserID(socket){
  if(socket.request.session.passport != null){
      return socket.request.session.passport.user;
  } else {
      return -1;
  }
}

module.exports = async function(socket, charID, character=null, background=null, ancestry=null, heritage=null, ancestries=null, charTagsArray=null, classDetails=null, featDataArray=null, bonusDataArray=null, choiceDataArray=null, profDataArray=null, innateSpellDataArray=null, langDataArray=null, senseDataArray=null, phyFeatDataArray=null, loreDataArray=null, scfsDataArray=null, focusPointDataArray=null, profMap=null, domains=null, domainDataArray=null, advancedDomainDataArray=null, extraClassFeatures=null, heritageEffectsArray=null) {

  console.log('~ STARTING CHAR-CHOICES LOAD ~');

  if(character==null){
    character = await CharGathering.getCharacter(getUserID(socket), charID);
  }

  if(background==null){
    background = await CharGathering.getBackground(getUserID(socket), charID, character);
  }

  if(ancestry==null){
    ancestry = await CharGathering.getAncestry(getUserID(socket), charID, character);
  }

  if(heritage==null){
    heritage = await CharGathering.getHeritage(getUserID(socket), charID, character);
  }

  if(ancestries==null){
    ancestries = await CharGathering.getAllAncestriesBasic(getUserID(socket), charID, character);
  }

  if(charTagsArray==null){
    charTagsArray = await CharTags.getTags(charID);
  }

  if(classDetails==null){
    classDetails = await CharGathering.getClass(getUserID(socket), charID, character.classID, character, cClass=null, keyBoostData=null);
  }

  if(featDataArray==null){
    featDataArray = await CharGathering.getChoicesFeats(getUserID(socket), charID);
  }

  if(bonusDataArray==null){
    bonusDataArray = await CharGathering.getChoicesAbilityBonus(getUserID(socket), charID);
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

  if(scfsDataArray==null){
    scfsDataArray = await CharDataMapping.getDataAll(charID,"scfs",null);
  }

  if(focusPointDataArray==null){
    focusPointDataArray = await CharSpells.getFocusPoints(charID);
  }

  if(profMap==null){
    profMap = await CharGathering.getProfs(getUserID(socket), charID);
  }

  if(domains==null){
    domains = await CharGathering.getAllDomains(getUserID(socket), charID, character);
  }

  if(domainDataArray==null){
    domainDataArray = await CharGathering.getChoicesDomains(getUserID(socket), charID);
  }

  if(advancedDomainDataArray==null){
    advancedDomainDataArray = await CharDataMapping.getDataAll(charID,"advancedDomains",Domain);
  }

  if(extraClassFeatures==null){
    extraClassFeatures = await CharGathering.getAllExtraClassFeatures(getUserID(socket), charID);
  }

  if(heritageEffectsArray==null){
    heritageEffectsArray = await CharDataMapping.getDataAll(charID,"heritageExtra",Heritage);
  }

  const classArchetypeID = await CharGathering.getClassArchetypeID(getUserID(socket), charID);


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
    SCFSDataArray: scfsDataArray,
    FocusPointArray: focusPointDataArray,
    LoreArray: loreDataArray,
    ExtraClassFeaturesArray: extraClassFeatures,
    HeritageEffectsArray: heritageEffectsArray,
    ClassArchetypeID: classArchetypeID,
  };

  console.log('~ COMPLETE CHAR-CHOICES LOAD! ~');

  return choiceStruct;


};