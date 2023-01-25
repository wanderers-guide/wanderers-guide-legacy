import _ from "lodash";
import { parseableJsonSchema } from "./../../schema/parsableSchema.js";
import { OpenAPIV3_1 } from "openapi-types";
import { Resource } from "../../resources/resourceTypes";

export abstract class Schema<T extends Resource> {
  resourceName: T["name"];
  resourceDefinition;
  resourceInputDefinition;
  propertyInputParameters;
  constructor({ resourceName }: { resourceName: T["name"] }) {
    this.resourceName = resourceName;

    // Unfortunately, we lose JSON typing here. I'm not sure how to keep it

    // Fetch the definition from the schema
    // prisma unfortunately doesn't generate 'input types' so we have to do that manually here:
    this.resourceDefinition = _.cloneDeep(parseableJsonSchema[resourceName]);
    const propertiesWithoutReadOnlyValues = _.omit(
      this.resourceDefinition.properties,
      ["id"]
    );
    // we could also split this into an update type and an insert type
    // an update type has no restrictions on inputs, like this will.
    // an insert type would require certain specific properties for the insert
    this.resourceInputDefinition = {
      ...this.resourceDefinition,
      properties: propertiesWithoutReadOnlyValues,
    };
  }
  public abstract get methods();
  public exportSchemas(): OpenAPIV3_1.PathsObject {
    let schemas = {};
    for (const method of this.methods) {
      schemas = _.merge(schemas, this[method]());
    }
    return schemas;
  }

  public get(): OpenAPIV3_1.PathsObject {
    return {
      [`/${this.resourceName}`]: {
        get: {
          tags: [`${this.resourceName}`],
          summary: `Fetches a page of ${this.resourceName}.`,
          operationId: `${this.resourceName}Get`,
          parameters: [
            {
              name: "page",
              in: "query",
              description: "The page number. Pages start at 0.",
              required: false,
              schema: { type: "number", default: 0 },
            },
            {
              name: "pageSize",
              in: "query",
              description: "The size of each page Defaults to 100.",
              required: false,
              schema: { type: "number", default: 100, maximum: 500 },
            },
          ],
          responses: {
            200: {
              description: "successful operation",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      items: {
                        type: "array",
                        items: this.resourceDefinition,
                      },
                      pagination: {
                        type: "object",
                      },
                    },
                  },
                },
              },
            },
            400: {
              description: "Invalid pagination value",
            },
          },
        },
      },
    };
  }

  public create(): OpenAPIV3_1.PathsObject {
    return {
      [`/${this.resourceName}`]: {
        post: {
          tags: [`${this.resourceName}`],
          summary: `Creates a ${this.resourceName}`,
          operationId: `${this.resourceName}Create`,
          parameters: [],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  $ref: `#/components/schemas/${this.resourceName}`,
                },
              },
            },
          },
          responses: {
            200: {
              description: "successful operation",
              content: {
                "application/json": {
                  schema: this.resourceDefinition,
                },
              },
            },
            404: {
              description: `${this.resourceName} not found.`,
            },
            400: {
              description: "Invalid id value",
            },
          },
        },
      },
    };
  }

  public getById(): OpenAPIV3_1.PathsObject {
    return {
      [`/${this.resourceName}/{id}`]: {
        get: {
          tags: [`${this.resourceName}`],
          summary: `Fetches a ${this.resourceName} by its id.`,
          operationId: `${this.resourceName}GetById`,
          parameters: [
            {
              name: "id",
              description: `The ${this.resourceName} id to fetch`,
              in: "path",
              required: true,
              schema: {
                type: "number",
                format: "int64",
              },
            },
          ],
          responses: {
            200: {
              description: "successful operation",
              content: {
                "application/json": {
                  schema: this.resourceDefinition,
                },
              },
            },
            404: {
              description: `${this.resourceName} not found.`,
            },
            400: {
              description: "Invalid id value",
            },
          },
        },
      },
    };
  }

  public update(): OpenAPIV3_1.PathsObject {
    return {
      [`/${this.resourceName}/{id}`]: {
        patch: {
          tags: [`${this.resourceName}`],
          summary: `Updates a ${this.resourceName}`,
          operationId: `${this.resourceName}Update`,
          parameters: [
            {
              name: "id",
              description: `The ${this.resourceName} id to fetch`,
              in: "path",
              required: true,
              schema: {
                type: "number",
                format: "int64",
              },
            },
          ],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  $ref: `#/components/schemas/${this.resourceName}`,
                },
              },
            },
          },
          responses: {
            200: {
              description: "successful operation",
              content: {
                "application/json": {
                  schema: this.resourceDefinition,
                },
              },
            },
            404: {
              description: `${this.resourceName} not found.`,
            },
            400: {
              description: "Invalid id value",
            },
          },
        },
      },
    };
  }

  public delete(): OpenAPIV3_1.PathsObject {
    return {
      [`/${this.resourceName}/{id}`]: {
        delete: {
          tags: [`${this.resourceName}`],
          summary: `Deletes a ${this.resourceName}`,
          operationId: `${this.resourceName}Delete`,
          parameters: [
            {
              name: "id",
              description: `The ${this.resourceName} id to fetch`,
              in: "path",
              required: true,
              schema: {
                type: "number",
                format: "int64",
              },
            },
          ],
          responses: {
            200: {
              description: "successful operation",
              content: {
                "application/json": {
                  schema: this.resourceDefinition,
                },
              },
            },
            404: {
              description: `${this.resourceName} not found`,
            },
            400: {
              description: "Invalid id value",
            },
          },
        },
      },
    };
  }
}
