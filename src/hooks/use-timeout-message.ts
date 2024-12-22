import { useEffect, useState } from "react";
import { AuthMessage } from "@/components/auth/auth-form-message";

export function useTimeoutMessage(timeout: number = 5000) {
  const [message, setMessage] = useState<AuthMessage | null>(null);

  useEffect(() => {
    if (!message) return;

    const timeoutId = setTimeout(() => {
      setMessage(null);
    }, timeout);

    return () => clearTimeout(timeoutId);
  }, [message, timeout]);

  return [message, setMessage] as const;
}
