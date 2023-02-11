/*
const CharContentSources = require('./../CharContentSources');
const CharContentHomebrew = require('./../CharContentHomebrew');

const CharGathering = require('./../CharGathering');

const CharChoicesLoad = require('./Load_CharChoices');

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

module.exports = async function(userID, charID, character=null, featObject=null, itemMap=null, spellMap=null, skillObject=null, tags=null, abilObject=null, allConditions=null, allLanguages=null, unselectedDataArray=null, metaDataArray=null) {

  console.log('~ STARTING BUILDER-CORE LOAD ~');

  // socket.emit('updateLoadProgess', { message: 'Finding Character', upVal: 3 }); // (3/100) //
  if(character==null){
    character = await CharGathering.getCharacter(userID, charID);
  }

  // socket.emit('updateLoadProgess', { message: 'Opening Books', upVal: 2 }); // (5/100) //
  const sourcesArray = await CharGathering.getSourceBooks(userID, character.enabledSources, character.enabledHomebrew);

  // socket.emit('updateLoadProgess', { message: 'Indexing Traits', upVal: 5 }); // (10/100) //
  if(tags==null){
    tags = await CharGathering.getAllTags(userID, character.enabledHomebrew);
  }

  // socket.emit('updateLoadProgess', { message: 'Understanding Feats', upVal: 23 }); // (33/100) //
  if(featObject==null){
    featObject = await CharGathering.getAllFeats(userID, character.enabledSources, character.enabledHomebrew, feats=null, tags);
  }

  // socket.emit('updateLoadProgess', { message: 'Bartering for Items', upVal: 20 }); // (53/100) //
  if(itemMap==null){
    itemMap = await CharGathering.getAllItems(userID, character.enabledSources, character.enabledHomebrew, items=null, tags);
  }

  // socket.emit('updateLoadProgess', { message: 'Discovering Spells', upVal: 15 }); // (68/100) //
  if(spellMap==null){
    spellMap = await CharGathering.getAllSpells(userID, character.enabledSources, character.enabledHomebrew, spells=null, taggedSpells=null, tags);
  }

  // socket.emit('updateLoadProgess', { message: 'Determining Skills', upVal: 6 }); // (74/100) //
  if(skillObject==null){
    skillObject = await CharGathering.getAllSkills(userID, charID, skills=null, profDataArray=null, loreDataArray=null);
  }

  // socket.emit('updateLoadProgess', { message: 'Analyzing Ability Scores', upVal: 3 }); // (77/100) //
  if(abilObject==null){
    abilObject = await CharGathering.getAbilityScores(userID, charID, charAbilityScores=null, bonusDataArray=null);
  }

  // socket.emit('updateLoadProgess', { message: 'Finding Conditions', upVal: 1 }); // (78/100) //
  if(allConditions==null){
    allConditions = await CharGathering.getAllConditions(userID);
  }

  // socket.emit('updateLoadProgess', { message: 'Collecting Metadata', upVal: 2 }); // (80/100) //
  if(metaDataArray==null){
    metaDataArray = await CharGathering.getAllMetadata(userID, charID);
  }

  // socket.emit('updateLoadProgess', { message: 'Finding Languages', upVal: 2 }); // (82/100) //
  if(allLanguages==null){
    allLanguages = await CharGathering.getAllLanguagesBasic(userID, character.enabledHomebrew);
  }

  // socket.emit('updateLoadProgess', { message: 'Finding Unselected Options', upVal: 1 }); // (83/100) //
  if(unselectedDataArray==null){
    unselectedDataArray = await CharGathering.getAllUnselectedData(userID, charID);
  }

  // socket.emit('updateLoadProgess', { message: 'Finding Class Archetypes', upVal: 3 }); // (86/100) //
  const classArchetypeArray = await CharGathering.getAllClassArchetypes(userID, character.enabledSources, character.enabledHomebrew);

  // socket.emit('updateLoadProgess', { message: 'Considering Character Choices', upVal: 14 }); // (100/100) //
  const choiceStruct = await CharChoicesLoad(userID, charID, character, background=null, ancestry=null, heritage=null, ancestries=null, charTagsArray=null, classDetails=null, featDataArray=null, bonusDataArray=null, choiceDataArray=null, profDataArray=null, innateSpellDataArray=null, langDataArray=null, senseDataArray=null, phyFeatDataArray=null, loreDataArray=null, focusPointDataArray=null, profMap=null, domains=null, domainDataArray=null, advancedDomainDataArray=null, extraClassFeatures=null, heritageEffectsArray=null);


  // socket.emit('updateLoadProgess', { message: 'Finalizing', upVal: 10 }); // (110/100) //
  let builderCoreStruct = {
    FeatObject: featObject,
    SkillObject: skillObject,
    ItemObject: mapToObj(itemMap),
    SpellObject: mapToObj(spellMap),
    AbilObject: abilObject,
    AllTags: tags,
    AllConditions: allConditions,
    AllLanguages: allLanguages,
    EnabledSources: sourcesArray,
    UnselectedDataArray: unselectedDataArray,
    ClassArchetypeArray: classArchetypeArray,
    RawMetaDataArray: metaDataArray,
  };

  let bStruct = {
    builderCore: builderCoreStruct,
    choiceStruct: choiceStruct,
  };

  console.log('~ COMPLETE BUILDER-CORE LOAD! ~');

  return bStruct;

};

*/
