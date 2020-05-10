type ShouldAbort = boolean
export default (result: JSONValue, isValid: boolean, invalidHandling: InvalidHandling): ShouldAbort => {
  const notValid = isValid === false
  const shouldWarn = process.env.NODE_ENV !== "test" && invalidHandling !== "silent"
  if (notValid && shouldWarn) console.warn("Invalid response data", result)
  return notValid && invalidHandling === "abort"
}
