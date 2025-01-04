import { DialogProps } from "@radix-ui/react-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Button } from "../ui/button";
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
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

const formSchema = z.object({
  domain: z.string().min(1, "Domain is required"),
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
            <Alert variant="contrast2" className="mb-6 ml-2">
              <InformationCircleIcon className="h-4 w-4" />
              <AlertDescription>
                This is the domain that hosts E2B your infrastructure.
              </AlertDescription>
            </Alert>
            <FormField
              control={form.control}
              name="domain"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Domain</FormLabel>
                  <div className="mt-2 flex items-center gap-2">
                    <FormControl>
                      <Input placeholder="e2b.dev" {...field} />
                    </FormControl>
                    <Button
                      type="submit"
                      disabled={
                        !form.formState.isDirty || !form.formState.isValid
                      }
                      loading={form.formState.isSubmitting}
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
