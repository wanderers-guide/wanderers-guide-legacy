import baseSchema from "./json-schema-openapi.json";

const baseSchemaString = JSON.stringify(baseSchema);
const replacedSchemaString = baseSchemaString
  .replaceAll("#/definitions/", "#/components/schemas/")
  .replaceAll('{"nullable":true}', '{"type":"null"}');

export const parseableJsonSchema = JSON.parse(replacedSchemaString).definitions;
