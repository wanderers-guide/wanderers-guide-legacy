import { Prisma, PrismaPromise } from "@prisma/client";
import { prisma as prismaType } from "./../../config.js";
import type { Resource } from "../../resources/resourceTypes";

export abstract class Service<T extends Resource> {
  prisma: typeof prismaType;
  resourceName: T["name"];
  constructor({
    prisma,
    resourceName,
  }: {
    prisma: typeof prismaType;
    resourceName: T["name"];
  }) {
    this.prisma = prisma;
    this.resourceName = resourceName;
  }
  public getById({ id }: { id: number }) {
    return this.prisma[this.resourceName].findFirst({
      where: { id },
    });
  }
  public getPage({ offset, count }: { offset: number; count: number }) {
    return this.prisma[this.resourceName].findMany({
      skip: offset,
      take: count,
      orderBy: {
        id: "asc",
      },
    });
  }
  public getTotalCount(args?: T["countArgs"]) {
    return this.prisma[this.resourceName].count(args);
  }
  public create({ data }: { data: T["createArgs"]["data"] }) {
    return this.prisma[this.resourceName].create({
      data,
    });
  }
  public patch({
    id,
    resourcePartial,
  }: {
    id: number;
    resourcePartial: T["updateArgs"]["data"];
  }) {
    return this.prisma[this.resourceName].update({
      data: resourcePartial,
      where: { id },
    });
  }
  public delete({ id }: { id: number }) {
    return this.prisma[this.resourceName].delete({ where: { id } });
  }
}
