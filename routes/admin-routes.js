/* Copyright (C) 2019, Apeiron, all rights reserved.
    Made by Aaron Cassar.
*/

const router = require('express').Router();
const Item = require('../models/contentDB/Item');
const Weapon = require('../models/contentDB/Weapon');

const adminAuthCheck = (req, res, next) => {
    if(req.user.isAdmin == 1){
        next();
    } else {
        res.status(404);
        res.render('404_error', { user: req.user });
    }
};

router.get('/panel', adminAuthCheck, (req, res) => {

    res.render('admin_panel', {  title: "Admin Panel - Apeiron", user: req.user });

});

router.get('/create/item/general', adminAuthCheck, (req, res) => {

    let itemHandsTypes = Item.rawAttributes.hands.values;
    let itemTypes = Item.rawAttributes.itemType.values;

    res.render('admin_item_general_builder', {
        title: "Item General Builder - Apeiron",
        user: req.user, itemHandsTypes, itemTypes, 'selectedState': ''
    });

});

router.post('/create/item/general/add', adminAuthCheck, (req, res) => {

    let { itemName, itemPrice, itemBulk, itemHandsType, itemDescription, itemType } = req.body;

    Item.create({
        name: itemName,
        price: itemPrice,
        bulk: itemBulk,
        hands: itemHandsType,
        description: itemDescription,
        itemType: itemType,
        quality: 'NORMAL',
        size: 'MEDIUM'
    }).then(item => {
        res.redirect('/admin/panel');
    });
});



router.get('/create/item/weapon', adminAuthCheck, (req, res) => {

    WeaponProperties.findAll().then((weaponProperties) => {

        let weaponHandsTypes = Item.rawAttributes.hands.values;
        let dieTypes = Weapon.rawAttributes.damageDieType.values;
        let damageTypes = Weapon.rawAttributes.damageType.values;
        let damageSubTypes = Weapon.rawAttributes.damageSubType.values;
        let meleeWeaponTypes = Weapon.rawAttributes.meleeWeaponType.values;
        let rangedWeaponTypes = Weapon.rawAttributes.rangedWeaponType.values;

        res.render('admin_item_weapon_builder', {
            title: "Item Weapon Builder - Apeiron",
            user: req.user, weaponHandsTypes, weaponProperties, dieTypes, damageTypes, damageSubTypes, meleeWeaponTypes, rangedWeaponTypes, 'selectedState': ''
        });

    });

});

router.post('/create/item/weapon/add', adminAuthCheck, (req, res) => {

    let { weaponName, weaponPrice, weaponBulk, weaponHandsType, weaponPropertyIDs, numDice, dieType, damageType, damageSubType, meleeWeaponType, rangedWeaponType, rangedRange, rangedReload, weaponDescription } = req.body;

    let isMelee = meleeWeaponType == 'N/A' ? 0 : 1;
    let isRanged = rangedWeaponType == 'N/A' ? 0 : 1;

    Item.create({
        name: weaponName,
        price: weaponPrice,
        bulk: weaponBulk,
        hands: weaponHandsType,
        description: weaponDescription,
        itemType: 'WEAPON',
        quality: 'NORMAL',
        size: 'MEDIUM'
    }).then(item => {
        Weapon.create({
            itemID: item.id,
            damageDiceNum: numDice,
            damageDieType: dieType,
            damageType: damageType,
            damageSubType: damageSubType,
            isMelee: isMelee,
            meleeWeaponType: meleeWeaponType,
            isRanged: isRanged,
            rangedWeaponType: rangedWeaponType,
            rangedRange: rangedRange,
            rangedReload: rangedReload
        }).then(weapon => {
            if(weaponPropertyIDs != null){
                let promises = [];
                for (const wPropID of weaponPropertyIDs) {
                    let newPromise = WeapPropApplied.create({
                        weapID: weapon.id,
                        propID: wPropID
                    });
                    promises.push(newPromise);
                }
                Promise.all(promises).then((wPropIDs) => {
                    res.redirect('/admin/panel');
                });
            } else {
                res.redirect('/admin/panel');
            }
        });
    });
});

module.exports = router;