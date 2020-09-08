
const router = require('express').Router();

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

const AdminGathering = require('../../js/AdminGathering');

function getModelByNameOrID(ModelType, name, id){
  if(id != null){
    return ModelType.findOne({ where: { id: id } })
    .then((model) => {
      return model;
    });
  } else {
    name = name.replace(/’/g,"'");
    return ModelType.findOne({ where: { name: name } })
    .then((model) => {
      return model;
    });
  }
}

router.get('/item', (req, res) => {
  if(req.query.name != null || req.query.id != null){
    getModelByNameOrID(Item, req.query.name, req.query.id).then((item) => {
      if(item != null){
        AdminGathering.getItem(item.id).then((itemData) => {
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

router.get('/spell', (req, res) => {
  if(req.query.name != null || req.query.id != null){
    getModelByNameOrID(Spell, req.query.name, req.query.id).then((spell) => {
      if(spell != null){
        AdminGathering.getSpell(spell.id).then((spellData) => {
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

router.get('/feat', (req, res) => {
  if(req.query.name != null || req.query.id != null){
    getModelByNameOrID(Feat, req.query.name, req.query.id).then((feat) => {
      if(feat != null){
        AdminGathering.getFeat(feat.id).then((featData) => {
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

router.get('/class', (req, res) => {
  if(req.query.name != null || req.query.id != null){
    getModelByNameOrID(Class, req.query.name, req.query.id).then((cClass) => {
      if(cClass != null){
        AdminGathering.getClass(cClass.id).then((classData) => {
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

router.get('/ancestry', (req, res) => {
  if(req.query.name != null || req.query.id != null){
    getModelByNameOrID(Ancestry, req.query.name, req.query.id).then((ancestry) => {
      if(ancestry != null){
        AdminGathering.getAncestryBasic(ancestry.id).then((ancestryData) => {
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

router.get('/archetype', (req, res) => {
  if(req.query.name != null || req.query.id != null){
    getModelByNameOrID(Archetype, req.query.name, req.query.id).then((archetype) => {
      if(archetype != null){
        AdminGathering.getArchetype(archetype.id).then((archetypeData) => {
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

router.get('/v-heritage', (req, res) => {
  if(req.query.name != null || req.query.id != null){
    getModelByNameOrID(UniHeritage, req.query.name, req.query.id).then((uniHeritage) => {
      if(uniHeritage != null){
        AdminGathering.getUniHeritage(uniHeritage.id).then((uniHeritageData) => {
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

router.get('/heritage', (req, res) => {
  if(req.query.name != null || req.query.id != null){
    getModelByNameOrID(Heritage, req.query.name, req.query.id).then((heritage) => {
      if(heritage != null){
        AdminGathering.getHeritage(heritage.id).then((heritageData) => {
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

router.get('/background', (req, res) => {
  if(req.query.name != null || req.query.id != null){
    getModelByNameOrID(Background, req.query.name, req.query.id).then((background) => {
      if(background != null){
        AdminGathering.getBackground(background.id).then((backgroundData) => {
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

router.get('/trait', (req, res) => {
  if(req.query.name != null || req.query.id != null){    
    getModelByNameOrID(Tag, req.query.name, req.query.id).then((tag) => {
      if(tag != null){
        AdminGathering.getTag(tag.id).then((tagData) => {
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

router.get('/condition', (req, res) => {
  if(req.query.name != null || req.query.id != null){    
    getModelByNameOrID(Condition, req.query.name, req.query.id).then((condition) => {
      if(condition != null){
        AdminGathering.getCondition(condition.id).then((conditionData) => {
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

module.exports = router;