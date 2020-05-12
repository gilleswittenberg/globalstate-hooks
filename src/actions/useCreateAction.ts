import { Dispatch, useCallback } from "react"
import handleInvalid from "../utils/handleInvalid"
import { ActionCreators, ItemsAction, RecordAction } from "../useRestReducer"
import createUrl from "../config/createUrl"
import useMethods from "../methods/useMethods"
import createConfig from "../config/createConfig"

export default <
  Schema,
  Action extends ItemsAction<Schema> | RecordAction<Schema> = ItemsAction<Schema>,
  State extends ItemsState<Schema> | RecordState<Schema> = ItemsState<Schema>
>(
  handleSuccess: HandleSuccess,
  method: Method | undefined,
  config: Config,
  actionCreators: ActionCreators,
  dispatch: Dispatch<Action>
) => {
  const { additionalHeaders } = config
  const methods = useMethods(additionalHeaders)

  type MakeRequestOverload = {
    (method: "GET" | "DELETE", url: RequestURL): Promise<ResolvedRequest>
    (method: "POST" | "PUT" | "PATCH", url: RequestURL, data: Schema): Promise<ResolvedRequest>
  }

  const makeRequest: MakeRequestOverload = async (method: Method, url: RequestURL, data?: Schema) => {
    const {
      createStartGetting,
      createStopGetting,
      createStartPosting,
      createStopPosting,
      createStartPutting,
      createStopPutting,
      createStartPatching,
      createStopPatching,
      createStartDeleting,
      createStopDeleting,
      createAddRequest
    } = actionCreators

    const { get, post, put, patch, del } = methods

    switch (method) {
      case "GET": dispatch(createStartGetting() as Action); break
      case "POST": dispatch(createStartPosting() as Action); break
      case "PUT": dispatch(createStartPutting() as Action); break
      case "PATCH": dispatch(createStartPatching() as Action); break
      case "DELETE": dispatch(createStartDeleting() as Action); break
    }

    const resolvedRequest =
      method === "GET" ? await get(url) :
      method === "POST" ? await post(url, data) :
      method === "PUT" ? await put(url, data) :
      method === "PATCH" ? await patch(url, data) :
      method === "DELETE" ? await del(url) :
      undefined as never

    switch (method) {
      case "GET": dispatch(createStopGetting() as Action); break
      case "POST": dispatch(createStopPosting() as Action); break
      case "PUT": dispatch(createStopPutting() as Action); break
      case "PATCH": dispatch(createStopPatching() as Action); break
      case "DELETE": dispatch(createStopDeleting() as Action); break
    }

    dispatch(createAddRequest(resolvedRequest) as Action)
    return resolvedRequest
  }

  type DoHandleSuccessOverload = {
    (): void
    (a: JSONObject | JSONValue, id?: Id | Path): void
    (a: JSONValue): void
  }
  const doHandleSuccess: DoHandleSuccessOverload = (result?: JSONObject | JSONArray | JSONValue, id?: Id | Path) => {
    if (id !== undefined) {
      (handleSuccess as (result: JSONObject | JSONValue, id: Id | Path) => void)(result, id)
    } else if (result !== undefined) {
      (handleSuccess as (result: JSONArray) => void)(result)
    } else {
      (handleSuccess as () => void)()
    }
  }

  type ReturnLocalOverload = {
    (): Promise<void>
    (a: Schema | JSONValue): Promise<void>
    (a: Id, b: Schema): Promise<void>
    (a: Path, b: JSONValue): Promise<void>
  }
  const retLocal: ReturnLocalOverload = async (a?: Id | Path | Schema | JSONValue, b?: Schema | JSONValue) => {
    const bb = b !== undefined ? b : a
    const aa = b !== undefined ? a : undefined
    doHandleSuccess(bb, aa as Id | Path)
  }

  type ReturnOverload = {
    (a: Id | Schema | undefined, b: Schema | undefined, conf: Partial<Config>): Promise<void>
    (a: Id, b: Schema): Promise<void>
    (a: Id): Promise<void>
    (a: Schema): Promise<void>
    (): Promise<void>
  }
  const ret: ReturnOverload = async (a?: Id | Schema, b?: Schema, conf?: Partial<Config>) => {
    // guards
    if (method === undefined) return

    // params
    const isId = (a: Id | Schema | undefined): a is Id => typeof a === "string" || typeof a === "number"
    const id: OId = isId(a) ? a : undefined
    const data: Schema | undefined = b !== undefined ? b : a !== undefined && !isId(a) ? a : undefined

    const { api, mapResponse, mapBody, validate, invalidHandling, afterSuccess, afterFailure } = createConfig(conf, config)

    // REST request
    const url = createUrl(api, id)
    const mappedData = data !== undefined ? mapBody(data) : undefined
    const request =
      method === "GET" || method === "DELETE" ?
        await makeRequest(method, url) :
        await makeRequest(method, url, mappedData)
    if (request.ok) {
      const result = mapResponse(request.result)
      if (handleInvalid(result, validate(result), invalidHandling)) return
      doHandleSuccess(result, id)
      // @TODO: Pass result, id, config
      afterSuccess(request)
    } else {
      // @TODO: Pass result, id, config
      afterFailure(request)
    }
  }

  return useCallback(method !== undefined ? ret : retLocal, [])
}
