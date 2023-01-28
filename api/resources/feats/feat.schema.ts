import _ from "lodash";
import { OpenAPIV3_1 } from "openapi-types";
import { Schema } from "../../util/abstract/schema";
import { Feats } from "../resourceTypes";

export class FeatSchema extends Schema<Feats> {
  constructor() {
    super({ resourceName: "feats" });
  }
  public get methods() {
    return ["get", "getById", "findByName", "create", "update", "delete"];
  }

  findByName(): OpenAPIV3_1.PathsObject {
    return {
      "/feat/findByName": {
        get: {
          tags: ["feat"],
          summary: "Fetches a page of feats filtered by name.",
          operationId: "featsFindByName",
          parameters: [
            {
              name: "name",
              in: "query",
              description: "the name to search for",
              required: true,
              schema: { type: "string" },
            },
          ],
          responses: {
            200: {
              description: "successful operation",
              content: {
                "application/json": {
                  schema: {
                    type: "array",
                    items: { $ref: "#/components/schemas/feats" },
                  },
                },
              },
            },
            400: {
              description: "Invalid name value",
            },
          },
        },
      },
    };
  }
}
