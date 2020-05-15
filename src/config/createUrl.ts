import queryParams from "./utils/queryParams"

const appendSlash = (str: string): string => /\/$/.test(str) ? str : `${ str }/`

export default (api: APIConfig, id?: Id): RequestURL => {
  const { url, domain, path, name, suffix, params } = api
  if (url !== undefined) return url
  return [domain, path, name, id, suffix]
    .filter((i): i is string => i !== undefined && i !== "")
    .map(i => appendSlash(i))
    .concat(queryParams(params))
    .join("")
}