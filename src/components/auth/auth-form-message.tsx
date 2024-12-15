import { Alert, AlertDescription } from "@/components/ui/alert";
import { cn } from "@/lib/utils";
import { CheckCircle2, AlertCircle, Info } from "lucide-react";

export type AuthMessage =
  | { success: string }
  | { error: string }
  | { message: string };

export function AuthFormMessage({
  className,
  message,
}: {
  className?: string;
  message: AuthMessage;
}) {
  return (
    <div className={cn("flex flex-col gap-2 w-full max-w-md", className)}>
      {"success" in message && (
        <Alert variant="contrast1" className="border-l-4">
          <CheckCircle2 className="h-4 w-4" />
          <AlertDescription>{message.success}</AlertDescription>
        </Alert>
      )}
      {"error" in message && (
        <Alert variant="error" className="border-l-4">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{message.error}</AlertDescription>
        </Alert>
      )}
      {"message" in message && (
        <Alert variant="contrast2" className="border-l-4">
          <Info className="h-4 w-4" />
          <AlertDescription>{message.message}</AlertDescription>
        </Alert>
      )}
    </div>
  );
}
