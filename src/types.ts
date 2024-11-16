import type { D1Database } from "@cloudflare/workers-types";

export interface Env {
  MAX_LEN?: string;
  DB: D1Database;
  PUSHOVER_APP_API_TOKEN?: string;
  PUSHOVER_USER_KEY?: string;
}
