/**
 * Shared domain types for GigAI Bharat.
 * Database types are generated from Supabase — run `npm run db:types` at repo root.
 */
export type { Database, Json } from "./database";

export type AppRole = "worker" | "admin" | "city_ops";

export type Platform =
  | "Swiggy"
  | "Zomato"
  | "Uber"
  | "Rapido"
  | "Ola"
  | "Dunzo"
  | "Direct_GigAI"
  | "Other";

export interface ParsedEarningRow {
  platform: Platform | string;
  amount_earned: number;
  trips?: number;
  date: string;
}

export interface ParseEarningResponse {
  rows: ParsedEarningRow[];
  confidence: number;
}
