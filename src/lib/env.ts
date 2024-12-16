import { z } from "zod";

export const serverSchema = z.object({
  SUPABASE_SERVICE_ROLE_KEY: z.string(),
  VERCEL_URL: z.string().optional(),
});

export const clientSchema = z.object({
  NEXT_PUBLIC_SUPABASE_URL: z.string().url(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1),
});

/**
 * You can't destruct `process.env` as a regular object, so we do
 * a simple validation of the environment variables we need.
 */
export const formatErrors = (
  errors: z.ZodFormattedError<Map<string, string>, string>
) =>
  Object.entries(errors)
    .map(([name, value]) => {
      if (value && "_errors" in value)
        return `${name}: ${value._errors.join(", ")}\n`;
    })
    .filter(Boolean);

const merged = serverSchema.merge(clientSchema);
export type Env = z.infer<typeof merged>;
