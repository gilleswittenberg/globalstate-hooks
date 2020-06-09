import type { Optional } from "../types/Optional"
import type { Json } from "../types/Json"
import type { OErrorMessage } from "../types/ErrorMessage"

export type Domain = string
export type Path = string
export type RequestURL = string
export type Method = "GET" | "POST" | "PUT" | "PATCH" | "DELETE"
export type MethodHandlers = {
  get: (url: RequestURL) => Promise<ResolvedRequest>
  post: (url: RequestURL, body: RequestBody) => Promise<ResolvedRequest>
  put: (url: RequestURL, body: RequestBody) => Promise<ResolvedRequest>
  patch: (url: RequestURL, body: RequestBody) => Promise<ResolvedRequest>
  del: (url: RequestURL) => Promise<ResolvedRequest>
}
export type RequestHeaders = Record<string, string>
export type RequestBody = Json
export type Status = number
export type Result = Json
export type OResult = Optional<Result>

export type ResolvedRequest = {
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

export type ResolvedRequests = ResolvedRequest[]

const getHeaders = (additionalHeaders: RequestHeaders = {}): RequestHeaders => ({
  "Content-Type": "application/json",
  ...additionalHeaders
})

const parseResponse = async (response: Response): Promise<Result> => {
  const text = await response.text()
  try { return JSON.parse(text) } catch (err) {}
  return text
}

const fetch = async (url: RequestURL, method: Method = "GET", additionalHeaders: RequestHeaders = {}, body?: RequestBody, shouldParseResponse = true): Promise<ResolvedRequest> => {
  const headers = getHeaders(additionalHeaders)
  const bodyString = body !== undefined ? JSON.stringify(body) : undefined
  console.log(headers)
  const response = await window.fetch(url, { method, headers, body: bodyString })
  const ok = response.ok
  const status = response.status
  const result = response.ok && shouldParseResponse ? await parseResponse(response) : undefined
  const errorMessage = !response.ok ? await response.json() : undefined
  return {
    url,
    method,
    headers,
    body,
    ok,
    status,
    response,
    result,
    errorMessage
  }
}
export default fetch

export const createMethods = (additionalHeaders: RequestHeaders = {}): MethodHandlers => ({
  get: async (url: RequestURL) => await fetch(url, "GET", additionalHeaders),
  post: async (url: RequestURL, body: RequestBody) => await fetch(url, "POST", additionalHeaders, body),
  put: async (url: RequestURL, body: RequestBody) => await fetch(url, "PUT", additionalHeaders, body),
  patch: async (url: RequestURL, body: RequestBody) => await fetch(url, "PATCH", additionalHeaders, body),
  del: async (url: RequestURL) => await fetch(url, "DELETE", additionalHeaders, undefined, false)
})
