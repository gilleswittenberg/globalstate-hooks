// Helper types
type Optional<T> = T | undefined
type Plural<T> = T[]

// Json
type Json =
  | string
  | number
  | boolean
  | null
  | { [k: string]: Json }
  | Json[]
declare type JsonObject = Record<string, Json>
declare type JsonArray = Json[]

// Item
declare type Index = number
declare type Id = number | string
declare type OId = Optional<Id>
declare type Key = string
declare type KeyPath = Plural<Key | Index>

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
declare type RequestBody = Json
declare type Status = number
declare type Result = Json
declare type OResult = Optional<Result>
declare type ErrorMessage = string
declare type OErrorMessage = Optional<ErrorMessage>
declare type ErrorMessages = Plural<ErrorMessage>

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
declare type MapResponse = (result?: Json) => Json | undefined
declare type MapBody = (body?: Json) => Json
declare type Validate = (result?: Json) => boolean
declare type InvalidHandling = "silent" | "warn" | "abort"
declare type AfterMethod = (request: ResolvedRequest) => void

// Config
declare type APIConfig = {
  domain?: Domain
  path?: Path
  name?: Path
  suffix?: Path
  params?: QueryParams
  additionalHeaders?: RequestHeaders
}
declare type BaseConfig = {
  api?: APIConfig
  mapResponse: MapResponse
  mapBody: MapBody
  validate: Validate
  invalidHandling: InvalidHandling
  afterSuccess: AfterMethod
  afterFailure: AfterMethod
}
declare type SubConfig = {
  index?: Partial<BaseConfig>
  create?: Partial<BaseConfig>
  read?: Partial<BaseConfig>
  update?: Partial<BaseConfig>
  del?: Partial<BaseConfig>
}
declare type Config = BaseConfig & SubConfig

// State
declare type BaseState<Data = any> = {
  isGetting: boolean
  isPosting: boolean
  isPutting: boolean
  isPatching: boolean
  isDeleting: boolean
  data: undefined | Data
  requests: ResolvedRequests
}
declare type ComputedState<Data = any> = BaseState<Data> & {
  isFetching: boolean
  isUpdating: boolean
  isInitialized: boolean
  errorMessages: ErrorMessages
  errorMessage: ErrorMessage | undefined
  hasError: boolean
}
declare type DefaultSchema = JsonObject
declare type RecordState<Schema extends DefaultSchema> = ComputedState<Schema>
declare type ItemsState<Schema extends DefaultSchema> = ComputedState<Plural<Schema>>

// Handle success
declare type HandleSuccess<Schema extends DefaultSchema> = {
  () : void;
  (id: Id | KeyPath) : void;
  (result: Schema) : void;
  (result: Schema[]) : void;
  (result: Schema, id: Id | KeyPath) : void;
}
