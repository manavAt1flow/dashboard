import { forwardRef } from "react";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "../ui/input";

interface ChangeDataInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  hasChanges?: boolean;
  isLoading?: boolean;
  onSave: () => void;
}

const ChangeDataInput = forwardRef<HTMLInputElement, ChangeDataInputProps>(
  (
    { className, hasChanges = false, isLoading = false, onSave, ...props },
    ref
  ) => {
    return (
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onSave();
        }}
        className="relative w-fit"
      >
        <Input ref={ref} className={cn("w-full pr-10", className)} {...props} />
        {hasChanges && (
          <Button
            size="icon"
            className="absolute right-2 top-1/2 -translate-y-1/2 h-6 w-6"
            type="submit"
            loading={isLoading}
          >
            <Check className="h-4 w-4" />
          </Button>
        )}
      </form>
    );
  }
);

ChangeDataInput.displayName = "ChangeDataInput";

export default ChangeDataInput;
