import { envAliases, envBuilds, envs } from "@/lib/db/schema";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

const EnvAliasSchema = createSelectSchema(envAliases);
const InsertEnvAliasSchema = createInsertSchema(envAliases);

const EnvBuildSchema = createSelectSchema(envBuilds);
const InsertEnvBuildSchema = createInsertSchema(envBuilds);

const EnvsSchema = createSelectSchema(envs);
const InsertEnvsSchema = createInsertSchema(envs);

export {
  EnvAliasSchema,
  InsertEnvAliasSchema,
  EnvBuildSchema,
  InsertEnvBuildSchema,
  EnvsSchema,
  InsertEnvsSchema,
};

type EnvAlias = z.infer<typeof EnvAliasSchema>;
type InsertEnvAlias = z.infer<typeof InsertEnvAliasSchema>;

type EnvBuild = z.infer<typeof EnvBuildSchema>;
type InsertEnvBuild = z.infer<typeof InsertEnvBuildSchema>;

type Envs = z.infer<typeof EnvsSchema>;
type InsertEnvs = z.infer<typeof InsertEnvsSchema>;

export type {
  EnvAlias,
  InsertEnvAlias,
  EnvBuild,
  InsertEnvBuild,
  Envs,
  InsertEnvs,
};
