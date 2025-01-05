import { DialogProps } from "@radix-ui/react-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Button, buttonVariants } from "../ui/button";
import { Alert, AlertDescription } from "../ui/alert";
import { InformationCircleIcon } from "@heroicons/react/24/outline";
import { useDeveloperSettings } from "@/stores/developer-settings-store";
import { useEffect } from "react";
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
import { useToast } from "@/hooks/use-toast";
import { AnimatePresence, motion } from "motion/react";
import { RefreshCcwIcon } from "lucide-react";
import { cn } from "@/lib/utils";

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

  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      domain: apiDomain,
    },
  });

  useEffect(() => {
    form.reset({ domain: apiDomain });
  }, [apiDomain, form]);

  const onSubmit = async (values: FormValues) => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    setApiDomain(values.domain);
    toast({
      title: "API domain updated",
      description: "Your API domain has been updated",
    });
  };

  const canResetToDefault =
    form.getValues("domain") !== process.env.NEXT_PUBLIC_DEFAULT_API_DOMAIN;
  const handleResetToDefault = () => {
    form.setValue("domain", process.env.NEXT_PUBLIC_DEFAULT_API_DOMAIN, {
      shouldDirty: true,
    });
  };

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
                      disabled={
                        !form.formState.isDirty || !form.formState.isValid
                      }
                      loading={form.formState.isSubmitting}
                      className="ml-2"
                    >
                      {form.formState.isSubmitting
                        ? "Saving..."
                        : "Save Domain"}
                    </Button>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
