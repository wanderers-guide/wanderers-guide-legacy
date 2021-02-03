
const { Op } = require("sequelize");

const Inventory = require('../models/contentDB/Inventory');
const Character = require('../models/contentDB/Character');
const InvItem = require('../models/contentDB/InvItem');

module.exports = class CharImport {

  static importData(userID, charExportData){
    //let charExportData = JSON.parse(charExportDataJSON); Already called

    charExportData.character.userID = userID;// Test this

    delete charExportData.inventory.id;
    delete charExportData.character.id;

    try {

      return Inventory.create(charExportData.inventory)
      .then(inventory => {
        charExportData.character.inventoryID = inventory.id;
        return Character.create(charExportData.character)
        .then(character => {
          
          let invItemPromises = [];
          for(let invItem of charExportData.invItems) {
            invItemPromises.push(InvItem.create(invItem));
            if(invItem.invItemRunes != null){
              invItemPromises.push(InvItemRune.create(invItem));
            }
          }
          return Promise.all(invItemPromises)
          .then(function(result) {
              return;
          });

        });
      });

    } catch (err) {
      console.error(err);
    }


  }

};