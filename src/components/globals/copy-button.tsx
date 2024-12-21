import { Button, ButtonProps } from "@/components/ui/button";
import { CheckIcon, CopyIcon } from "lucide-react";
import { FC, useState } from "react";

interface CopyButtonProps extends ButtonProps {
  value: string;
}

const CopyButton: FC<CopyButtonProps> = ({ value, ...props }) => {
  const [hasCopied, setHasCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(value);
    setHasCopied(true);
    setTimeout(() => setHasCopied(false), 3000);
  };

  return (
    <Button size="icon" onClick={handleCopy} {...props}>
      {hasCopied ? (
        <CheckIcon className="h-4 w-4" />
      ) : (
        <CopyIcon className="h-4 w-4" />
      )}
    </Button>
  );
};

export default CopyButton;
