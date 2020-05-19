export type RequestHeaders = Record<string, string>
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
