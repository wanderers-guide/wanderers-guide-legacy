require('dotenv').config();

const express = require('express');
const socket = require('socket.io');

const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');

const cookieSession = require('cookie-session');
const passport = require('passport');

const authRoutes = require('./routes/auth-routes');
const adminRoutes = require('./routes/admin-routes');
const profileRoutes = require('./routes/profile-routes');
const coreRoutes = require('./routes/core-routes');
const errorRoutes = require('./routes/error-routes');

const CharGathering = require('./js/CharGathering');
const CharSaving = require('./js/CharSaving');
const CharDataStoring = require('./js/CharDataStoring');

const passportSetup = require('./config/passport-setup');
const keys = require('./config/keys');
const path = require('path');

const app = express();

// Handlebars
app.engine('handlebars', exphbs({
    defaultLayout: 'main',
    helpers: {
      chooseSelection: function(checkedValue, currentValue) {
        return checkedValue === currentValue ? ' selected' : '';
      },
      getBoostFlawElement: function(array, index) {
        return array[index] != null ? array[index].boostedAbility : '';
      },
      section: function(name, options){
        if(!this._sections) this._sections = {};
        this._sections[name] = options.fn(this);
        return null;
      },
      ifEqual: function(a, b, options) {
        if (a == b) {
            return options.fn(this);
        } else {
            return options.inverse(this);
        }
      },
      defaultAncestry: function(checkedName, currentName) {
        return checkedName === currentName ? 'selectedAncestryOption' : null;
      },
    }
}));

app.set('view engine', 'handlebars');

// Body Parser
app.use(bodyParser.urlencoded({ extended: false }));

// Set up Session Cookies
app.use(cookieSession({
    maxAge: 24 * 60 * 60 * 1000,
    keys: [keys.session.cookieKey]
}));

// initialize passport
app.use(passport.initialize());
app.use(passport.session());


// Databases
const backgroundDB = require('./config/databases/background-database');
const contentDB = require('./config/databases/content-database');

// Testing Database Connections
backgroundDB.authenticate()
  .then(() => console.log('Background Database connected...'))
  .catch(err => console.error('Error: ' + err));
  
contentDB.authenticate()
  .then(() => console.log('Content Database connected...'))
  .catch(err => console.error('Error: ' + err));

// Set static folder
app.use(express.static(path.join(__dirname, 'public')));

// Set up Routes
app.use('/auth', authRoutes);
app.use('/profile', profileRoutes);
app.use('/admin', adminRoutes);
app.use('/', coreRoutes);
app.use('*', errorRoutes); // 404 Route

// Server Listen
const PORT = process.env.PORT || 4828;
let server = app.listen(PORT, () => {
    console.log('app now listening for requests on port '+PORT);
});

// Socket IO
const io = socket(server);

io.on('connection', function(socket){

  socket.on('requestAddFundamentalRune', function(invItemID, fundRuneID){
    CharSaving.addFundRune(invItemID,fundRuneID);
  });

  socket.on('requestUpdateInventory', function(invID, equippedArmorInvItemID, equippedShieldInvItemID){
    CharSaving.updateInventory(invID, equippedArmorInvItemID, equippedShieldInvItemID).then(() => {
      // Return nothing
    });
  });

  socket.on('requestAddItemToInv', function(invID, itemID, quantity){
    CharSaving.addItemToInv(invID, itemID, quantity).then(() => {
      CharGathering.getInventory(invID).then((invStruct) => {
        socket.emit('returnAddItemToInv', itemID, invStruct);
      });
    });
  });

  socket.on('requestRemoveItemFromInv', function(invID, invItemID){
    CharSaving.removeInvItemFromInv(invItemID).then(() => {
      CharGathering.getInventory(invID).then((invStruct) => {
        socket.emit('returnRemoveItemFromInv', invItemID, invStruct);
      });
    });
  });

  socket.on('requestInvItemMoveBag', function(invItemID, bagItemID, invID){
    CharSaving.saveInvItemToNewBag(invItemID, bagItemID).then(() => {
      CharGathering.getInventory(invID).then((invStruct) => {
        socket.emit('returnInvItemMoveBag', invItemID, invStruct);
      });
    });
  });

  socket.on('requestInvItemQtyChange', function(invItemID, newQty, invID){
    CharSaving.saveInvItemQty(invItemID, newQty).then(() => {
      CharGathering.getInventory(invID).then((invStruct) => {
        socket.emit('returnInvItemUpdated', invStruct);
      });
    });
  });

  socket.on('requestInvItemHPChange', function(invItemID, newHP, invID){
    CharSaving.saveInvItemHitPoints(invItemID, newHP).then(() => {
      CharGathering.getInventory(invID).then((invStruct) => {
        socket.emit('returnInvItemUpdated', invStruct);
      });
    });
  });

  socket.on('requestCustomizeInvItem', function(invItemID, invID, updateValues){
    CharSaving.saveInvItemCustomize(invItemID, updateValues).then(() => {
      CharGathering.getInventory(invID).then((invStruct) => {
        socket.emit('returnInvItemUpdated', invStruct);
      });
    });
  });

  socket.on('requestNotesSave', function(charID, notes){
    CharSaving.saveNotes(charID, notes).then((result) => {
      socket.emit('returnNotesSave');
    });
  });

  socket.on('requestExperienceSave', function(charID, newExp){
    CharSaving.saveExp(charID, newExp).then((result) => {
      // Return nothing
    });
  });

  socket.on('requestCurrentHitPointsSave', function(charID, currentHealth){
    CharSaving.saveCurrentHitPoints(charID, currentHealth).then((result) => {
      // Return nothing
    });
  });

  socket.on('requestTempHitPointsSave', function(charID, tempHealth){
    CharSaving.saveTempHitPoints(charID, tempHealth).then((result) => {
      // Return nothing
    });
  });

  socket.on('requestHeroPointsSave', function(charID, heroPoints){
    CharSaving.saveHeroPoints(charID, heroPoints).then((result) => {
      socket.emit('returnHeroPointsSave');
    });
  });

  socket.on('requestAddCondition', function(charID, conditionID, value, sourceText, reloadCharSheet){
    CharSaving.addCondition(charID, conditionID, value, sourceText).then((result) => {
      socket.emit('returnUpdateConditionsMap', reloadCharSheet);
    });
  });

  socket.on('requestUpdateConditionValue', function(charID, conditionID, newValue, reloadCharSheet){
    CharSaving.updateConditionValue(charID, conditionID, newValue).then((result) => {
      socket.emit('returnUpdateConditionsMap', reloadCharSheet);
    });
  });

  socket.on('requestUpdateConditionActive', function(charID, conditionID, isActive, reloadCharSheet){
    CharSaving.updateConditionActive(charID, conditionID, isActive).then((result) => {
      socket.emit('returnUpdateConditionsMap', reloadCharSheet);
    });
  });

  socket.on('requestUpdateConditionActiveForArray', function(charID, conditionIDArray, isActive, reloadCharSheet){
    CharSaving.updateConditionActiveForArray(charID, conditionIDArray, isActive).then((result) => {
      socket.emit('returnUpdateConditionsMap', reloadCharSheet);
    });
  });

  socket.on('requestRemoveCondition', function(charID, conditionID, reloadCharSheet){
    CharSaving.removeCondition(charID, conditionID).then((result) => {
      socket.emit('returnUpdateConditionsMap', reloadCharSheet);
    });
  });

  socket.on('requestClassDetails', function(charID){
    CharGathering.getAllClasses().then((classObject) => {
      CharGathering.getCharChoices(charID).then((choiceStruct) => {
        socket.emit('returnClassDetails', classObject, choiceStruct);
      });
    });
  });

  socket.on('requestBackgroundDetails', function(charID){
    CharGathering.getAllBackgrounds().then((backgrounds) => {
      CharGathering.getCharChoices(charID).then((choiceStruct) => {
        socket.emit('returnBackgroundDetails', backgrounds, choiceStruct);
      });
    });
  });

  socket.on('requestFinalizeDetails', function(charID){
    CharGathering.getCharacter(charID).then((character) => {
      CharGathering.getAncestryLanguages(character.ancestryID).then((ancestLanguages) => {
        CharGathering.getClass(character.classID).then((cClass) => {
          CharGathering.getAbilityScores(charID).then((abilObject) => {
            socket.emit('returnFinalizeDetails', abilObject, cClass, ancestLanguages);
          });
        });
      });
    });
  });


  socket.on('requestNameChange', function(charID, name){
    CharSaving.saveName(charID, name).then((result) => {
      socket.emit('returnNameChange');
    });
  });

  socket.on('requestLevelChange', function(charID, charLevel){
    CharSaving.saveLevel(charID, charLevel).then((result) => {
      socket.emit('returnLevelChange');
    });
  });

  socket.on('requestAbilityScoreChange', function(charID, abilSTR, abilDEX, abilCON, abilINT, abilWIS, abilCHA){
    CharSaving.saveAbilityScores(charID, abilSTR, abilDEX, abilCON, abilINT, abilWIS, abilCHA)
    .then((result) => {
      socket.emit('returnAbilityScoreChange');
    });
  });


  socket.on('requestAncestryAndChoices', function(charID){
    CharGathering.getAllAncestries().then((ancestriesObject) => {
      CharGathering.getCharChoices(charID).then((choiceStruct) => {
        socket.emit('returnAncestryAndChoices', ancestriesObject, choiceStruct);
      });
    });
  });

  socket.on('requestAncestryChange', function(charID, ancestryPacket){
    CharSaving.saveAncestry(charID, ancestryPacket.AncestryID).then((result) => {
      CharGathering.getCharChoices(charID).then((choiceStruct) => {
        socket.emit('returnAncestryChange', choiceStruct, ancestryPacket);
      });
    });
  });

  socket.on('requestHeritageChange', function(charID, heritageID){
    CharSaving.saveHeritage(charID, heritageID).then((result) => {
      socket.emit('returnHeritageChange');
    });
  });

  socket.on('requestAbilityBonusChange', function(charID, srcID, abilityBonusArray){
    CharDataStoring.replaceAbilityBonus(charID, srcID, abilityBonusArray)
    .then((result) => {
      socket.emit('returnAbilityBonusChange');
    });
  });

  socket.on('requestLanguagesChange', function(charID, srcID, langIDArray){
    CharDataStoring.replaceLanguages(charID, srcID, langIDArray)
    .then((result) => {
      socket.emit('returnLanguagesChange');
    });
  });

  socket.on('requestBackgroundChange', function(charID, backgroundID){
    CharSaving.saveBackground(charID, backgroundID).then((result) => {
      socket.emit('returnBackgroundChange');
    });
  });

  socket.on('requestAbilityBoostChange', function(charID, srcID, abilityBonusArray, 
            selectBoostControlShellClass){
    CharDataStoring.replaceAbilityBonus(charID, srcID, abilityBonusArray)
    .then((result) => {
      socket.emit('returnAbilityBoostChange', selectBoostControlShellClass);
    });
  });



  socket.on('requestClassChange', function(charID, classID){
    CharSaving.saveClass(charID, classID).then((result) => {
      socket.emit('returnClassChange');
    });
  });

  socket.on('requestSelectAbilityChange', function(charID, srcID, abilChangeArray){
    CharDataStoring.replaceAbilityChoice(charID, srcID, abilChangeArray)
    .then((result) => {
      socket.emit('returnSelectAbilityChange');
    });
  });

  socket.on('requestProficiencyChange', function(charID, profChangePacket, profArray){
    CharDataStoring.replaceProficiencies(charID, profChangePacket.srcID, profArray)
    .then((result) => {
      socket.emit('returnProficiencyChange', profChangePacket);
    });
  });

  socket.on('requestFeatChange', function(charID, featChangePacket, selectFeatControlShellClass){
    CharDataStoring.replaceFeats(charID, featChangePacket.srcID, [featChangePacket.featID])
    .then((result) => {
      socket.emit('returnFeatChange', featChangePacket, selectFeatControlShellClass);
    });
  });

  socket.on('requestLoreChange', function(charID, srcID, loreName){
    CharDataStoring.replaceLore(charID, srcID, [loreName])
    .then((result) => {
      socket.emit('returnLoreChange');
    });
  });

  socket.on('requestCharacterSheetInfo', function(charID){
    CharGathering.getCharacterInfo(charID)
    .then((charInfo) => {
      socket.emit('returnCharacterSheetInfo', charInfo);
    });
  });




  socket.on('requestASCChoices', function(charID, ascCode, srcID, locationID){
    CharGathering.getCharChoices(charID).then((choiceStruct) => {
      socket.emit('returnASCChoices', ascCode, srcID, locationID,
       choiceStruct);
    });
  });

  socket.on('requestASCFeats', function(charID, ascStatement, srcID, locationID, statementNum){
    CharGathering.getAllFeats().then((featsObject) => {
      socket.emit('returnASCFeats', ascStatement, srcID, locationID, 
            statementNum, featsObject);
    });
  });

  socket.on('requestASCSkills', function(charID, ascStatement, srcID, locationID, statementNum){
    CharGathering.getAllSkills(charID).then((skillsObject) => {
      socket.emit('returnASCSkills', ascStatement, srcID, locationID, 
            statementNum, skillsObject);
    });
  });

  socket.on('requestASCLangs', function(charID, ascStatement, srcID, locationID, statementNum){
    CharGathering.getAllLanguages(charID).then((langsObject) => {
      socket.emit('returnASCLangs', ascStatement, srcID, locationID, 
            statementNum, langsObject);
    });
  });

  socket.on('requestASCClassAbilities', function(charID, classAbilities){
    CharGathering.getAllFeats().then((featsObject) => {
      CharGathering.getAllSkills(charID).then((skillsObject) => {
        CharGathering.getCharChoices(charID).then((choiceStruct) => {
          socket.emit('returnASCClassAbilities', choiceStruct, 
                featsObject, skillsObject, classAbilities);
        });
      });
    });
  });

  socket.on('requestASCAncestryFeats', function(charID, ancestryFeatsLocs){
    CharGathering.getAllFeats().then((featsObject) => {
      CharGathering.getAllSkills(charID).then((skillsObject) => {
        CharGathering.getCharChoices(charID).then((choiceStruct) => {
          socket.emit('returnASCAncestryFeats', choiceStruct, 
                featsObject, skillsObject, ancestryFeatsLocs);
        });
      });
    });
  });

  socket.on('requestASCUpdateChoices', function(charID){
    CharGathering.getCharChoices(charID).then((choiceStruct) => {
      socket.emit('returnASCUpdateChoices', choiceStruct);
    });
  });

  socket.on('requestASCUpdateSkills', function(charID){
    CharGathering.getAllSkills(charID).then((skillsObject) => {
      socket.emit('returnASCUpdateSkills', skillsObject);
    });
  });

  socket.on('requestASCUpdateLangs', function(charID){
    CharGathering.getAllLanguages(charID).then((langsObject) => {
      socket.emit('returnASCUpdateLangs', langsObject);
    });
  });

});

