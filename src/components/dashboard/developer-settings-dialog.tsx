import { DialogProps } from "@radix-ui/react-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Button, buttonVariants } from "../ui/button";
import { useDeveloperSettings } from "@/stores/developer-settings-store";
import { useCallback, useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { AnimatePresence, motion } from "motion/react";
import { cn } from "@/lib/utils";
import { useTimeoutMessage } from "@/hooks/use-timeout-message";
import { AuthFormMessage } from "../auth/auth-form-message";

const formSchema = z.object({
  domain: z
    .string()
    .min(1, "Domain is required")
    .regex(
      /^[a-zA-Z0-9][a-zA-Z0-9-]{0,61}[a-zA-Z0-9]\.[a-zA-Z]{2,}$/,
      "Please enter a valid domain (e.g. e2b.dev)",
    ),
});

type FormValues = z.infer<typeof formSchema>;

interface DeveloperSettingsDialogProps extends DialogProps {}

export default function DeveloperSettingsDialog({
  ...props
}: DeveloperSettingsDialogProps) {
  const { apiDomain, setApiDomain } = useDeveloperSettings();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      domain: apiDomain,
    },
  });

  useEffect(() => {
    form.reset({ domain: apiDomain });
  }, [apiDomain, form]);

  const [message, setMessage] = useTimeoutMessage(5000);

  const onSubmit = async (values: FormValues) => {
    try {
      // delay for better UX
      await new Promise((resolve) => setTimeout(resolve, 150));

      const response = await fetch(`https://api.${values.domain}/health`);

      if (!response.ok) {
        throw new Error("Failed to verify API domain");
      }

      setApiDomain(values.domain);
      setMessage({
        success: "API domain verified and updated successfully",
      });
    } catch (error) {
      setMessage({
        error:
          "Failed to verify API domain. Please check the URL and try again",
      });

      return;
    }
  };

  const canResetToDefault =
    form.watch("domain") !== process.env.NEXT_PUBLIC_DEFAULT_API_DOMAIN;

  const handleResetToDefault = () => {
    form.setValue("domain", process.env.NEXT_PUBLIC_DEFAULT_API_DOMAIN, {
      shouldDirty: true,
    });
  };

  const isSaveDisabled =
    form.watch("domain") === apiDomain || !form.formState.isValid;

  return (
    <Dialog {...props}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Developer Settings</DialogTitle>
          <DialogDescription>
            These are developer settings & should be used with caution.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="py-6">
            <FormField
              control={form.control}
              name="domain"
              render={({ field }) => (
                <FormItem>
                  <div className="flex h-5 items-center gap-2">
                    <FormLabel>Infrastructure Domain</FormLabel>
                    <AnimatePresence mode="wait">
                      {canResetToDefault && (
                        <motion.button
                          initial={{ x: 5, opacity: 0 }}
                          animate={{ x: 0, opacity: 1 }}
                          exit={{ x: 5, opacity: 0 }}
                          transition={{
                            duration: 0.15,
                          }}
                          className={cn(
                            buttonVariants({
                              variant: "muted",
                              size: "sm",
                            }),
                            "h-5 text-xs text-accent",
                          )}
                          type="button"
                          onClick={handleResetToDefault}
                        >
                          Reset to Default
                        </motion.button>
                      )}
                    </AnimatePresence>
                  </div>
                  <FormDescription>
                    This is the domain that hosts your E2B infrastructure.
                  </FormDescription>
                  <div className="mt-2 flex items-center">
                    <FormControl>
                      <Input placeholder="e2b.dev" {...field} />
                    </FormControl>
                    <Button
                      type="submit"
                      disabled={isSaveDisabled}
                      loading={form.formState.isSubmitting}
                      className="ml-2"
                    >
                      {form.formState.isSubmitting
                        ? "Saving..."
                        : "Save Domain"}
                    </Button>
                  </div>
                  <FormMessage />
                  <AnimatePresence mode="wait">
                    {message && (
                      <AuthFormMessage
                        message={message}
                        className="!mt-4 ml-2"
                      />
                    )}
                  </AnimatePresence>
                </FormItem>
              )}
            />
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
