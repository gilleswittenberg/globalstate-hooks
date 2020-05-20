import type { InvalidHandling } from "../config/config"

// returns a boolean that indicates if the caller should abort
export default (result: unknown, isValid: boolean, invalidHandling: InvalidHandling) => {
  const notValid = isValid === false
  const shouldWarn = process.env.NODE_ENV !== "test" && invalidHandling !== "silent"
  if (notValid && shouldWarn) console.warn("Invalid response data", result)
  return notValid && invalidHandling === "abort"
}
