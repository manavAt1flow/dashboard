import { z } from "zod";

export const serverSchema = z.object({
  DATABASE_URL: z.string().url(),
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

export const validateEnv = () => {
  if (process.env.NODE_ENV === "production") return;

  const parsed = merged.safeParse(process.env);

  if (!parsed.success) {
    console.error(
      "❌ Invalid environment variables:\n",
      ...formatErrors(parsed.error.format())
    );
    throw new Error("Invalid environment variables");
  }
};

// validate env variables
validateEnv();
