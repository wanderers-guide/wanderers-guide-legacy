/* Copyright (C) 2020, Apeiron, all rights reserved.
    By Aaron Cassar.
*/

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
            order: [['name', 'ASC'],]
        }).then((tags) => {
            res.render('admin/admin_builder/builder_feat-action', {
                title: "Feat / Action Builder - Apeiron",
                user: req.user,
                skills,
                tags,
                featID: extraData
            }); 
        });
    });
    
});

module.exports = router;