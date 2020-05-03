/* Copyright (C) 2020, Apeiron, all rights reserved.
    By Aaron Cassar.
*/

const router = require('express').Router();
const Character = require('../models/contentDB/Character');
const CharData = require('../models/contentDB/CharData');
const Inventory = require('../models/contentDB/Inventory');

const PATH = '/profile/characters/delete/'; // <- Change this if routes are ever changed //

router.get('*', (req, res) => {

    let extraData = req.originalUrl.substring(PATH.length);

    Character.findAll({ where: { userID: req.user.id} })
    .then((characters) => {

        let character = characters.find(character => {
            return character.id == extraData;
        });

        if(character != null){

            Inventory.destroy({
                where: { id: character.inventoryID }
            }).then((result) => {
                CharData.destroy({
                    where: { id: character.dataID }
                }).then((result) => {
                    Character.destroy({
                        where: { id: character.id }
                    }).then((result) => {
                        res.redirect('/profile/characters');
                    });
                });
            });

        } else {
            // Either character id is invalid or user doesn't own character, goto 404 not found
            res.status(404);
            res.render('error/404_error', { title: "404 Not Found - Apeiron", user: req.user });
        }

    });
    
});

module.exports = router;