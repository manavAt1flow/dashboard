import { relations } from "drizzle-orm";
import * as schema from "./schema";

export const envsRelations = relations(schema.envs, ({ many, one }) => ({
  builds: many(schema.envBuilds),
  aliases: many(schema.envAliases),
  team: one(schema.teams, {
    fields: [schema.envs.teamId],
    references: [schema.teams.id],
  }),
}));

export const teamsRelations = relations(schema.teams, ({ many }) => ({
  envs: many(schema.envs),
  apiKeys: many(schema.teamApiKeys),
  usersTeams: many(schema.usersTeams),
}));

export const usersTeamsRelations = relations(schema.usersTeams, ({ one }) => ({
  team: one(schema.teams, {
    fields: [schema.usersTeams.teamId],
    references: [schema.teams.id],
  }),
}));

export const envBuildsRelations = relations(schema.envBuilds, ({ one }) => ({
  env: one(schema.envs, {
    fields: [schema.envBuilds.envId],
    references: [schema.envs.id],
  }),
}));

export const envAliasesRelations = relations(schema.envAliases, ({ one }) => ({
  env: one(schema.envs, {
    fields: [schema.envAliases.envId],
    references: [schema.envs.id],
  }),
}));

export const teamApiKeysRelations = relations(
  schema.teamApiKeys,
  ({ one }) => ({
    team: one(schema.teams, {
      fields: [schema.teamApiKeys.teamId],
      references: [schema.teams.id],
    }),
  })
);

export const snapshotsRelations = relations(schema.snapshots, ({ one }) => ({
  env: one(schema.envs, {
    fields: [schema.snapshots.envId],
    references: [schema.envs.id],
  }),
}));
