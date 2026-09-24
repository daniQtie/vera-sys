import type { User } from "@supabase/supabase-js";

export function isPortfolioAdmin(user: User | null): user is User {
  return user?.app_metadata?.portfolio_role === "admin";
}
