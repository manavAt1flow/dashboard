import {
  pgTable,
  text,
  boolean,
  uuid,
  timestamp,
  integer,
  jsonb,
  varchar,
  bigint,
} from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

export const envAliases = pgTable("env_aliases", {
  alias: text("alias").primaryKey(),
  isRenamable: boolean("is_renamable"),
  envId: text("env_id"),
});

export const envBuilds = pgTable("env_builds", {
  id: uuid("id").primaryKey(),
  createdAt: timestamp("created_at", { withTimezone: true }),
  updatedAt: timestamp("updated_at", { withTimezone: true }),
  finishedAt: timestamp("finished_at", { withTimezone: true }),
  status: text("status"),
  dockerfile: text("dockerfile"),
  startCmd: text("start_cmd"),
  vcpu: bigint("vcpu", { mode: "number" }),
  ramMb: bigint("ram_mb", { mode: "number" }),
  freeDiskSizeMb: bigint("free_disk_size_mb", { mode: "number" }),
  totalDiskSizeMb: bigint("total_disk_size_mb", { mode: "number" }),
  kernelVersion: text("kernel_version"),
  firecrackerVersion: text("firecracker_version"),
  envId: text("env_id"),
  envdVersion: text("envd_version"),
});

export const envs = pgTable("envs", {
  id: text("id").primaryKey(),
  createdAt: timestamp("created_at", { withTimezone: true }),
  updatedAt: timestamp("updated_at", { withTimezone: true }),
  public: boolean("public"),
  buildCount: integer("build_count"),
  spawnCount: bigint("spawn_count", { mode: "number" }),
  lastSpawnedAt: timestamp("last_spawned_at", { withTimezone: true }),
  teamId: uuid("team_id"),
});

export const teamApiKeys = pgTable("team_api_keys", {
  apiKey: varchar("api_key", { length: 44 }).primaryKey(),
  createdAt: timestamp("created_at", { withTimezone: true }),
  teamId: uuid("team_id"),
});

export const teams = pgTable("teams", {
  id: uuid("id").primaryKey(),
  createdAt: timestamp("created_at", { withTimezone: true }),
  isDefault: boolean("is_default"),
  isBlocked: boolean("is_blocked"),
  name: text("name"),
  tier: text("tier"),
  email: varchar("email", { length: 255 }),
  isBanned: boolean("is_banned"),
  blockedReason: text("blocked_reason"),
  isFragmentsUser: boolean("is_fragments_user"),
});

export const tiers = pgTable("tiers", {
  id: text("id").primaryKey(),
  diskMb: bigint("disk_mb", { mode: "number" }),
  concurrentInstances: bigint("concurrent_instances", { mode: "number" }),
  name: text("name"),
  maxLengthHours: bigint("max_length_hours", { mode: "number" }),
});

export const usersTeams = pgTable("users_teams", {
  userId: uuid("user_id"),
  teamId: uuid("team_id"),
  isDefault: boolean("is_default"),
  id: bigint("id", { mode: "number" }).primaryKey(),
  createdAt: timestamp("created_at", { withTimezone: true }),
});

export const snapshots = pgTable("snapshots", {
  createdAt: timestamp("created_at", { withTimezone: true }),
  envId: text("env_id"),
  sandboxId: text("sandbox_id"),
  id: text("id").primaryKey(),
  metadata: jsonb("metadata"),
  baseEnvId: text("base_env_id"),
});

export const atlasSchemaRevisions = pgTable("atlas_schema_revisions", {
  version: varchar("version"),
  description: varchar("description"),
  type: integer("type"),
  applied: integer("applied"),
  total: integer("total"),
  executedAt: timestamp("executed_at"),
  executionTime: integer("execution_time"),
  error: text("error"),
  errorStmt: text("error_stmt"),
  hash: varchar("hash"),
  partialHashes: jsonb("partial_hashes"),
  operatorVersion: varchar("operator_version"),
});

export const accessTokens = pgTable("access_tokens", {
  accessToken: text("access_token").primaryKey(),
  userId: uuid("user_id"),
  createdAt: timestamp("created_at", { withTimezone: true }),
});

export const insertEnvSchema = createInsertSchema(envs);
export const selectEnvSchema = createSelectSchema(envs);
