/* Copyright (C) 2020, Apeiron, all rights reserved.
    By Aaron Cassar.
*/

const router = require('express').Router();

const Language = require('../models/contentDB/Language');
const Tag = require('../models/contentDB/Tag');
const SenseType = require('../models/contentDB/SenseType');

const PATH = '/admin/edit/ancestry/'; // <- Change this if routes are ever changed //

router.get('*', (req, res) => {

    let extraData = req.originalUrl.substring(PATH.length);

    Language.findAll({
        order: [['name', 'ASC'],]
    }).then((languages) => {
        Tag.findAll({
            order: [['name', 'ASC'],]
        }).then((tags) => {
            SenseType.findAll()
            .then((senseTypes) => {

                res.render('admin/admin_builder/builder_ancestry', {
                    title: "Ancestry Builder - Apeiron",
                    user: req.user,
                    languages,
                    tags,
                    senseTypes,
                    ancestryID: extraData
                });    

            });
        });
    });
    
});

module.exports = router;