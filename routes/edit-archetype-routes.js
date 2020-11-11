
const router = require('express').Router();

const Tag = require('../models/contentDB/Tag');

const PATH = '/admin/edit/archetype/'; // <- Change this if routes are ever changed //

router.get('*', (req, res) => {

    let extraData = req.originalUrl.substring(PATH.length);

    Tag.findAll({
        where: { isArchived: 0, isHidden: 0, homebrewID: null },
        order: [['name', 'ASC'],]
    }).then((tags) => {
        res.render('admin/admin_builder/builder_archetype', {
            title: "Archetype Builder - Wanderer's Guide",
            user: req.user,
            tags,
            archetypeID: extraData
        });
    });
    
});

module.exports = router;