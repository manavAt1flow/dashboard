"use client";

import { User } from "@supabase/supabase-js";
import { createContext, useContext, useEffect, useState } from "react";
import { Database } from "@/types/supabase";

// we use a provider here to pass the ssr user to the client
// --> avoids prop drilling and flash of unauthenticated content

export interface UserData {
  user: User | null;
  accessToken: Database["public"]["Tables"]["access_tokens"]["Row"] | null;
}

interface UserContextType {
  data: UserData | null;
  setData: React.Dispatch<React.SetStateAction<UserData | null>>;
}

const UserContext = createContext<UserContextType>({
  data: null,
  setData: () => {},
});

interface UserProviderProps {
  children: React.ReactNode;
  initialUserData?: UserData | null;
}

export function UserProvider({ children, initialUserData }: UserProviderProps) {
  const [data, setData] = useState<UserData | null>(initialUserData || null);

  useEffect(() => {
    setData(initialUserData || null);
  }, [initialUserData]);

  return (
    <UserContext.Provider value={{ data, setData }}>
      {children}
    </UserContext.Provider>
  );
}

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
