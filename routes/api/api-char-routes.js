const router = require("express").Router();

const CharGathering = require("../../js/CharGathering");
const CharSaving = require("../../js/CharSaving");

function accessRightsToNum(accessRights) {
  switch (accessRights) {
    case "READ-ONLY":
      return 1;
    case "READ-UPDATE":
      return 2;
    case "READ-UPDATE-ADD-DELETE":
      return 3;
    default:
      return -1;
  }
}

function hasAccess(accessRights, neededAccessNum) {
  let accessNum = accessRightsToNum(accessRights);
  return accessNum >= neededAccessNum;
}

// Metadata //
router.get("/metadata", (req, res) => {
  // Read
  if (hasAccess(req.accessRights, 1)) {
    CharGathering.getAllMetadata(-1, req.charID).then((metaDatas) => {
      res.send(metaDatas);
    });
  } else {
    res.sendStatus(401);
  }
});

router.get("/metadata-feats", (req, res) => {
  // Read
  if (hasAccess(req.accessRights, 1)) {
    CharGathering.getChoicesFeats(-1, req.charID).then((feats) => {
      res.send(feats);
    });
  } else {
    res.sendStatus(401);
  }
});

// Current HP //
router.get("/current-hp", (req, res) => {
  // Read
  if (hasAccess(req.accessRights, 1)) {
    CharGathering.getCharacter(-1, req.charID).then((character) => {
      res.send(character.currentHealth + "");
    });
  } else {
    res.sendStatus(401);
  }
});

router.put("/current-hp", (req, res) => {
  // Update
  if (hasAccess(req.accessRights, 2)) {
    let newValue = parseInt(req.query.value);
    if (!isNaN(newValue)) {
      CharSaving.saveCurrentHitPoints(req.charID, newValue).then((result) => {
        res.sendStatus(200);
      });
    } else {
      res.sendStatus(400);
    }
  } else {
    res.sendStatus(401);
  }
});

// Temp HP //
router.get("/temp-hp", (req, res) => {
  // Read
  if (hasAccess(req.accessRights, 1)) {
    CharGathering.getCharacter(-1, req.charID).then((character) => {
      res.send(character.tempHealth + "");
    });
  } else {
    res.sendStatus(401);
  }
});

router.put("/temp-hp", (req, res) => {
  // Update
  if (hasAccess(req.accessRights, 2)) {
    let newValue = parseInt(req.query.value);
    if (!isNaN(newValue)) {
      CharSaving.saveTempHitPoints(req.charID, newValue).then((result) => {
        res.sendStatus(200);
      });
    } else {
      res.sendStatus(400);
    }
  } else {
    res.sendStatus(401);
  }
});

// Hero Points //
router.get("/hero-points", (req, res) => {
  // Read
  if (hasAccess(req.accessRights, 1)) {
    CharGathering.getCharacter(-1, req.charID).then((character) => {
      res.send(character.heroPoints + "");
    });
  } else {
    res.sendStatus(401);
  }
});

router.put("/hero-points", (req, res) => {
  // Update
  if (hasAccess(req.accessRights, 2)) {
    let newValue = parseInt(req.query.value);
    if (!isNaN(newValue)) {
      CharSaving.saveHeroPoints(req.charID, newValue).then((result) => {
        res.sendStatus(200);
      });
    } else {
      res.sendStatus(400);
    }
  } else {
    res.sendStatus(401);
  }
});

// Experience //
router.get("/experience", (req, res) => {
  // Read
  if (hasAccess(req.accessRights, 1)) {
    CharGathering.getCharacter(-1, req.charID).then((character) => {
      res.send(character.experience + "");
    });
  } else {
    res.sendStatus(401);
  }
});

router.put("/experience", (req, res) => {
  // Update
  if (hasAccess(req.accessRights, 2)) {
    let newValue = parseInt(req.query.value);
    if (!isNaN(newValue)) {
      CharSaving.saveExp(req.charID, newValue).then((result) => {
        res.sendStatus(200);
      });
    } else {
      res.sendStatus(400);
    }
  } else {
    res.sendStatus(401);
  }
});

// Conditions //
router.get("/conditions", (req, res) => {
  // Read
  if (hasAccess(req.accessRights, 1)) {
    CharGathering.getAllCharConditions(-1, req.charID).then(
      (conditionsData) => {
        res.send(conditionsData);
      },
    );
  } else {
    res.sendStatus(401);
  }
});

router.post("/conditions", (req, res) => {
  // Add
  if (hasAccess(req.accessRights, 3)) {
    let conditionID = parseInt(req.query.id);
    let conditionValue = parseInt(req.query.value); // Optional
    if (!isNaN(conditionID)) {
      if (isNaN(conditionValue)) {
        conditionValue = 1;
      }
      CharSaving.replaceCondition(
        req.charID,
        conditionID,
        conditionValue,
        null,
        null,
      ).then((result) => {
        CharGathering.getAllCharConditions(-1, req.charID).then(
          (conditionsData) => {
            res.status(201).send(conditionsData);
          },
        );
      });
    } else {
      res.sendStatus(400);
    }
  } else {
    res.sendStatus(401);
  }
});

router.delete("/conditions", (req, res) => {
  // Delete
  if (hasAccess(req.accessRights, 3)) {
    let conditionID = parseInt(req.query.id);
    if (!isNaN(conditionID)) {
      CharSaving.removeCondition(req.charID, conditionID).then((result) => {
        CharGathering.getAllCharConditions(-1, req.charID).then(
          (conditionsData) => {
            res.send(conditionsData);
          },
        );
      });
    } else {
      res.sendStatus(400);
    }
  } else {
    res.sendStatus(401);
  }
});

// Inventory //
router.get("/inventory", (req, res) => {
  // Read
  if (hasAccess(req.accessRights, 1)) {
    CharGathering.getCharacter(-1, req.charID).then((character) => {
      CharGathering.getInventory(-1, character.inventoryID).then((invData) => {
        res.send(invData);
      });
    });
  } else {
    res.sendStatus(401);
  }
});

router.put("/inventory/equip-armor-shield", (req, res) => {
  // Update
  if (hasAccess(req.accessRights, 2)) {
    let armorInvItemID = parseInt(req.query.armor_inv_item_id);
    let shieldInvItemID = parseInt(req.query.shield_inv_item_id);
    if (isNaN(armorInvItemID)) {
      armorInvItemID = null;
    }
    if (isNaN(shieldInvItemID)) {
      shieldInvItemID = null;
    }
    CharGathering.getCharacter(-1, req.charID).then((character) => {
      CharSaving.updateInventory(
        character.inventoryID,
        armorInvItemID,
        shieldInvItemID,
      ).then((invData) => {
        res.sendStatus(200);
      });
    });
  } else {
    res.sendStatus(401);
  }
});

router.post("/inventory/add-item", (req, res) => {
  // Add
  if (hasAccess(req.accessRights, 3)) {
    let itemID = parseInt(req.query.item_id);
    let itemQty = parseInt(req.query.quantity); // Optional
    if (!isNaN(itemID)) {
      if (isNaN(itemQty)) {
        itemQty = 1;
      }
      CharGathering.getCharacter(-1, req.charID).then((character) => {
        CharGathering.getItem(-1, character.id, itemID).then((itemData) => {
          if (itemData != null) {
            CharSaving.addItemToInv(
              character.inventoryID,
              itemID,
              itemQty,
            ).then((invItem) => {
              res.status(201).send(invItem);
            });
          } else {
            res.sendStatus(404);
          }
        });
      });
    } else {
      res.sendStatus(400);
    }
  } else {
    res.sendStatus(401);
  }
});

router.delete("/inventory/remove-item", (req, res) => {
  // Delete
  if (hasAccess(req.accessRights, 3)) {
    let invItemID = parseInt(req.query.inv_item_id);
    if (!isNaN(invItemID)) {
      CharGathering.getCharacter(-1, req.charID).then((character) => {
        CharGathering.getInvIDFromInvItemID(-1, invItemID).then((invID) => {
          if (character.inventoryID === invID) {
            CharSaving.removeInvItemFromInv(invItemID).then((result) => {
              res.sendStatus(204);
            });
          } else {
            if (invID == null) {
              res.sendStatus(404);
            } else {
              res.sendStatus(401);
            }
          }
        });
      });
    } else {
      res.sendStatus(400);
    }
  } else {
    res.sendStatus(401);
  }
});

router.put("/inventory/move-item", (req, res) => {
  // Update
  if (hasAccess(req.accessRights, 2)) {
    let movingInvItemID = parseInt(req.query.moving_inv_item_id);
    let bagInvItemID = parseInt(req.query.bag_inv_item_id); // Optional
    if (!isNaN(movingInvItemID)) {
      CharGathering.getCharacter(-1, req.charID).then((character) => {
        CharGathering.getInvIDFromInvItemID(-1, movingInvItemID).then(
          (movingItemInvID) => {
            if (character.inventoryID === movingItemInvID) {
              if (isNaN(bagInvItemID)) {
                CharSaving.saveInvItemToNewBag(movingInvItemID, null, 0).then(
                  (result) => {
                    res.sendStatus(200);
                  },
                );
              } else {
                CharGathering.getInvIDFromInvItemID(-1, bagInvItemID).then(
                  (bagItemInvID) => {
                    if (character.inventoryID === bagItemInvID) {
                      CharSaving.saveInvItemToNewBag(
                        movingInvItemID,
                        bagInvItemID,
                        0,
                      ).then((result) => {
                        res.sendStatus(200);
                      });
                    } else {
                      if (bagItemInvID == null) {
                        res.sendStatus(404);
                      } else {
                        res.sendStatus(401);
                      }
                    }
                  },
                );
              }
            } else {
              if (movingItemInvID == null) {
                res.sendStatus(404);
              } else {
                res.sendStatus(401);
              }
            }
          },
        );
      });
    } else {
      res.sendStatus(400);
    }
  } else {
    res.sendStatus(401);
  }
});

router.put("/inventory/drop-item", (req, res) => {
  // Update
  if (hasAccess(req.accessRights, 2)) {
    let invItemID = parseInt(req.query.inv_item_id);
    if (!isNaN(invItemID)) {
      CharGathering.getCharacter(-1, req.charID).then((character) => {
        CharGathering.getInvIDFromInvItemID(-1, invItemID).then((invID) => {
          if (character.inventoryID === invID) {
            CharSaving.saveInvItemToNewBag(invItemID, null, 1).then(
              (result) => {
                res.sendStatus(200);
              },
            );
          } else {
            if (invID == null) {
              res.sendStatus(404);
            } else {
              res.sendStatus(401);
            }
          }
        });
      });
    } else {
      res.sendStatus(400);
    }
  } else {
    res.sendStatus(401);
  }
});

// InvItem //
router.get("/item", (req, res) => {
  // Read
  if (hasAccess(req.accessRights, 1)) {
    let invItemID = parseInt(req.query.inv_item_id);
    if (!isNaN(invItemID)) {
      CharGathering.getCharacter(-1, req.charID).then((character) => {
        CharGathering.getInvIDFromInvItemID(-1, invItemID).then((invID) => {
          if (character.inventoryID === invID) {
            CharGathering.getInvItem(-1, invItemID).then((invItem) => {
              if (invItem != null) {
                res.send(invItem);
              } else {
                res.sendStatus(204);
              }
            });
          } else {
            if (invID == null) {
              res.sendStatus(404);
            } else {
              res.sendStatus(401);
            }
          }
        });
      });
    } else {
      res.sendStatus(400);
    }
  } else {
    res.sendStatus(401);
  }
});

router.put("/item/qty", (req, res) => {
  // Update
  if (hasAccess(req.accessRights, 2)) {
    let invItemID = parseInt(req.query.inv_item_id);
    let newValue = parseInt(req.query.value);
    if (!isNaN(invItemID) && !isNaN(newValue)) {
      CharGathering.getCharacter(-1, req.charID).then((character) => {
        CharGathering.getInvIDFromInvItemID(-1, invItemID).then((invID) => {
          if (character.inventoryID === invID) {
            CharSaving.saveInvItemQty(invItemID, newValue).then((result) => {
              res.sendStatus(200);
            });
          } else {
            if (invID == null) {
              res.sendStatus(404);
            } else {
              res.sendStatus(401);
            }
          }
        });
      });
    } else {
      res.sendStatus(400);
    }
  } else {
    res.sendStatus(401);
  }
});

// Spell //
router.get("/spell", (req, res) => {
  // Read
  if (hasAccess(req.accessRights, 1)) {
    CharGathering.getSpellData(-1, req.charID).then((spellStruct) => {
      res.send({
        spell_slots_map: spellStruct.SpellSlotObject,
        spell_books: spellStruct.SpellBookArray,
        innate_spells: spellStruct.InnateSpellArray,
        focus_spells_map: spellStruct.FocusSpellObject,
        focus_points: spellStruct.FocusPointsArray,
      });
    });
  } else {
    res.sendStatus(401);
  }
});

// Roll History //
router.get("/roll-history", (req, res) => {
  // Read
  if (hasAccess(req.accessRights, 1)) {
    CharGathering.getCharacter(-1, req.charID).then((character) => {
      if (character != null) {
        let rollHistory = [];
        try {
          rollHistory = JSON.parse(character.rollHistoryJSON);
          if (rollHistory == null) {
            rollHistory = [];
          }
        } catch (err) {}
        res.send(rollHistory);
      } else {
        res.sendStatus(204);
      }
    });
  } else {
    res.sendStatus(401);
  }
});

// Calculated Stats //
router.get("/calculated-stats", (req, res) => {
  // Read
  if (hasAccess(req.accessRights, 1)) {
    CharGathering.getCalculatedStats(-1, req.charID).then((calculatedStats) => {
      if (calculatedStats != null) {
        res.send(calculatedStats);
      } else {
        res.sendStatus(204);
      }
    });
  } else {
    res.sendStatus(401);
  }
});

///

router.get("/", (req, res) => {
  if (hasAccess(req.accessRights, 1)) {
    CharGathering.getCharacter(-1, req.charID).then((character) => {
      res.send(character);
    });
  } else {
    res.sendStatus(401);
  }
});

module.exports = router;

/* HTTP Response Info.

READ - UPDATE - ADD - DELETE
 GET    PUT    POST   DELETE

* PATCH - Partially update resource.
* In POST, return the new resource.
* PUT deleted, return 204: No Content.
* DELETE is 200 on success.
*/
