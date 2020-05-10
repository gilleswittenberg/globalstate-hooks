// JSON
declare type JSONValue = boolean | number | string | null | JSONObject | JSONArray
declare type JSONArray = JSONValue[]
declare type JSONObject = Record<string, JSONValue>

// Item
declare type Index = number
declare type Id = number | string
// @TODO: Make key `id` configurable
declare type IdentifyBy = "ID" | "INDEX"
declare type Identifiable = { id: Id }
declare type Identify = <Schema>(items: Schema[], id: Id) => Index

// Request
declare type Domain = string
declare type Path = string
declare type Suffix = string
declare type QueryParams = Record<string, string | number>
declare type RequestURL = string
declare type Method = "GET" | "POST" | "PUT" | "PATCH" | "DELETE"
declare type MethodHandlers = {
  get: (url: RequestURL) => Promise<ResolvedRequest>
  post: (url: RequestURL, body: RequestBody) => Promise<ResolvedRequest>
  put: (url: RequestURL, body: RequestBody) => Promise<ResolvedRequest>
  patch: (url: RequestURL, body: RequestBody) => Promise<ResolvedRequest>
  del: (url: RequestURL) => Promise<ResolvedRequest>
}
declare type RequestHeaders = Record<string, string>
declare type RequestBody = JSONValue
declare type Status = number
declare type Response = JSONValue
declare type Result = JSONValue
declare type OResult = Result | undefined
declare type ErrorMessage = string
declare type OErrorMessage = ErrorMessage | undefined
declare type ErrorMessages = ErrorMessage[]

declare type ResolvedRequest = {
  url: RequestURL
  method: Method
  headers: RequestHeaders
  body?: RequestBody
  ok: boolean
  status: Status
  response: Response
  result: OResult
  errorMessage: OErrorMessage
}
declare type ResolvedRequests = ResolvedRequest[]

// Factories, mapping, handling
declare type CreateURL = (name: string, id?: Id, suffix?: Suffix, params?: QueryParams) => RequestURL
declare type MapResponse = (result: JSONValue) => JSONValue
declare type MapBody = (body: JSONValue) => JSONValue
declare type Validate = (result: JSONValue) => JSONValue
declare type InvalidHandling = "silent" | "warn" | "abort"
declare type AfterMethod = (request: ResolvedRequest) => void

// Config
declare type APIConfig = {
  domain?: Domain
  path?: Path
  name?: Path
  suffix?: Path
  params?: QueryParams
  url?: RequestURL
}
declare type Config = {
  api: APIConfig
  additionalHeaders: RequestHeaders
  mapResponse: MapResponse
  mapBody: MapBody
  validate: Validate
  invalidHandling: InvalidHandling
  afterSuccess: AfterMethod
  afterFailure: AfterMethod
}

// State
declare type BaseState = {
  isGetting: boolean
  isPosting: boolean
  isPutting: boolean
  isPatching: boolean
  isDeleting: boolean
  data: undefined | Data | Data[]
  requests: ResolvedRequests
}
declare type ComputedState = BaseState & {
  isFetching: boolean
  isUpdating: boolean
  isInitialized: boolean
  errorMessages: ErrorMessages
  errorMessage: ErrorMessage | undefined
  hasError: boolean
}
declare type RecordState<Schema extends JSONObject> = ComputedState & { data: undefined | Schema }
declare type ItemsState<Schema extends JSONObject> = ComputedState & { data: undefined | Schema[] }

// Handle success
// @TODO: Can we use function overloading here?
declare type HandleSuccess =
  | (() => void)
  | ((result: JSONArray) => void)
  | ((result: JSONObject, id: Id) => void)
  | ((data: JSONValue, path: Path) => void)
