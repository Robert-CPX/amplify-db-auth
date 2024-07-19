import { type ClientSchema, a, defineData } from "@aws-amplify/backend";
import { schema as generatedSqlSchema } from "./schema.sql";

const schema = generatedSqlSchema
  .renameModels(() => [
    ["notes", "Note"], // Renames the models from "notes" -> "Note"
  ])
  .setAuthorization((models) => [
    // Defines owner-based authorization rule and isolates the record
    // based on the record owner. The owner is the user identifier
    // stored in the column named "owner".
    models.Note.authorization((allow) => allow.ownerDefinedIn("owner")),
  ])
  .addToSchema({
    listEventWithCoord: a
      .query()
      .returns(a.ref("EventWithCoord").array())
      .authorization((allow) => allow.authenticated())
      .handler(
        a.handler.inlineSql(`
      SELECT id, name, ST_X(geom) AS longitude, ST_Y(geom) AS latitude FROM events;
      `)
      ),

    // Defines a custom type that matches the response shape of the query
    EventWithCoord: a.customType({
      id: a.integer(),
      name: a.string(),
      latitude: a.float(),
      longitude: a.float(),
    }),
  });

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: "userPool",
  },
});
