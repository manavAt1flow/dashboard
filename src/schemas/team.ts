import { teams } from "@/lib/db/schema";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

const TeamSchema = createSelectSchema(teams);
const InsertTeamSchema = createInsertSchema(teams);

export { TeamSchema, InsertTeamSchema };

export type Team = z.infer<typeof TeamSchema>;
export type InsertTeam = z.infer<typeof InsertTeamSchema>;
