# Character sheet PDF

## Field names and naming conventions

All field names are in `SCREAMING_SNAKE_CASE` that is upper case and use `_` as words separator.

### Character name, ancestry and top area

- CHARACTER_NAME
- PLAYER_NAME
- EXPERIENCE_POINTS_XP
- ANCESTRY
- BACKGROUND
- CLASS
- SIZE
- ALIGNMENT
- TRAITS
- DEITY
- LEVEL
- HERO_POINTS

## Ability scores

Ability scores section contains two sets of fields: modifiers and scores.
Each ability field starts with the 3 letter name of the ability, eg. `STR` for strength and `CON`for constitution.
The modifier field ends with `MOD` and the score field ends with `SCORE`.
Eg. the charisma modifier is `CHA_MOD` and the intelligence score is `INT_SCORE`.

## Proficiencies

All proficiencies follow these convention:
- xxx_PROF_BONUS is the bonus value for property xxx given by the proficiency, eg. 2 + level for trained
- xxx_PROF_T checkbox to rank character as trained
- xxx_PROF_E checkbox to rank character as expert
- xxx_PROF_M checkbox to rank character as master
- xxx_PROF_L checkbox to rank character as legendary

## Class difficulty check

- DC_VALUE
- DC_KEY_BONUS
- DC_PROF_BONUS
- DC_PROF_T, DC_PROF_E, DC_PROF_M, DC_PROF_L, the 4 checkboxes about the proficiency rank
- DC_ITEM_BONUS

## Armor class

- AC_VALUE
- DEX_MOD - Dexterity modifier
- AC_CAP
- AC_PROF_BONUS
- AC_PROF_T, AC_PROF_E, AC_PROF_M, AC_PROF_L, the 4 checkboxes about the proficiency rank for equipped armour
- AC_ITEM_BONUS
- AC_PROF_UNARMORED_T, AC_PROF_UNARMORED_E, AC_PROF_UNARMORED_M, 
- AC_PROF_LIGHT_T, AC_PROF_LIGHT_E, AC_PROF_LIGHT_M, AC_PROF_LIGHT_L, the 4 checkboxes about the proficiency rank for light armor
- AC_PROF_MEDIUM_T, AC_PROF_MEDIUM_E, AC_PROF_MEDIUM_M, AC_PROF_MEDIUM_L, the 4 checkboxes about the proficiency rank for medium armor
- AC_PROF_HEAVY_T, AC_PROF_HEAVY_E, AC_PROF_HEAVY_M, AC_PROF_HEAVY_L, the 4 checkboxes about the proficiency rank for heavy armor
- AC_SHIELD_BONUS
- SHIELD_HARDNESS
- SHIELD_MAX_HP
- SHIELD_BROKEN_THRESHOLD
- SHIELD_CURRENT_HP

## Hit points

- HP_MAX
- HP_CURRENT
- TEMPORARY
- DYING
- WOUNDED
- RESISTANCES
- CONDITIONS

## Perception

- PERCEPTION_VALUE
- WIS_MOD
- PERCEPTION_PROF_BONUS
- PERCEPTION_PROF_T, PERCEPTION_PROF_E, PERCEPTION_PROF_M, PERCEPTION_PROF_L
- PERCEPTION_ITEM_BONUS
- SENSES

## Saving throws
- FORT_VALUE
- CON_MOD
- FORT_PROF_BONUS
- FORT_PROF_T, FORT_PROF_E, FORT_PROF_M, FORT_PROF_L
- FORT_ITEM_BONUS

- REFL_VALUE
- DEX_MOD
- REFL_PROF_BONUS
- REFL_PROF_T, REFL_PROF_E, REFL_PROF_M, REFL_PROF_L
- REFL_ITEM_BONUS

- WILL_VALUE
- WIS_MOD
- WILL_PROF_BONUS
- WILL_PROF_T, WILL_PROF_E, WILL_PROF_M, WILL_PROF_L
- WILL_ITEM_BONUS

- SAVING_THROWS_NOTES

## Speed

- SPEED
- MOVEMENT_NOTES - Movement & types notes

## Melee strikes, ranged and weapon proficiencies

All strike fields start with `W` and a number, that identifies the strike,
melee strikes are from 1 to 3, ranged strikes are from 4 to 6.

For each weapon fields are reported below, `i` represents the number of the weapon
- Wi_NAME, name
- Wi_ATTACK, attack modifier
- Wi_KEY_BONUS, strength/dexterity attack bonus
- Wi_PROF_BONUS
- Wi_PROF_T, Wi_PROF_E, Wi_PROF_M, Wi_PROF_L
- Wi_ITEM_BONUS
- Wi_DAMAGE_DICE, damage dice
- Wi_DAMAGE_BONUS, strength bonus (melee) and special bonus (ranged)
- Wi_B, bludgeoning damage check
- Wi_P, piercing damage check
- Wi_S, slashing damage check
- Wi_W_SPEC
- Wi_OTHER
- Wi_TRAITS

## Skills

Each skill has 7 or 8 fields (8th is the armor bonus value)
X represents the skill name all in upper case, YYY represents the ability 3 letter name

For each skill the fields are
- X_VALUE, skill value
- YYY_MOD, ability bonus modifier, same  
- X_PROF_BONUS, proficiency bonus
- X_PROF_T, X_PROF_E, X_PROF_M, X_PROF_L
- X_ITEM_BONUS
- X_ARMOR_BONUS

- LORE_DESC_1, text field for inputting first lore name
- LORE_DESC_2, text field for inputting second lore name
- LORE_1_VALUE, LORE_2_VALUE
- LORE_1_PROF_BONUS, LORE_2_PROF_BONUS
- LORE_1_PROF_T, LORE_2_PROF_T, LORE_1_PROF_E, LORE_2_PROF_E, LORE_1_PROF_M, LORE_2_PROF_M, LORE_1_PROF_L, LORE_2_PROF_L

## Weapon proficiencies

- WP_SIMPLE_T, WP_SIMPLE_E, WP_SIMPLE_M, WP_SIMPLE_L
- WP_MARTIAL_T, WP_MARTIAL_E, WP_MARTIAL_M, WP_MARTIAL_L
- WP_OTHER_1_T, WP_OTHER_1_E, WP_OTHER_1_M, WP_OTHER_1_L
- WP_OTHER_2_T, WP_OTHER_2_E, WP_OTHER_2_M, WP_OTHER_2_L
- WP_OTHER_1_DESC
- WP_OTHER_2_DESC

## Languages

- LANGUAGES

## Ancestry feats and abilities
All fields start with AF
- AF_S1
- AF_H1
- AF_1
- AF_5
- AF_9
- AF_13
- AF_17

## Class feats and abilities
- CF_B, background class feat
- CF_2
- CF_4
- CF_8
- CF_10
- CF_12
- CF_14
- CF_16
- CF_18
- CF_20

## Skill feats

- SF_B, Background feat
- SF_2, second level feat
- SF_4
- SF_6
- SF_8
- SF_10
- SF_12
- SF_14
- SF_16
- SF_18
- SF_20

## General feats

- GF_3, 3rd level general feat
- GF_7
- GF_11
- GF_15
- GF_19

## Class feats

- CF_1, 1st level class feat
- CF_2, 2nd level class feat
- CF_4
- CF_6
- CF_8
- CF_10
- CF_12
- CF_14
- CF_16
- CF_18
- CF_20

## Class features

- FEATURE_1_1, FEATURE_1_2, 1st level features
- FEATURE_3, 3rd level feature
- FEATURE_5
- FEATURE_7
- FEATURE_9
- FEATURE_11
- FEATURE_13
- FEATURE_15
- FEATURE_17
- FEATURE_19

## Bonus feats

- BF_1, 1st bonus feat
- BF_2, 2nd bonus feat

## Inventory

Each inventory item should appear in 2 (or 3, for Invest) fields.
This should help printing out a readable table.
- WORN_ITEMS_LIST
- WORN_ITEMS_INVEST
- WORN_ITEMS_BULK
- READIED_ITEMS_LIST
- READIED_ITEMS_BULK
- OTHER_ITEMS_LIST
- OTHER_ITEMS_BULK
- CURRENT_BULK
- ENCUMBERED_BULK
- MAXIMUM_BULK

Pieces
- COPPER
- SILVER
- GOLD
- SILVER

# Charcter sketch
- CHARACTER_SKETCH
- ETHNICITY
- NATIONALITY
- BIRTHPLACE
- AGE
- GENDER_PRONOUNS
- HT
- WT

# Personality
- ATTITUDE
- BELIEFS
- LIKES
- DISLIKES
- CATCHPHRASE

# Campaign notes
- CAMPAIGN_NOTES
- ALLIES
- ENEMIES
- ORGANIZATIONS

# Actions and activities

Actions and activities fields always start with AAi_, where i is a number from 1 to 6.
- AAi_NAME, name of action/activity number i
- AAi_ACTIONS
- AAi_TRAITS
- AAi_PAGE
- AAi_DESCRITION

# Free actions and reactions
Free actions and reactions fields always start with FAi_, where i is a number from 1 to 6.
- FAi_NAME, name of the free action
- FAi_FREEACTION, checkbox to mark a free action
- FAi_REACTION, checkbox to mark a reaction
- FAi_TRAITS
- FAi_PAGE
- FAi_TRIGGER
- FAi_DESCRIPTION

# Spell Attack Roll

- SPELL_ATTACK_VALUE, spell attack roll bonus value
- SPELL_ATTACK_KEY_BONUS, key ability modifier bonus for spell attacks
- SPELL_ATTACK_PROF_BONUS, proficiency bonus
- SPELL_ATTACK_PROF_T, SPELL_ATTACK_PROF_E, SPELL_ATTACK_PROF_M, SPELL_ATTACK_PROF_L

# Spell DC

- SPELL_DC_VALUE
- SPELL_DC_KEY_BONUS
- SPELL_DC_PROF_BONUS
- SPELL_DC_PROF_T, SPELL_DC_PROF_E, SPELL_DC_PROF_M, SPELL_DC_PROF_L

# Magic Traditions

All fields below are check boxes
- ARCANE
- PRIMAL
- OCCULT
- DIVINE
- PREPARED
- SPONTANEOUS

# Spell slots per day

Each spell slot level field starts with SSi_, where i is the spell level (from 1 to 10)
- CANTRIP_LEVEL
- SSi_MAX, maximum number of spell slots for level i spells
- SSi_REMAINING, remaining spell slots for level i spells

# Cantrips

- CANi_NAME
- CANi_PREP, check if cantrip is prepared
- CANi_DESCRIPTION
- CANi_ACTIONS, number of actions required by the cantrip
- CANi_M, check for material components
- CANi_S, check for somatic components
- CANi_V, check for verbal components

# Innate spells

- INNi_NAME
- INNi_DESCRIPTION
- INNi_FREQ
- INNi_M
- INN2_S

# Focus spells

- FOCUS_POINTS_CURRENT
- FOCUS_POINTS_MAXIMUM
- FSi_NAME, name of focus spell i (i goes from 1 to 4)
- FSi_ACTIONS

# Spells

- SPELLi_NAME
- SPELLi_PREP
- SPELL1_DESCRIPTION
- SPELLi_ACTIONS
- SPELLi_M
- SPELLi_S
- SPELLi_V

## TODO
- API add full data about class infos
- API add full data about character._class
- API add full data about spells/feats/cantrips
- Remove fist and improvised weapon from items list
- Items bonus
- Shield
- Item effects/bonus/malus
- Class features
- Third lore
- Actions and activities (which actions are worth writing?)
- Free actions and reactions (which actions are worth writing?)
- Cantrips, extra info
- Spells, extra info
- Innate spells
- Focus spells
- Add extra page about feats
