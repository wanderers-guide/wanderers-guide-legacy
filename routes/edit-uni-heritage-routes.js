
const router = require('express').Router();

const Tag = require('../models/contentDB/Tag');

const PATH = '/admin/edit/uni-heritage/'; // <- Change this if routes are ever changed //

router.get('*', (req, res) => {

    let extraData = req.originalUrl.substring(PATH.length);

    Tag.findAll({
        where: { isArchived: 0, isHidden: 0 },
        order: [['name', 'ASC'],]
    }).then((tags) => {
        
        res.render('admin/admin_builder/builder_uni-heritage', {
            title: "Universal Heritage Builder - Wanderer's Guide",
            user: req.user,
            tags,
            uniHeritageID: extraData
        });

    });
    
});

module.exports = router;