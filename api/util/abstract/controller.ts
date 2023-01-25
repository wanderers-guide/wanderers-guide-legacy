import _ from "lodash";
import { Context, Handler, Request } from "openapi-backend";
import { Resource } from "../../resources/resourceTypes";
import { Service } from "./service";

export abstract class Controller<
  T extends Resource,
  S extends InstanceType<typeof Service<T>>
> {
  service: S;
  resourceName: T["name"];
  constructor({
    service,
    resourceName,
  }: {
    service: S;
    resourceName: T["name"];
  }) {
    this.service = service;
    this.resourceName = resourceName;
  }
  public abstract get methods(): string[];
  public exportHandlers(): { [key: string]: Handler } {
    const handlers: { [key: string]: Handler } = {};
    for (const method of this.methods) {
      handlers[
        `${this.resourceName}${_.capitalize(method[0]) + method.slice(1)}`
      ] = this[method].bind(this);
    }
    return handlers;
  }

  public async get(c: Context, req: Request, res): Promise<any> {
    const page = Number(c.request.query.page || 0);
    const pageSize = Number(c.request.query.pageSize || 100);
    

    const offset = page * pageSize;

    const data = await this.service.getPage({ offset, count: pageSize });
    const totalCount = await this.service.getTotalCount();
    res.status(200).json({
      data,
      pagination: {
        page,
        pageSize,
        totalCount,
      },
    });
  }

  public async getById(c: Context, req: Request, res): Promise<any> {
    const id = Number(c.request.params.id);

    const data = await this.service.getById({ id });
    res.status(200).json({
      data,
    });
  }

  public async create(c: Context, req: Request, res): Promise<any> {
    const createParams = c.request.body;

    const data = await this.service.create({ data: createParams });
    res.status(200).json({
      data,
    });
  }

  public async update(c: Context, req: Request, res): Promise<any> {
    const id = Number(c.request.params.id);
    const updateParams = c.request.body;

    const data = await this.service.patch({
      id,
      resourcePartial: updateParams,
    });
    res.status(200).json({
      data,
    });
  }

  public async delete(c: Context, req: Request, res): Promise<any> {
    const id = Number(c.request.params.id);

    await this.service.delete({ id });
    res.status(200);
  }
}
