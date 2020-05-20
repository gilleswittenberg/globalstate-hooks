import type { Id } from "../useRestReducer"
import type { APIConfig } from "./config"
import type { RequestURL } from "../methods/fetch"
import queryParams from "./utils/queryParams"

const appendSlash = (str: string): string => /\/$/.test(str) ? str : `${ str }/`

export default (api: APIConfig, id?: Id): RequestURL => {
  const { domain, path, name, suffix, params } = api
  return [domain, path, name, id, suffix]
    .filter((i): i is string => i !== undefined && i !== "")
    .map(s => appendSlash(s))
    .concat(queryParams(params))
    .join("")
}
