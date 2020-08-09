
const router = require('express').Router();
const editClassRoutes = require('./edit-class-routes');
const editClassFeatureRoutes = require('./edit-class-feature-routes');
const editArchetypeRoutes = require('./edit-archetype-routes');
const editUniHeritageRoutes = require('./edit-uni-heritage-routes');
const editBackgroundRoutes = require('./edit-background-routes');
const editAncestryRoutes = require('./edit-ancestry-routes');
const editFeatActionRoutes = require('./edit-feat-action-routes');
const editItemRoutes = require('./edit-item-routes');
const editSpellRoutes = require('./edit-spell-routes');

const Class = require('../models/contentDB/Class');
const ClassAbility = require('../models/contentDB/ClassAbility');
const Background = require('../models/contentDB/Background');
const Ancestry = require('../models/contentDB/Ancestry');
const Item = require('../models/contentDB/Item');
const Spell = require('../models/contentDB/Spell');
const Language = require('../models/contentDB/Language');
const Tag = require('../models/contentDB/Tag');
const SenseType = require('../models/contentDB/SenseType');
const PhysicalFeature = require('../models/contentDB/PhysicalFeature');
const Feat = require('../models/contentDB/Feat');
const Skill = require('../models/contentDB/Skill');
const Archetype = require('../models/contentDB/Archetype');
const UniHeritage = require('../models/contentDB/UniHeritage');

const adminAuthCheck = (req, res, next) => {
    if(!req.user){
        res.redirect('/auth/login');
    } else {
        if(req.user.isAdmin === 1){
            next();
        } else {
            res.status(404);
            res.render('error/404_error', { user: req.user });
        }
    }
};

router.get('/panel', adminAuthCheck, (req, res) => {

    res.render('admin/admin_panel', {  title: "Admin Panel - Wanderer's Guide", user: req.user });

});

// Class Builder
router.get('/manage/class', adminAuthCheck, (req, res) => {

    Class.findAll({
        order: [['name', 'ASC'],]
    }).then((classes) => {

        res.render('admin/admin_manager/manager_class', {
            title: "Class Manager - Wanderer's Guide",
            user: req.user,
            classes
        });

    });

});

router.get('/create/class', adminAuthCheck, (req, res) => {

    Tag.findAll({
        where: { isArchived: 0, isHidden: 0 },
        order: [['name', 'ASC'],]
    }).then((tags) => {
        Item.findAll({
            where: { isArchived: 0, hidden: 0, itemStructType: 'WEAPON' },
            order: [['name', 'ASC'],]
        }).then((weaponItems) => {
            res.render('admin/admin_builder/builder_class', {
                title: "Class Builder - Wanderer's Guide",
                user: req.user,
                tags,
                weaponItems,
            });
        });
    });

});

router.use('/edit/class', adminAuthCheck, editClassRoutes);

// Class Feature Builder
router.get('/manage/class-feature', adminAuthCheck, (req, res) => {

    ClassAbility.findAll()
    .then((classAbilities) => {

        res.render('admin/admin_manager/manager_class-feature', {
            title: "Class Feature Manager - Wanderer's Guide",
            user: req.user,
            classAbilities
        });

    });

});

router.get('/create/class-feature', adminAuthCheck, (req, res) => {

    res.render('admin/admin_builder/builder_class-feature', {
        title: "Class Feature Builder - Wanderer's Guide",
        user: req.user,
    });

});

router.use('/edit/class-feature', adminAuthCheck, editClassFeatureRoutes);

// Archetype Builder
router.get('/manage/archetype', adminAuthCheck, (req, res) => {

    Archetype.findAll({
        order: [['name', 'ASC'],]
    }).then((archetypes) => {

        res.render('admin/admin_manager/manager_archetype', {
            title: "Archetype Manager - Wanderer's Guide",
            user: req.user,
            archetypes
        });

    });

});

router.get('/create/archetype', adminAuthCheck, (req, res) => {

    Tag.findAll({
        where: { isArchived: 0, isHidden: 0 },
        order: [['name', 'ASC'],]
    }).then((tags) => {
        res.render('admin/admin_builder/builder_archetype', {
            title: "Archetype Builder - Wanderer's Guide",
            user: req.user,
            tags,
        });
    });

});

router.use('/edit/archetype', adminAuthCheck, editArchetypeRoutes);

// Ancestry Builder
router.get('/manage/ancestry', adminAuthCheck, (req, res) => {

    Ancestry.findAll({
        order: [['name', 'ASC'],]
    }).then((ancestries) => {

        res.render('admin/admin_manager/manager_ancestry', {
            title: "Ancestry Manager - Wanderer's Guide",
            user: req.user,
            ancestries
        });

    });

});

router.get('/create/ancestry', adminAuthCheck, (req, res) => {

    Language.findAll({
        order: [['name', 'ASC'],]
    }).then((languages) => {
        Tag.findAll({
            where: { isArchived: 0, isHidden: 0 },
            order: [['name', 'ASC'],]
        }).then((tags) => {
            SenseType.findAll()
            .then((senseTypes) => {
                PhysicalFeature.findAll()
                .then((physicalFeatures) => {

                    res.render('admin/admin_builder/builder_ancestry', {
                        title: "Ancestry Builder - Wanderer's Guide",
                        user: req.user,
                        languages,
                        tags,
                        senseTypes,
                        physicalFeatures
                    });

                });
            });
        });
    });

});

router.use('/edit/ancestry', adminAuthCheck, editAncestryRoutes);


// Uni-Heritage Builder
router.get('/manage/uni-heritage', adminAuthCheck, (req, res) => {

    UniHeritage.findAll({
        order: [['name', 'ASC'],]
    }).then((uniHeritages) => {

        res.render('admin/admin_manager/manager_uni-heritage', {
            title: "Universal Heritage Manager - Wanderer's Guide",
            user: req.user,
            uniHeritages
        });

    });

});

router.get('/create/uni-heritage', adminAuthCheck, (req, res) => {

    Tag.findAll({
        where: { isArchived: 0, isHidden: 0 },
        order: [['name', 'ASC'],]
    }).then((tags) => {
        
        res.render('admin/admin_builder/builder_uni-heritage', {
            title: "Universal Heritage Builder - Wanderer's Guide",
            user: req.user,
            tags,
        });

    });

});

router.use('/edit/uni-heritage', adminAuthCheck, editUniHeritageRoutes);


// Background Builder
router.get('/manage/background', adminAuthCheck, (req, res) => {

    Background.findAll({
        order: [['name', 'ASC'],]
    }).then((backgrounds) => {

        res.render('admin/admin_manager/manager_background', {
            title: "Background Manager - Wanderer's Guide",
            user: req.user,
            backgrounds
        });

    });

});

router.get('/create/background', adminAuthCheck, (req, res) => {

    res.render('admin/admin_builder/builder_background', {
        title: "Background Builder - Wanderer's Guide",
        user: req.user,
    });

});

router.use('/edit/background', adminAuthCheck, editBackgroundRoutes);


// Feat-or-Action Builder
router.get('/manage/feat-action', adminAuthCheck, (req, res) => {

    Feat.findAll({
        order: [['name', 'ASC'],]
    }).then((feats) => {

        res.render('admin/admin_manager/manager_feat-action', {
            title: "Feat / Action Manager - Wanderer's Guide",
            user: req.user,
            feats
        });

    });

});

router.get('/create/feat-action', adminAuthCheck, (req, res) => {

    Skill.findAll({
        order: [['name', 'ASC'],]
    }).then((skills) => {
        Tag.findAll({
            where: { isArchived: 0, isHidden: 0 },
            order: [['name', 'ASC'],]
        }).then((tags) => {
            res.render('admin/admin_builder/builder_feat-action', {
                title: "Feat / Action Builder - Wanderer's Guide",
                user: req.user,
                skills,
                tags
            }); 
        });
    });

});

router.use('/edit/feat-action', adminAuthCheck, editFeatActionRoutes);


// Item Builder
router.get('/manage/item', adminAuthCheck, (req, res) => {

    Item.findAll({
        order: [['level', 'ASC'],['name', 'ASC'],],
    }).then((items) => {

        res.render('admin/admin_manager/manager_item', {
            title: "Item Manager - Wanderer's Guide",
            user: req.user,
            items
        });

    });

});

router.get('/create/item', adminAuthCheck, (req, res) => {

    Tag.findAll({
        where: { isArchived: 0, isHidden: 0 },
        order: [['name', 'ASC'],]
    }).then((tags) => {
        res.render('admin/admin_builder/builder_item', {
            title: "Item Builder - Wanderer's Guide",
            user: req.user,
            tags
        }); 
    });

});

router.use('/edit/item', adminAuthCheck, editItemRoutes);


// Spell Builder
router.get('/manage/spell', adminAuthCheck, (req, res) => {

    Spell.findAll({
        order: [['level', 'ASC'],['name', 'ASC'],],
    }).then((spells) => {

        res.render('admin/admin_manager/manager_spell', {
            title: "Spell Manager - Wanderer's Guide",
            user: req.user,
            spells
        });

    });

});

router.get('/create/spell', adminAuthCheck, (req, res) => {

    Tag.findAll({
        where: { isArchived: 0, isHidden: 0 },
        order: [['name', 'ASC'],]
    }).then((tags) => {
        res.render('admin/admin_builder/builder_spell', {
            title: "Spell Builder - Wanderer's Guide",
            user: req.user,
            tags
        });
    });

});

router.use('/edit/spell', adminAuthCheck, editSpellRoutes);

module.exports = router;