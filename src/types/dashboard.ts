import { User } from "@supabase/supabase-js";
import { Database } from "./supabase";

export type TeamWithDefault = Database["public"]["Tables"]["teams"]["Row"] & {
  is_default?: boolean;
};

export interface InitResponse {
  teams: TeamWithDefault[];
  user: User;
}
