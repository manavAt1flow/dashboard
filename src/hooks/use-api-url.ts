import { useDeveloperSettings } from "@/stores/developer-settings-store";

export function useApiUrl() {
  const apiUrl = useDeveloperSettings((state) => state.apiUrl);

  return apiUrl;
}
