import { Loader } from "@/components/ui/loader";

export default function LoadingPage() {
  return (
    <div className="fixed inset-0 flex items-center justify-center">
      <Loader variant="compute" />
    </div>
  );
}
