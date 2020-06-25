import mapResponse from "./mapResponse"
import mapBody from "./mapBody"
import validate from "./validate"
import type { Domain, Path, RequestHeaders, ResolvedRequest } from "../methods/fetch"
import type { QueryParams } from "../methods/queryParams"

export type IdKey = string
type MapResponse = (response: unknown) => unknown
type MapBody = (body: unknown) => unknown
type Validate = (result?: unknown) => boolean
export type InvalidHandling = "silent" | "warn" | "abort"
type AfterMethod = (request: ResolvedRequest) => void

export type APIConfig = {
  domain?: Domain
  path?: Path
  name?: Path
  suffix?: Path
  params?: QueryParams
  additionalHeaders?: RequestHeaders
}
type BaseConfig = {
  api?: APIConfig
  idKey: IdKey
  mapResponse: MapResponse
  mapBody: MapBody
  validate: Validate
  invalidHandling: InvalidHandling
  afterSuccess: AfterMethod
  afterFailure: AfterMethod
}
type SubConfig = {
  index?: Partial<BaseConfig>
  create?: Partial<BaseConfig>
  read?: Partial<BaseConfig>
  update?: Partial<BaseConfig>
  del?: Partial<BaseConfig>
}
export type Config = BaseConfig & SubConfig

const afterMethod = () => {} // eslint-disable-line @typescript-eslint/no-empty-function

export const defaultConfig: Config = {
  api: undefined,
  idKey: "id",
  mapResponse,
  mapBody,
  validate,
  invalidHandling: "abort",
  afterSuccess: afterMethod,
  afterFailure: afterMethod
}
