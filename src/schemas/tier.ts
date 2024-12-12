import { tiers } from "@/lib/db/schema";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

const TierSchema = createSelectSchema(tiers);
const InsertTierSchema = createInsertSchema(tiers);

export { TierSchema, InsertTierSchema };

type Tier = z.infer<typeof TierSchema>;
type InsertTier = z.infer<typeof InsertTierSchema>;

export type { Tier, InsertTier };
