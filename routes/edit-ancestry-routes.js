
const router = require('express').Router();

const Language = require('../models/contentDB/Language');
const Tag = require('../models/contentDB/Tag');
const SenseType = require('../models/contentDB/SenseType');
const PhysicalFeature = require('../models/contentDB/PhysicalFeature');

const PATH = '/admin/edit/ancestry/'; // <- Change this if routes are ever changed //

router.get('*', (req, res) => {

    let extraData = req.originalUrl.substring(PATH.length);

    Language.findAll({
        where: { homebrewID: null },
        order: [['name', 'ASC'],]
    }).then((languages) => {
        Tag.findAll({
            where: { isArchived: 0, isHidden: 0, homebrewID: null },
            order: [['name', 'ASC'],]
        }).then((tags) => {
            SenseType.findAll({
              order: [['name', 'ASC'],]
            }).then((senseTypes) => {
                PhysicalFeature.findAll({
                  order: [['name', 'ASC'],]
                }).then((physicalFeatures) => {

                    res.render('admin/admin_builder/builder_ancestry', {
                        title: "Ancestry Builder - Wanderer's Guide",
                        user: req.user,
                        languages,
                        tags,
                        senseTypes,
                        physicalFeatures,
                        ancestryID: extraData
                    });  

                });
            });
        });
    });
    
});

module.exports = router;