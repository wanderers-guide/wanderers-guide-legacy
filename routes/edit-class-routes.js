/* Copyright (C) 2020, Apeiron Character Manager, all rights reserved.
    By Aaron Cassar.
*/

const router = require('express').Router();

const Tag = require('../models/contentDB/Tag');
const Item = require('../models/contentDB/Item');

const PATH = '/admin/edit/class/'; // <- Change this if routes are ever changed //

router.get('*', (req, res) => {

    let extraData = req.originalUrl.substring(PATH.length);

    Tag.findAll({
        where: { isArchived: 0 },
        order: [['name', 'ASC'],]
    }).then((tags) => {
        Item.findAll({
            where: { isArchived: 0, hidden: 0, itemStructType: 'WEAPON' },
            order: [['name', 'ASC'],]
        }).then((weaponItems) => {
            res.render('admin/admin_builder/builder_class', {
                title: "Class Builder - Apeiron",
                user: req.user,
                tags,
                weaponItems,
                classID: extraData
            });
        });
    });
    
});

module.exports = router;