import { Service } from "../../util/abstract/service.js";
import { Feats } from "../resourceTypes.js";
import { prisma as prismaType, } from "./../../config.js";

export class FeatService extends Service<Feats> {
  prisma: typeof prismaType;
  constructor({ prisma }: { prisma: typeof prismaType }) {
    super({ prisma, resourceName: "feats" });
    this.prisma = prisma;
  }
  public findByName({
    name,
    offset,
    count,
  }: {
    name: string;
    offset: number;
    count: number;
  }) {
    return this.prisma.feats.findMany({
      skip: offset,
      take: count,
      where: {
        name: {
          contains: name,
        },
      },
      orderBy: {
        id: "asc",
      },
    });
  }
}

const foo = new FeatService({prisma:prismaType});
async ()=>{
const feat = await foo.getById({id:1})}