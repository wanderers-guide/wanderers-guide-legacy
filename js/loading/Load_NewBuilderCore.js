
const GeneralGathering = require('../GeneralGathering');
const CharGathering = require('../CharGathering');

const Inventory = require('./../../models/contentDB/Inventory');
const InvItem = require('./../../models/contentDB/InvItem');
const CharCondition = require('./../../models/contentDB/CharCondition');
const NoteField = require('./../../models/contentDB/NoteField');
const SpellBookSpell = require('./../../models/contentDB/SpellBookSpell');
const PhysicalFeature = require('./../../models/contentDB/PhysicalFeature');


const { Prisma } = require('../PrismaConnection');

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

module.exports = async function(socket, charID=null) {

  const userID = getUserID(socket);
  console.log('~ STARTING NEW BUILDER-CORE LOAD ~');

  let character;
  if(charID != null){
    character = await CharGathering.getCharacter(userID, charID);
  }

  socket.emit('updateLoadProgess', { message: 'Opening Books', upVal: 2 }); // (2/100) //
  let sourceBooks = await GeneralGathering.getSourceBooks(userID);

  socket.emit('updateLoadProgess', { message: 'Gathering Skills', upVal: 3 }); // (5/100) //
  let skillObject = await GeneralGathering.getAllSkills(userID);
  // Always gets GeneralGathering skills_map

  socket.emit('updateLoadProgess', { message: 'Indexing Traits', upVal: 5 }); // (60/100) //
  let allTags;
  if(charID == null){
    allTags = await GeneralGathering.getAllTags(userID);
  } else {
    allTags = await CharGathering.getAllTags(userID, charID, character);
  }

  socket.emit('updateLoadProgess', { message: 'Understanding Feats', upVal: 20 }); // (25/100) //
  let featsObject;
  if(charID == null){
    featsObject = await GeneralGathering.getAllFeats(userID);
  } else {
    featsObject = await CharGathering.getAllFeats(userID, charID, character, feats=null, allTags);
  }

  socket.emit('updateLoadProgess', { message: 'Bartering for Items', upVal: 10 }); // (35/100) //
  let itemMap;
  if(charID == null){
    itemMap = await GeneralGathering.getAllItems(userID);
  } else {
    itemMap = await CharGathering.getAllItems(userID, charID, character, items=null, allTags);
  }

  socket.emit('updateLoadProgess', { message: 'Discovering Spells', upVal: 10 }); // (45/100) //
  let spellMap;
  if(charID == null){
    spellMap = await GeneralGathering.getAllSpells(userID);
  } else {
    spellMap = await CharGathering.getAllSpells(userID, charID, character, spells=null, taggedSpells=null, allTags);
  }

  socket.emit('updateLoadProgess', { message: 'Finding Languages', upVal: 5 }); // (50/100) //
  let allLanguages;
  if(charID == null){
    allLanguages = await GeneralGathering.getAllLanguages(userID);
  } else {
    allLanguages = await CharGathering.getAllLanguagesBasic(userID, charID, character);
  }

  socket.emit('updateLoadProgess', { message: 'Finding Conditions', upVal: 5 }); // (55/100) //
  let allConditions;
  if(charID == null){
    allConditions = await GeneralGathering.getAllConditions(userID);
  } else {
    allConditions = await CharGathering.getAllConditions(userID);
  }

  socket.emit('updateLoadProgess', { message: 'Loading Classes', upVal: 10 }); // (70/100) //
  let classes;
  if(charID == null){
    classes = await GeneralGathering.getAllClasses(userID);
  } else {
    classes = await CharGathering.getAllClasses(userID, charID);
  }

  socket.emit('updateLoadProgess', { message: 'Loading Ancestries', upVal: 10 }); // (80/100) //
  let ancestries;
  if(charID == null){
    ancestries = await GeneralGathering.getAllAncestries(userID);
  } else {
    ancestries = await CharGathering.getAllAncestries(userID, charID, true);
  }

  socket.emit('updateLoadProgess', { message: 'Loading Backgrounds', upVal: 5 }); // (85/100) //
  let backgrounds;
  if(charID == null){
    backgrounds = await GeneralGathering.getAllBackgrounds(userID);
  } else {
    backgrounds = await CharGathering.getAllBackgrounds(userID, charID, character);
  }

  socket.emit('updateLoadProgess', { message: 'Loading Archetypes', upVal: 5 }); // (90/100) //
  let archetypes;
  if(charID == null){
    archetypes = await GeneralGathering.getAllArchetypes(userID);
  } else {
    archetypes = await CharGathering.getAllArchetypes(userID, charID);
  }

  socket.emit('updateLoadProgess', { message: 'Loading Heritages', upVal: 5 }); // (95/100) //
  let uniHeritages;
  if(charID == null){
    uniHeritages = await GeneralGathering.getAllUniHeritages(userID);
  } else {
    uniHeritages = await CharGathering.getAllUniHeritages(userID, charID);
  }

  socket.emit('updateLoadProgess', { message: 'Loading Physical Features', upVal: 0 }); // (95/100) //
  let allPhyFeats = await CharGathering.getAllPhysicalFeatures(userID);

  socket.emit('updateLoadProgess', { message: 'Loading Senses', upVal: 0 }); // (95/100) //
  let allSenses = await CharGathering.getAllSenses(userID);

  socket.emit('updateLoadProgess', { message: 'Discovering Domains', upVal: 0 }); // (95/100) //
  let allDomains;
  if(charID != null){
    allDomains = await CharGathering.getAllDomains(userID, charID, character);
  }
  
  socket.emit('updateLoadProgess', { message: 'Finding Class Archetypes', upVal: 3 }); // (86/100) //
  let classArchetypes;
  if(charID != null){
    classArchetypes = await CharGathering.getAllClassArchetypes(userID, charID);
  }

  socket.emit('updateLoadProgess', { message: 'Finalizing', upVal: 10 }); // (105/100) //
  const plannerStruct = {
    featsObject,
    skillObject,
    itemObject: mapToObj(itemMap),
    spellObject: mapToObj(spellMap),
    allLanguages,
    allConditions,
    allTags,
    classes,
    ancestries,
    archetypes,
    backgrounds,
    uniHeritages,
    classArchetypes,
    allDomains,
    allPhyFeats,
    allSenses,
    sourceBooks,
  };

  console.log('Starting char data...');
  return CharGathering.getCharacter(userID, charID)
    .then((character) => {
      return Inventory.findOne({ where: { id: character.inventoryID} })
      .then((inventory) => {
        return InvItem.findAll({ where: { invID: inventory.id} })
        .then((invItems) => {
          return CharGathering.getAllMetadata(userID, charID)
          .then((charMetaData) => {
            return CharGathering.getCharAnimalCompanions(userID, charID)
            .then((charAnimalCompanions) => {
              return CharGathering.getCharFamiliars(userID, charID)
              .then((charFamiliars) => {
                return CharCondition.findAll({ where: { charID: charID} })
                .then((charConditions) => {
                  return NoteField.findAll({ where: { charID: charID } })
                  .then(function(noteFields) {
                    return SpellBookSpell.findAll({ where: { charID: charID } })
                    .then(function(spellBookSpells) {

                      const choiceStruct = {
                        character,
                        inventory,
                        invItems,
                        charMetaData,
                        charAnimalCompanions,
                        charFamiliars,
                        charConditions,
                        noteFields,
                        spellBookSpells,
                      };
                    
                      console.log('~ COMPLETE PLANNER-CORE LOAD! ~');
                    
                      return {plannerStruct, choiceStruct};

                    });
                  });
                });
              });
            });
          });
        });
      });
    });

};