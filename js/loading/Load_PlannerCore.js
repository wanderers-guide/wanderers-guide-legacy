
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

module.exports = async function(socket) {

  console.log('~ STARTING PLANNER-CORE LOAD ~');

  socket.emit('updateLoadProgess', { message: 'Gathering Skills', upVal: 5 }); // (5/100) //
  const skillObject = await GeneralGathering.getAllSkills(getUserID(socket));

  socket.emit('updateLoadProgess', { message: 'Understanding Feats', upVal: 20 }); // (25/100) //
  const featsObject = await GeneralGathering.getAllFeats(getUserID(socket));

  socket.emit('updateLoadProgess', { message: 'Bartering for Items', upVal: 10 }); // (35/100) //
  const itemMap = await GeneralGathering.getAllItems(getUserID(socket));

  socket.emit('updateLoadProgess', { message: 'Discovering Spells', upVal: 10 }); // (45/100) //
  const spellMap = await GeneralGathering.getAllSpells(getUserID(socket));

  socket.emit('updateLoadProgess', { message: 'Finding Languages', upVal: 5 }); // (50/100) //
  const allLanguages = await GeneralGathering.getAllLanguages(getUserID(socket));

  socket.emit('updateLoadProgess', { message: 'Finding Conditions', upVal: 5 }); // (55/100) //
  const allConditions = await GeneralGathering.getAllConditions(getUserID(socket));

  socket.emit('updateLoadProgess', { message: 'Indexing Traits', upVal: 5 }); // (60/100) //
  const allTags = await GeneralGathering.getAllTags(getUserID(socket));

  socket.emit('updateLoadProgess', { message: 'Loading Classes', upVal: 10 }); // (70/100) //
  const classes = await GeneralGathering.getAllClasses(getUserID(socket));

  socket.emit('updateLoadProgess', { message: 'Loading Ancestries', upVal: 10 }); // (80/100) //
  const ancestries = await GeneralGathering.getAllAncestries(getUserID(socket));

  socket.emit('updateLoadProgess', { message: 'Loading Backgrounds', upVal: 5 }); // (85/100) //
  const backgrounds = await GeneralGathering.getAllBackgrounds(getUserID(socket));

  socket.emit('updateLoadProgess', { message: 'Loading Archetypes', upVal: 5 }); // (90/100) //
  const archetypes = await GeneralGathering.getAllArchetypes(getUserID(socket));

  socket.emit('updateLoadProgess', { message: 'Loading Heritages', upVal: 5 }); // (95/100) //
  const uniHeritages = await GeneralGathering.getAllUniHeritages(getUserID(socket));

  socket.emit('updateLoadProgess', { message: 'Loading Physical Features', upVal: 0 }); // (95/100) //
  const allPhyFeats = await Prisma.physicalFeatures.findMany();

  socket.emit('updateLoadProgess', { message: 'Loading Senses', upVal: 0 }); // (95/100) //
  const allSenses = await Prisma.senseTypes.findMany();

  //socket.emit('updateLoadProgess', { message: 'Discovering Domains', upVal: 0 }); // (95/100) //
  //const allDomains = await CharGathering.getAllDomains(getUserID(socket), charID, character);
  
  //socket.emit('updateLoadProgess', { message: 'Finding Class Archetypes', upVal: 3 }); // (86/100) //
  //const classArchetypes = await CharGathering.getAllClassArchetypes(getUserID(socket), charID);

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
    //classArchetypes,
    allPhyFeats,
    allSenses,
  };

  console.log('Starting char data...');
  let charID = 60423;
  return CharGathering.getCharacter(getUserID(socket), charID)
    .then((character) => {
      return Inventory.findOne({ where: { id: character.inventoryID} })
      .then((inventory) => {
        return InvItem.findAll({ where: { invID: inventory.id} })
        .then((invItems) => {
          return CharGathering.getAllMetadata(getUserID(socket), charID)
          .then((charMetaData) => {
            return CharGathering.getCharAnimalCompanions(getUserID(socket), charID)
            .then((charAnimalCompanions) => {
              return CharGathering.getCharFamiliars(getUserID(socket), charID)
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