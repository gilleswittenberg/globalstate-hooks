import type { ActionCreators, ItemsAction, RecordAction } from "../useRestReducer"
import type { Json } from "../types/Json"
import type { ItemsState, RecordState } from "../useRestReducer"
import type { Method, RequestURL, RequestHeaders, ResolvedRequest } from "../methods/fetch"
import type { Config } from "../config/config"
import type { Identifiable } from "../utils/identify"
import { Dispatch, useCallback } from "react"
import createUrl from "../methods/createUrl"
import { createMethods } from "../methods/fetch"
import mergeConfig from "../config/mergeConfig"
import handleInvalid from "../config/handleInvalid"

export type HandleSuccess<Schema> = {
  () : void
  (result: Partial<Schema>) : void
  (result: Schema) : void
  (result: Schema[]) : void
}

export default <
  Schema,
  Action extends ItemsAction<Schema> | RecordAction<Schema> = ItemsAction<Schema>,
  State extends ItemsState<Schema> | RecordState<Schema> = ItemsState<Schema>
>(
  handleSuccess: HandleSuccess<Schema>,
  method: Method | undefined,
  config: Config,
  actionCreators: ActionCreators,
  dispatch: Dispatch<Action>
) => {

  type MakeRequestOverload = {
    (method: "GET" | "DELETE", url: RequestURL, additionalHeaders?: RequestHeaders): Promise<ResolvedRequest>
    (method: "POST" | "PUT" | "PATCH", url: RequestURL, additionalHeaders: RequestHeaders | undefined, data: Json): Promise<ResolvedRequest>
  }

  const makeRequest: MakeRequestOverload = async (method: Method, url: RequestURL, additionalHeaders: RequestHeaders | undefined, data: Json = null) => {
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

    const { get, post, put, patch, del } = createMethods(additionalHeaders)

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

  const doHandleSuccess = (result?: Partial<Schema>) => {
    if (result !== undefined) {
      (handleSuccess as (result: Partial<Schema>) => void)(result)
    } else {
      (handleSuccess as () => void)()
    }
  }

  type ReturnLocalOverload = {
    (): Promise<void>
    (a: Schema): Promise<void>
  }
  const retLocal: ReturnLocalOverload = async (data?: Schema) => {
    doHandleSuccess(data)
  }

  type ReturnOverload = {
    (): Promise<void>
    (data: Partial<Schema>): Promise<void>
    (data: Partial<Schema>, conf: Partial<Config>): Promise<void>
  }
  const ret: ReturnOverload = async (data?: Partial<Schema>, conf?: Partial<Config>) => {
    // guards
    if (method === undefined) return

    const { api, mapResponse, mapBody, validate, invalidHandling, afterSuccess, afterFailure } = mergeConfig(conf, config)

    if (api === undefined) return

    // REST request
    const url = createUrl(api, (data as Identifiable)?.id)
    const { additionalHeaders } = api
    const mappedData = mapBody(data)
    const request =
      method === "GET" || method === "DELETE" ?
        await makeRequest(method, url, additionalHeaders) :
        await makeRequest(method, url, additionalHeaders, mappedData as Json)
    if (request.ok) {
      const result = request.result !== undefined ? mapResponse(request.result) as Schema : { id: (data as Identifiable)?.id } as Partial<Schema>
      if (handleInvalid(result, validate(result), invalidHandling)) return
      doHandleSuccess(result)
      // @TODO: Pass result, id, config
      afterSuccess(request)
    } else {
      // @TODO: Pass result (error response), id, config
      afterFailure(request)
    }
  }

  return useCallback((method !== undefined ? ret : retLocal), [config])

}
