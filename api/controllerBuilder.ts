import _ from "lodash";
import OpenAPIBackend, { Handler, Request } from "openapi-backend";
import { OpenAPIV3_1 } from "openapi-types";
import { prisma as prismaType } from "./config";
import { Controller } from "./util/abstract/controller";
import { Schema } from "./util/abstract/schema";
import { Service } from "./util/abstract/service";
import { parseableJsonSchema } from "./schema/parsableSchema.js";
import { FormatDefinition } from "ajv";

const securitySchemes: Record<
  string,
  OpenAPIV3_1.SecuritySchemeObject | OpenAPIV3_1.ReferenceObject
> = {
  ApiKey: {
    type: "apiKey",
    name: "x-api-key",
    in: "header",
  },
  Oauth2: {
    type: "oauth2",
    flows: {
      authorizationCode: {
        authorizationUrl: "foo",
        tokenUrl: "bar",
        refreshUrl: "baz",
        scopes: {
          ["feat:write"]: "foo",
        },
      },
    },
  },
};

const apiSchema: OpenAPIV3_1.Document = {
  openapi: "3.0.3",
  info: {
    title: "Wanderer's Guide API v2",
    description:
      "Welcome to the Wanderer's Guide API! The goal of this documentation is to empower and inform developers in the ways they can utilize the resources Wanderer's Guide provides.",
    termsOfService: "https://wanderersguide.app/license",
    contact: {
      email: "foo@bar.io",
    },
    license: {
      name: "Open Game License 1.0",
      url: "https://wanderersguide.app/license",
    },
    version: "0.1",
  },
  externalDocs: {
    description: "Find out more about the legacy Wanderer's Guide API",
    url: "https://wanderersguide.app/api_docs",
  },
  tags: [
    {
      name: "Feat",
      description: "Pathfinder 2E Feats",
    },
  ],
  components: {
    schemas: parseableJsonSchema,
    securitySchemes: securitySchemes,
  },
  security: [{ ApiKey: [] }],
};

const schemaPath: OpenAPIV3_1.PathsObject = {
  "/docs": {
    get: {
      operationId: "getV2ApiDocs",
      summary: "Get V2 API Docs",
      responses: {
        200: {
          description:
            "Gets the OpenAPI V3 JSON spec for the v2 Wanderer's Guide API",
          content: {
            "application/json": {},
          },
        },
      },
    },
  },
};
function createSchemaHandler(schema) {
  return (context, req, res) => {
    return res.status(200).json(schema);
  };
}

const errorHandlers = {
  validationFail: async (c, req: Request, res) =>
    res.status(400).json({ err: c.validation.errors }),
  notFound: async (c, req: Request, res) =>
    res.status(404).json({ err: "not found" }),
};

export function createApi({
  prisma,
  resources,
}: {
  prisma: typeof prismaType;
  resources: {
    service: Service<any>;
    controller: Controller<any, any>;
    schema: Schema<any>;
    factory: any;
  }[];
}) {
  let paths: OpenAPIV3_1.PathsObject = { ...schemaPath };
  let handlers: { [key: string]: Handler } = {};

  for (const resource of resources) {
    paths = _.merge(paths, resource.schema.exportSchemas());
    handlers = _.merge(handlers, resource.controller.exportHandlers());
  }

  const schema = _.cloneDeep(apiSchema) as OpenAPIV3_1.Document;
  schema.paths = paths;

  handlers.getV2ApiDocs = createSchemaHandler(_.cloneDeep(schema));

  const api = new OpenAPIBackend({
    definition: schema,
    handlers: { ...errorHandlers, ...handlers },

    customizeAjv: (ajv, ajvOpts, validationContext) => {
      let dtFormat: FormatDefinition<string> = {
        type: "string",
        async: false,
        validate:
          /^\d\d\d\d-[0-1]\d-[0-3]\dt(?:[0-2]\d:[0-5]\d:[0-5]\d|23:59:60)(?:\.\d+)?(?:z|[+-]\d\d(?::?\d\d)?)$/i,
      };
      ajv.addFormat("date-time", dtFormat);
      return ajv;
    },
  });

  api.init();

  return api;
}
