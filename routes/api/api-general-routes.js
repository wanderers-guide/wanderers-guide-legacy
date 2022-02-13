
const router = require('express').Router();

const Character = require('../../models/contentDB/Character');
const Item = require('../../models/contentDB/Item');
const Spell = require('../../models/contentDB/Spell');
const Feat = require('../../models/contentDB/Feat');
const Class = require('../../models/contentDB/Class');
const Ancestry = require('../../models/contentDB/Ancestry');
const Archetype = require('../../models/contentDB/Archetype');
const UniHeritage = require('../../models/contentDB/UniHeritage');
const Heritage = require('../../models/contentDB/Heritage');
const Background = require('../../models/contentDB/Background');
const Tag = require('../../models/contentDB/Tag');
const Condition = require('../../models/contentDB/Condition');

const GeneralGathering = require('../../js/GeneralGathering');

function mapToObj(strMap) {
  let obj = Object.create(null);
  for (let [k,v] of strMap) {
    // We don’t escape the key '__proto__'
    // which can cause problems on older engines
    obj[k] = v;
  }
  return obj;
}

function getModelByNameOrID(ModelType, name, id, hasHomebrewID=true){
  if(id != null){
    if(hasHomebrewID){
      return ModelType.findOne({ where: { id: id, homebrewID: null, } })
      .then((model) => {
        return model;
      });
    } else {
      return ModelType.findOne({ where: { id: id, } })
      .then((model) => {
        return model;
      });
    }
  } else {
    name = name.replace(/’/g,"'");
    if(hasHomebrewID){
      return ModelType.findOne({ where: { name: name, homebrewID: null, } })
      .then((model) => {
        return model;
      });
    } else {
      return ModelType.findOne({ where: { name: name, } })
      .then((model) => {
        return model;
      });
    }
  }
}

router.get('/char', (req, res) => {
  if(req.query.name != null || req.query.id != null){
    getModelByNameOrID(Character, req.query.name, req.query.id, false).then((character) => {
      if(character != null){
        res.send({ id: character.id, name: character.name });
      } else {
        res.sendStatus(404);
      }
    });

  } else {
    res.sendStatus(400);
  }
});

router.get('/item', (req, res) => {
  if(req.query.name != null || req.query.id != null){
    if(req.query.name != null){
      req.query.name = req.query.name.replace(/[\(\)]/g,'');
    }
    getModelByNameOrID(Item, req.query.name, req.query.id).then((item) => {
      if(item != null){
        GeneralGathering.getItem(-1, item.id).then((itemData) => {
          res.send(itemData);
        });
      } else {
        res.sendStatus(404);
      }
    });

  } else {
    res.sendStatus(400);
  }
});
router.get('/item/all', (req, res) => {
  GeneralGathering.getAllItems(-1).then((itemMap) => {
    res.send(mapToObj(itemMap));
  });
});

router.get('/spell', (req, res) => {
  if(req.query.name != null || req.query.id != null){
    getModelByNameOrID(Spell, req.query.name, req.query.id).then((spell) => {
      if(spell != null){
        GeneralGathering.getSpell(-1, spell.id).then((spellData) => {
          res.send(spellData);
        });
      } else {
        res.sendStatus(404);
      }
    });

  } else {
    res.sendStatus(400);
  }
});
router.get('/spell/all', (req, res) => {
  GeneralGathering.getAllSpells(-1).then((spellMap) => {
    res.send(mapToObj(spellMap));
  });
});

router.get('/feat', (req, res) => {
  if(req.query.name != null || req.query.id != null){
    getModelByNameOrID(Feat, req.query.name, req.query.id).then((feat) => {
      if(feat != null){
        GeneralGathering.getFeat(-1, feat.id).then((featData) => {
          res.send(featData);
        });
      } else {
        res.sendStatus(404);
      }
    });

  } else {
    res.sendStatus(400);
  }
});
router.get('/feat/all', (req, res) => {
  GeneralGathering.getAllFeats(-1).then((featObj) => {
    res.send(featObj);
  });
});

router.get('/class', (req, res) => {
  if(req.query.name != null || req.query.id != null){
    getModelByNameOrID(Class, req.query.name, req.query.id).then((cClass) => {
      if(cClass != null){
        GeneralGathering.getClass(-1, cClass.id).then((classData) => {
          res.send(classData);
        });
      } else {
        res.sendStatus(404);
      }
    });

  } else {
    res.sendStatus(400);
  }
});
router.get('/class/all', (req, res) => {
  GeneralGathering.getAllClasses(-1).then((classObj) => {
    res.send(classObj);
  });
});

router.get('/ancestry', (req, res) => {
  if(req.query.name != null || req.query.id != null){
    getModelByNameOrID(Ancestry, req.query.name, req.query.id).then((ancestry) => {
      if(ancestry != null){
        GeneralGathering.getAncestry(-1, ancestry.id).then((ancestryData) => {
          res.send(ancestryData);
        });
      } else {
        res.sendStatus(404);
      }
    });

  } else {
    res.sendStatus(400);
  }
});
router.get('/ancestry/all', (req, res) => {
  GeneralGathering.getAllAncestries(-1, true).then((ancestryObj) => {
    res.send(ancestryObj);
  });
});

router.get('/archetype', (req, res) => {
  if(req.query.name != null || req.query.id != null){
    getModelByNameOrID(Archetype, req.query.name, req.query.id).then((archetype) => {
      if(archetype != null){
        GeneralGathering.getArchetype(-1, archetype.id).then((archetypeData) => {
          res.send(archetypeData);
        });
      } else {
        res.sendStatus(404);
      }
    });

  } else {
    res.sendStatus(400);
  }
});
router.get('/archetype/all', (req, res) => {
  GeneralGathering.getAllArchetypes(-1).then((archetypes) => {
    res.send(archetypes);
  });
});

router.get('/v-heritage', (req, res) => {
  if(req.query.name != null || req.query.id != null){
    getModelByNameOrID(UniHeritage, req.query.name, req.query.id).then((uniHeritage) => {
      if(uniHeritage != null){
        GeneralGathering.getUniHeritage(-1, uniHeritage.id).then((uniHeritageData) => {
          res.send(uniHeritageData);
        });
      } else {
        res.sendStatus(404);
      }
    });

  } else {
    res.sendStatus(400);
  }
});
router.get('/v-heritage/all', (req, res) => {
  GeneralGathering.getAllUniHeritages(-1).then((uniHeritages) => {
    res.send(uniHeritages);
  });
});

router.get('/heritage', (req, res) => {
  if(req.query.name != null || req.query.id != null){
    getModelByNameOrID(Heritage, req.query.name, req.query.id).then((heritage) => {
      if(heritage != null){
        GeneralGathering.getHeritage(-1, heritage.id).then((heritageData) => {
          res.send(heritageData);
        });
      } else {
        res.sendStatus(404);
      }
    });

  } else {
    res.sendStatus(400);
  }
});
router.get('/heritage/all', (req, res) => {
  GeneralGathering.getAllHeritages(-1).then((heritages) => {
    res.send(heritages);
  });
});

router.get('/background', (req, res) => {
  if(req.query.name != null || req.query.id != null){
    getModelByNameOrID(Background, req.query.name, req.query.id).then((background) => {
      if(background != null){
        GeneralGathering.getBackground(-1, background.id).then((backgroundData) => {
          res.send(backgroundData);
        });
      } else {
        res.sendStatus(404);
      }
    });

  } else {
    res.sendStatus(400);
  }
});
router.get('/background/all', (req, res) => {
  GeneralGathering.getAllBackgrounds(-1).then((backgrounds) => {
    res.send(backgrounds);
  });
});

router.get('/trait', (req, res) => {
  if(req.query.name != null || req.query.id != null){    
    getModelByNameOrID(Tag, req.query.name, req.query.id).then((tag) => {
      if(tag != null){
        GeneralGathering.getTag(-1, tag.id).then((tagData) => {
          res.send(tagData);
        });
      } else {
        res.sendStatus(404);
      }
    });

  } else {
    res.sendStatus(400);
  }
});
router.get('/trait/all', (req, res) => {
  GeneralGathering.getAllTags(-1).then((allTags) => {
    res.send(allTags);
  });
});

router.get('/condition', (req, res) => {
  if(req.query.name != null || req.query.id != null){    
    getModelByNameOrID(Condition, req.query.name, req.query.id, false).then((condition) => {
      if(condition != null){
        GeneralGathering.getCondition(-1, condition.id).then((conditionData) => {
          res.send(conditionData);
        });
      } else {
        res.sendStatus(404);
      }
    });

  } else {
    res.sendStatus(400);
  }
});
router.get('/condition/all', (req, res) => {
  GeneralGathering.getAllConditions(-1).then((allConditions) => {
    res.send(allConditions);
  });
});

module.exports = router;