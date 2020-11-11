
const router = require('express').Router();

const Tag = require('../models/contentDB/Tag');
const Item = require('../models/contentDB/Item');

const PATH = '/admin/edit/class/'; // <- Change this if routes are ever changed //

router.get('*', (req, res) => {

    let extraData = req.originalUrl.substring(PATH.length);

    Tag.findAll({
        where: { isArchived: 0, isHidden: 0, homebrewID: null },
        order: [['name', 'ASC'],]
    }).then((tags) => {
        Item.findAll({
            where: { isArchived: 0, hidden: 0, homebrewID: null, itemStructType: 'WEAPON' },
            order: [['name', 'ASC'],]
        }).then((weaponItems) => {
            res.render('admin/admin_builder/builder_class', {
                title: "Class Builder - Wanderer's Guide",
                user: req.user,
                tags,
                weaponItems,
                classID: extraData
            });
        });
    });
    
});

module.exports = router;