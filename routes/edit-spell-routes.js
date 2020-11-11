
const router = require('express').Router();

const Tag = require('../models/contentDB/Tag');

const PATH = '/admin/edit/spell/'; // <- Change this if routes are ever changed //

router.get('*', (req, res) => {

    let extraData = req.originalUrl.substring(PATH.length);

    Tag.findAll({
        where: { isArchived: 0, isHidden: 0, homebrewID: null },
        order: [['name', 'ASC'],]
    }).then((tags) => {
        res.render('admin/admin_builder/builder_spell', {
            title: "Spell Builder - Wanderer's Guide",
            user: req.user,
            tags,
            spellID: extraData
        }); 
    });
    
});

module.exports = router;