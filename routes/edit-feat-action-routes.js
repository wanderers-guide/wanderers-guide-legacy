
const router = require('express').Router();

const Skill = require('../models/contentDB/Skill');
const Tag = require('../models/contentDB/Tag');

const PATH = '/admin/edit/feat-action/'; // <- Change this if routes are ever changed //

router.get('*', (req, res) => {

    let extraData = req.originalUrl.substring(PATH.length);

    Skill.findAll({
        order: [['name', 'ASC'],]
    }).then((skills) => {
        Tag.findAll({
            where: { isArchived: 0, homebrewID: null }, // isHidden: 0
            order: [['name', 'ASC'],]
        }).then((tags) => {
            res.render('admin/admin_builder/builder_feat-action', {
                title: "Feat / Action Builder - Wanderer's Guide",
                user: req.user,
                skills,
                tags,
                featID: extraData
            }); 
        });
    });
    
});

module.exports = router;