import {
  feats,
  feats_actions,
  feats_rarity,
  feats_genericType,
} from "@prisma/client";
import { prisma } from "../../config.js";
import { Factory } from "fishery";
import { faker } from "@faker-js/faker";

// maybe replace in the near future with https://github.com/json-schema-faker/json-schema-faker/tree/2962d4eaab84bc2d05d1cb6838c74b36fd9ef8ae/docs


function sometimesNull(val: any, chance = 0.05) {
  return Math.random() < chance ? null : val;
}

export const FeatFactory = Factory.define<Omit<feats, "id">>(({ onCreate }) => {
  onCreate((feat) => prisma.feats.create({ data: feat }));

  const featsActions = faker.helpers.arrayElement([
    "NONE",
    "FREE_ACTION",
    "REACTION",
    "ACTION",
    "TWO_ACTIONS",
    "THREE_ACTIONS",
  ]) as feats_actions;

  const featsRarity = faker.helpers.arrayElement([
    "COMMON",
    "UNCOMMON",
    "RARE",
    "UNIQUE",
  ]) as feats_rarity;

  const featsGenericType = faker.helpers.arrayElement([
    "GENERAL_FEAT",
    "SKILL_FEAT",
    "CLASS_FEAT",
    "ARCHETYPE_FEAT",
    "ANCESTRY_FEAT",
    "BASIC_ACTION",
    "SKILL_ACTION",
    "CREATURE_ACTION",
    "COMPANION_ACTION",
  ]) as feats_genericType;

  return {
    name: sometimesNull(faker.random.words()),
    actions: sometimesNull(featsActions),
    level: faker.datatype.number({ max: 20, min: 1 }),
    rarity: featsRarity,
    prerequisites: sometimesNull(faker.random.words()),
    frequency: sometimesNull(faker.random.words()),
    cost: sometimesNull(faker.random.words()),
    trigger: sometimesNull(faker.random.words()),
    requirements: sometimesNull(faker.random.words()),
    description: sometimesNull(faker.random.words()),
    special: sometimesNull(faker.random.words()),
    canSelectMultiple: sometimesNull(Number(faker.datatype.boolean)),
    isDefault: sometimesNull(Number(faker.datatype.boolean)),
    skillID: sometimesNull(faker.random.numeric(3)),
    minProf: sometimesNull(faker.random.words()),
    code: sometimesNull(faker.random.words()),
    isCore: sometimesNull(Number(faker.datatype.boolean)),
    genericType: sometimesNull(featsGenericType),
    genTypeName: sometimesNull(faker.random.words()),
    isArchived: sometimesNull(Number(faker.datatype.boolean)),
    contentSrc: sometimesNull(faker.random.words()),
    homebrewID: sometimesNull(faker.random.numeric(3)),
    version: sometimesNull(faker.random.words()),
  };
});

