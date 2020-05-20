import type { Json } from "../types/Json"
export default (body?: Json): Json => body !== undefined ? body : null
