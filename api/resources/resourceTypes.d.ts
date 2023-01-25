import { Pisma, Prisma } from "@prisma/client";

export type Feats = {
  name: "feats";
  createArgs: Prisma.featsCreateArgs;
  updateArgs: Prisma.featsUpdateArgs;
  countArgs: Prisma.featsCountArgs;

};

export type Resource = Feats; // | Character | otherResource etc.
