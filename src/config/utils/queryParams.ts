const esc = encodeURIComponent
export default (params?: QueryParams): string => {
  const entries = Object.entries(params ?? {})
  const isEmpty = entries.length === 0
  return isEmpty ? "" : `?${ entries.map(([k, v]) => `${ esc(k) }=${ esc(v) }`).join("&") }`
}
