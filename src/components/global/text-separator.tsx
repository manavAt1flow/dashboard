import { Separator } from "../ui/separator";

interface TextSeparatorProps {
  text: string;
}

export default function TextSeparator({ text }: TextSeparatorProps) {
  return (
    <div className="my-6 flex items-center gap-2">
      <Separator className="flex-grow w-auto bg-fg" />
      <span className="px-2 font-mono text-fg">{text}</span>
      <Separator className="flex-grow w-auto bg-fg" />
    </div>
  );
}
