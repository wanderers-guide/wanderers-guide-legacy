
const GeneralGathering = require('./../GeneralGathering');

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

module.exports = async function(socket) {

  console.log('~ STARTING SEARCH LOAD ~');

  socket.emit('updateLoadProgess', { message: 'Opening Books', upVal: 2 }); // (2/100) //
  const sourceBooks = await GeneralGathering.getSourceBooks(getUserID(socket));

  socket.emit('updateLoadProgess', { message: 'Gathering Skills', upVal: 3 }); // (5/100) //
  const skillObject = await GeneralGathering.getAllSkills(getUserID(socket), null);

  socket.emit('updateLoadProgess', { message: 'Understanding Feats', upVal: 20 }); // (25/100) //
  const featsObject = await GeneralGathering.getAllFeats(getUserID(socket), null);

  socket.emit('updateLoadProgess', { message: 'Bartering for Items', upVal: 10 }); // (35/100) //
  const itemMap = await GeneralGathering.getAllItems(getUserID(socket), null);

  socket.emit('updateLoadProgess', { message: 'Discovering Spells', upVal: 10 }); // (45/100) //
  const spellMap = await GeneralGathering.getAllSpells(getUserID(socket), null);

  socket.emit('updateLoadProgess', { message: 'Finding Languages', upVal: 5 }); // (50/100) //
  const allLanguages = await GeneralGathering.getAllLanguages(getUserID(socket), null);

  socket.emit('updateLoadProgess', { message: 'Finding Conditions', upVal: 5 }); // (55/100) //
  const allConditions = await GeneralGathering.getAllConditions(getUserID(socket), null);

  socket.emit('updateLoadProgess', { message: 'Indexing Traits', upVal: 5 }); // (60/100) //
  const allTags = await GeneralGathering.getAllTags(getUserID(socket), null);

  socket.emit('updateLoadProgess', { message: 'Loading Classes', upVal: 10 }); // (70/100) //
  const classes = await GeneralGathering.getAllClassesBasic(getUserID(socket), null);

  socket.emit('updateLoadProgess', { message: 'Loading Ancestries', upVal: 10 }); // (80/100) //
  const ancestries = await GeneralGathering.getAllAncestriesBasic(getUserID(socket), null);

  socket.emit('updateLoadProgess', { message: 'Loading Backgrounds', upVal: 5 }); // (85/100) //
  const backgrounds = await GeneralGathering.getAllBackgrounds(getUserID(socket), null);

  socket.emit('updateLoadProgess', { message: 'Loading Archetypes', upVal: 5 }); // (90/100) //
  const archetypes = await GeneralGathering.getAllArchetypes(getUserID(socket), null);

  socket.emit('updateLoadProgess', { message: 'Loading Heritages', upVal: 5 }); // (95/100) //
  const uniHeritages = await GeneralGathering.getAllUniHeritages(getUserID(socket), null);

  socket.emit('updateLoadProgess', { message: 'Finalizing', upVal: 10 }); // (105/100) //
  const searchStruct = {
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
    sourceBooks,
    uniHeritages,
  };

  console.log('~ COMPLETE SEARCH LOAD! ~');

  return searchStruct;

};