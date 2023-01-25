import { Context, Request } from "openapi-backend";
import { Controller } from "../../util/abstract/controller";
import { Feats } from "../resourceTypes";
import { FeatService } from "./feat.service";

export class FeatController extends Controller<Feats, FeatService> {
  constructor({ service }: { service: InstanceType<typeof FeatService> }) {
    super({ service, resourceName: "feats" });
  }
  public get methods() {
    return ["get", "getById", "findByName", "create", "update", "delete"];
  }

  public async findByName(c: Context, req: Request, res): Promise<any> {
    const name = c.request.body.name;
    const page = Number(c.request.query.page || 0);
    const pageSize = Number(c.request.query.pageSize || 100);

    const offset = page * pageSize;

    const names = await this.service.findByName({
      name,
      offset,
      count: pageSize,
    });
    const totalCount = await this.service.getTotalCount({
      where: { name: { contains: name } },
    });
    return res.status(200).json({
      data: names,
      pagination: {
        page,
        pageSize,
        totalCount,
      },
    });
  }
}
