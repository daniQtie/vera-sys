import fs from "node:fs";
import { createClient } from "@supabase/supabase-js";

const env = Object.fromEntries(
  fs.readFileSync(".env.local", "utf8")
    .split(/\r?\n/)
    .filter((line) => line && !line.startsWith("#") && line.includes("="))
    .map((line) => {
      const index = line.indexOf("=");
      return [line.slice(0, index), line.slice(index + 1).replace(/^['\"]|['\"]$/g, "")];
    }),
);

const url = env.NEXT_PUBLIC_SUPABASE_URL;
const key = env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !key) throw new Error("Supabase environment variables are missing.");

const supabase = createClient(url, key, { auth: { persistSession: false } });
const { error } = await supabase.from("skills").upsert([
  { name: "Codex", category: "tools", sort_order: 6 },
  { name: "Make.com", category: "tools", sort_order: 7 },
], { onConflict: "name" });

if (error) throw error;
const { data: verified, error: verifyError } = await supabase
  .from("skills")
  .select("name,category,sort_order")
  .in("name", ["Codex", "Make.com"])
  .order("sort_order");
if (verifyError || verified?.length !== 2) throw verifyError ?? new Error("Skill verification failed.");
console.log(`Verified live skills: ${verified.map((skill) => skill.name).join(", ")}.`);
