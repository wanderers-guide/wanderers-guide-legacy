/* Copyright (C) 2021, Wanderer's Guide, all rights reserved.
    By Aaron Cassar.
*/

let g_shopPresets = new Map();

g_shopPresets.set(1, {
  name: 'Alchemy Shop (city, lvl 15)',
  profiles: {
    '1': {
      name: 'First Profile',
      weight: 35,
      level_min: 5,
      level_max: 25,
      traits: {
        '43': 37,
        '415': 23,
        'other': 70,
      },
      categories: {},
      weapon_groups: {},
      rarities: {
        'common': 60,
        'uncommon': 30,
        'rare': 60,
        'unique': 12,
      },
      quantity: {
        permanent_min: 11,
        permanent_max: 17,
        consumable_min: 12,
        consumable_max: 38,
        rarity_adjustment: 55,
      },
      formula_chance: 5,
    }
  }
});