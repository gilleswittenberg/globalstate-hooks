export default (value: unknown) => {
  if (value === undefined) return true
  if (value === null) return true
  return ["boolean", "number", "string"].includes(typeof value)
}
