export type Json =
  | string
  | number
  | boolean
  | null
  | { [k: string]: Json }
  | Json[]
export type JsonObject = Record<string, Json>
export type JsonArray = Json[]
