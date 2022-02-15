
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

// Returns UserID or -1 if not logged in.
function getUserID(socket){
  if(socket.request.session.passport != null){
      return socket.request.session.passport.user;
  } else {
      return -1;
  }
}

module.exports = async function(socket, charID, character) {

  console.log('~ STARTING SHEET LOAD ~');

  socket.emit('updateLoadProgess', { message: 'Finding Character', upVal: 3 }); // (3/100) //
  if(character==null){
    character = await CharGathering.getCharacter(getUserID(socket), charID);
  }

  socket.emit('updateLoadProgess', { message: 'Opening Books', upVal: 1 }); // (4/100) //
  const sourcesArray = await CharGathering.getSourceBooks(getUserID(socket), character.enabledSources, character.enabledHomebrew);
  
  socket.emit('updateLoadProgess', { message: 'Discovering Backstory', upVal: 2 }); // (6/100) //
  const background = await CharGathering.getBackground(getUserID(socket), charID, character);

  socket.emit('updateLoadProgess', { message: 'Examining Ancestry', upVal: 3 }); // (9/100) //
  const ancestry = await CharGathering.getAncestry(getUserID(socket), charID, character);

  socket.emit('updateLoadProgess', { message: 'Examining Heritage', upVal: 3 }); // (12/100) //
  const heritage = await CharGathering.getHeritage(getUserID(socket), charID, character);

  socket.emit('updateLoadProgess', { message: 'Finding Conditions', upVal: 3 }); // (15/100) //
  const allConditions = await CharGathering.getAllConditions(getUserID(socket));

  socket.emit('updateLoadProgess', { message: 'Finding Languages', upVal: 3 }); // (18/100) //
  const allLanguages = await CharGathering.getAllLanguagesBasic(getUserID(socket), character.enabledHomebrew);

  socket.emit('updateLoadProgess', { message: 'Keeping Inventory', upVal: 8 }); // (26/100) //
  const invStruct = await CharGathering.getInventory(getUserID(socket), character.inventoryID);

  socket.emit('updateLoadProgess', { message: 'Indexing Traits', upVal: 5 }); // (31/100) //
  const tags = await CharGathering.getAllTags(getUserID(socket), character.enabledHomebrew);

  socket.emit('updateLoadProgess', { message: 'Discovering Spells', upVal: 5 }); // (36/100) //
  const spellMap = await CharGathering.getAllSpells(getUserID(socket), character.enabledSources, character.enabledHomebrew, spells=null, taggedSpells=null, tags);

  socket.emit('updateLoadProgess', { message: 'Bartering for Items', upVal: 15 }); // (51/100) //
  const itemMap = await CharGathering.getAllItems(getUserID(socket), character.enabledSources, character.enabledHomebrew, items=null, tags);

  socket.emit('updateLoadProgess', { message: 'Understanding Feats', upVal: 15 }); // (66/100) //
  const featObject = await CharGathering.getAllFeats(getUserID(socket), character.enabledSources, character.enabledHomebrew, feats=null, tags);

  socket.emit('updateLoadProgess', { message: 'Analyzing Ability Scores', upVal: 3 }); // (69/100) //
  const abilObject = await CharGathering.getAbilityScores(getUserID(socket), charID, charAbilityScores=null, bonusDataArray=null);

  socket.emit('updateLoadProgess', { message: 'Determining Skills', upVal: 6 }); // (75/100) //
  const skillObject = await CharGathering.getAllSkills(getUserID(socket), charID, skills=null, profDataArray=null, loreDataArray=null);

  socket.emit('updateLoadProgess', { message: 'Preparing Spellbook', upVal: 5 }); // (80/100) //
  const spellDataStruct = await CharGathering.getSpellData(getUserID(socket), charID);

  socket.emit('updateLoadProgess', { message: 'Considering Character Choices', upVal: 5 }); // (85/100) //
  const choiceStruct = await CharChoicesLoad(socket, charID, character, background, ancestry, heritage, ancestries=null, charTagsArray=null, classDetails=null, featDataArray=null, bonusDataArray=null, choiceDataArray=null, profDataArray=null, innateSpellDataArray=null, langDataArray=null, senseDataArray=null, phyFeatDataArray=null, loreDataArray=null, focusPointDataArray=null, profMap=null, domains=null, domainDataArray=null, advancedDomainDataArray=null, extraClassFeatures=null, heritageEffectsArray=null);

  socket.emit('updateLoadProgess', { message: 'Gathering Character Conditions', upVal: 2 }); // (87/100) //
  const conditionsObject = await CharGathering.getAllCharConditions(getUserID(socket), charID, charConditions=null);

  socket.emit('updateLoadProgess', { message: 'Training Companions', upVal: 2 }); // (89/100) //
  const companionData = await CharGathering.getCompanionData(getUserID(socket), charID, character.enabledSources, character.enabledHomebrew);

  socket.emit('updateLoadProgess', { message: 'Gathering Resistances and Weaknesses', upVal: 2 }); // (91/100) //
  const resistAndVulnerStruct = await CharGathering.getResistancesAndVulnerabilities(getUserID(socket), charID, resistancesDataArray=null, vulnerabilitiesDataArray=null);

  socket.emit('updateLoadProgess', { message: 'Gathering Specializations', upVal: 1 }); // (93/100) //
  const specializeStruct = await CharGathering.getSpecializations(getUserID(socket), charID, weapSpecialsDataArray=null, weapCriticalsDataArray=null, armorSpecialDataArray=null);

  socket.emit('updateLoadProgess', { message: 'Finding Unselected Options', upVal: 1 }); // (94/100) //
  const unselectedDataArray = await CharGathering.getAllUnselectedData(getUserID(socket), charID);

  socket.emit('updateLoadProgess', { message: 'Searching for Notebook', upVal: 2 }); // (95/100) //
  const notesDataArray = await CharGathering.getNoteFields(getUserID(socket), charID);

  socket.emit('updateLoadProgess', { message: 'Gathering Speeds', upVal: 1 }); // (96/100) //
  const speedsDataArray = await CharGathering.getOtherSpeeds(getUserID(socket), charID);

  socket.emit('updateLoadProgess', { message: 'Gathering Sheet States', upVal: 1 }); // (97/100) //
  const sheetStatesArray = await CharGathering.getSheetStates(getUserID(socket), character.enabledSources, character.enabledHomebrew);

  socket.emit('updateLoadProgess', { message: 'Gathering Weapon Familiarities', upVal: 2 }); // (99/100) //
  const familiaritiesDataArray = await CharGathering.getWeaponFamiliarities(getUserID(socket), charID);

  socket.emit('updateLoadProgess', { message: 'Locating Class Features', upVal: 1 }); // (100/100) //
  const allClassFeatureOptions = await CharGathering.getAllClassFeatureOptions(getUserID(socket), character.enabledSources, character.enabledHomebrew);

 // socket.emit('updateLoadProgess', { message: 'Finding Class Archetypes', upVal: 3 }); // (86/100) //
  const classArchetypeArray = await CharGathering.getAllClassArchetypes(getUserID(socket), character.enabledSources, character.enabledHomebrew);

  socket.emit('updateLoadProgess', { message: 'Finalizing', upVal: 10 }); // (110/100) //
  let charInfo = {
    Character : character,
    Background : background,
    Ancestry : ancestry,
    Heritage : heritage,
    AbilObject : abilObject,
    SkillObject : skillObject,
    FeatObject : featObject,
    SpellObject : mapToObj(spellMap),
    ChoiceStruct : choiceStruct,
    SpellDataStruct: spellDataStruct,
    InvStruct : invStruct,
    ItemObject : mapToObj(itemMap),
    ConditionsObject : conditionsObject,
    AllConditions : allConditions,
    AllLanguages : allLanguages,
    EnabledSources: sourcesArray,
    ResistAndVulners : resistAndVulnerStruct,
    SpecializeStruct : specializeStruct,
    WeaponFamiliarities : familiaritiesDataArray,
    NotesFields : notesDataArray,
    OtherSpeeds : speedsDataArray,
    AllTags : tags,
    CompanionData : companionData,
    AllClassFeatureOptions: allClassFeatureOptions,
    SheetStatesArray: sheetStatesArray,
    ClassArchetypeArray: classArchetypeArray,
    UnselectedDataArray: unselectedDataArray,
  };

  console.log('~ COMPLETE SHEET LOAD! ~');

  return JSON.stringify(charInfo);

};