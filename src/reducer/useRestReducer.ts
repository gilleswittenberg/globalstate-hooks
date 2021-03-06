import type { Optional } from "../types/Optional"
import type { Plural } from "../types/Plural"
import type { JsonObject } from "../types/Json"
import type { ErrorMessage, ErrorMessages } from "../types/ErrorMessage"
import type { ResolvedRequest, ResolvedRequests } from "../methods/fetch"
import {useMemo, useReducer} from "react"
import produce from "immer"
import isSimpleValue from "../utils/isSimpleValue"

export type Index = number
export type Uuid = string
export type Id = number | Uuid
export type OId = Optional<Id>
export type Key = string
export type KeyPath = Plural<Key | Index>


export type BaseState<Schema = any> = {
  isGetting: boolean
  isPosting: boolean
  isPutting: boolean
  isPatching: boolean
  isDeleting: boolean
  data: undefined | Schema
  requests: ResolvedRequests
}

export type ComputedState<Schema = any> = BaseState<Schema> & {
  isFetching: boolean
  isUpdating: boolean
  isInitialized: boolean
  errorMessages: ErrorMessages
  errorMessage: ErrorMessage | undefined
  hasError: boolean
}
export type RecordState<Schema> = ComputedState<Schema>
export type ItemsState<Schema> = ComputedState<Plural<Schema>>

export type Action =
  | { type: "SET_IS_GETTING", payload: { isGetting: boolean } }
  | { type: "SET_IS_POSTING", payload: { isPosting: boolean } }
  | { type: "SET_IS_PUTTING", payload: { isPutting: boolean } }
  | { type: "SET_IS_PATCHING", payload: { isPatching: boolean } }
  | { type: "SET_IS_DELETING", payload: { isDeleting: boolean } }
  | { type: "ADD_REQUEST", payload: { request: ResolvedRequest } }
  | { type: "CLEAR" }

type UpdatePartialRecordAction<Schema> = { type: "UPDATE_PARTIAL", payload: { path: KeyPath, data: Schema } }
export type RecordAction<Schema> =
  | Action
  | UpdatePartialRecordAction<Schema>
  | { type: "SET_DATA", payload: { data: Schema } }
  | { type: "UPDATE_DATA", payload: { data: Partial<Schema> } }

type UpdatePartialItemsAction<Schema> = { type: "UPDATE_PARTIAL", payload: { path: KeyPath, data: Schema[] } }
export type ItemsAction<Schema> =
  | Action
  | UpdatePartialItemsAction<Schema>
  | { type: "SET_ITEMS", payload: { items: Schema[] } }
  | { type: "ADD_ITEM", payload: { item: Schema } }
  | { type: "UPDATE_ITEM", payload: { index: Index, item: Schema } }
  | { type: "REMOVE_ITEM", payload: { index: Index } }

const computeState = <State extends BaseState>(state: State): ComputedState => {
  const { isGetting, isPosting, isPutting, isPatching, isDeleting, data, requests } = state
  const isUpdating = isPosting || isPutting || isPatching || isDeleting
  const isFetching = isGetting || isUpdating
  const isInitialized = data !== undefined
  const errorMessages = requests
    .filter(request => request.ok === false && request.errorMessage !== undefined)
    .map(request => request.errorMessage) as ErrorMessages
  const errorMessage = requests[requests.length - 1]?.errorMessage
  const hasError = errorMessage !== undefined
  return {
    ...state,
    isFetching,
    isUpdating,
    isInitialized,
    errorMessages,
    errorMessage,
    hasError
  }
}

export const initialState = computeState({
  isGetting: false,
  isPosting: false,
  isPutting: false,
  isPatching: false,
  isDeleting: false,
  data: undefined,
  requests: []
})

export const createStartGetting = (): Action => ({ type: "SET_IS_GETTING", payload: { isGetting: true } })
export const createStopGetting = (): Action => ({ type: "SET_IS_GETTING", payload: { isGetting: false } })
export const createStartPosting = (): Action => ({ type: "SET_IS_POSTING", payload: { isPosting: true } })
export const createStopPosting = (): Action => ({ type: "SET_IS_POSTING", payload: { isPosting: false } })
export const createStartPutting = (): Action => ({ type: "SET_IS_PUTTING", payload: { isPutting: true } })
export const createStopPutting = (): Action => ({ type: "SET_IS_PUTTING", payload: { isPutting: false } })
export const createStartPatching = (): Action => ({ type: "SET_IS_PATCHING", payload: { isPatching: true } })
export const createStopPatching = (): Action => ({ type: "SET_IS_PATCHING", payload: { isPatching: false } })
export const createStartDeleting = (): Action => ({ type: "SET_IS_DELETING", payload: { isDeleting: true } })
export const createStopDeleting = (): Action => ({ type: "SET_IS_DELETING", payload: { isDeleting: false } })
export const createAddRequest = (request: ResolvedRequest): Action => ({ type: "ADD_REQUEST", payload: { request } })
export const createClear = (): Action => ({ type: "CLEAR" })

export const createSetData = <Schema>(data: Schema): RecordAction<Schema> => ({ type: "SET_DATA", payload: { data } })
export const createUpdateData = <Schema>(data: Partial<Schema>): RecordAction<Schema> => ({ type: "UPDATE_DATA", payload: { data } })

export const createSetItems = <Schema>(items: Schema[]): ItemsAction<Schema> => ({ type: "SET_ITEMS", payload: { items } })
export const createAddItem = <Schema>(item: Schema): ItemsAction<Schema> => ({ type: "ADD_ITEM", payload: { item } })
export const createUpdateItem = <Schema>(index: Index, item: Schema): ItemsAction<Schema> => ({ type: "UPDATE_ITEM", payload: { index, item } })
export const createRemoveItem = <Schema>(index: Index): ItemsAction<Schema> => ({ type: "REMOVE_ITEM", payload: { index } })

export const createUpdatePartial = <Schema>(path: KeyPath, data: Schema | Schema[]) => {
  const action = { type: "UPDATE_PARTIAL", payload: { path, data } }
  return Array.isArray(data) ? action as ItemsAction<Schema> : action as RecordAction<Schema>
}

const actionCreators = {
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
  createAddRequest,
  createClear
}
export type ActionCreators = typeof actionCreators
const createActionCreatorsRecord = <Schema>() => ({
  ...actionCreators,
  createSetData: createSetData as (data: Schema | undefined) => RecordAction<Schema>,
  createUpdatePartial: createUpdatePartial as (path: KeyPath, data: Schema) => RecordAction<Schema>
})

const createActionCreatorsItems = <Schema>() => ({
  ...actionCreators,
  createSetItems: createSetItems as (items: Schema[]) => ItemsAction<Schema>,
  createAddItem: createAddItem as (item: Schema) => ItemsAction<Schema>,
  createUpdateItem: createUpdateItem as (index: Index, item: Schema) => ItemsAction<Schema>,
  createRemoveItem: createRemoveItem as (index: Index) => ItemsAction<Schema>,
  createUpdatePartial: createUpdatePartial as (path: KeyPath, data: Schema[]) => ItemsAction<Schema>
})

const isBaseActionType = (type: string): boolean =>
  type === "SET_IS_GETTING" ||
  type === "SET_IS_POSTING" ||
  type === "SET_IS_PUTTING" ||
  type === "SET_IS_PATCHING" ||
  type === "SET_IS_DELETING" ||
  type === "ADD_REQUEST" ||
  type === "CLEAR"

const baseReducer = (state: BaseState, action: Action): BaseState => {
  switch (action.type) {
    case "SET_IS_GETTING": {
      const { isGetting } = action.payload
      return computeState({ ...state, isGetting })
    }
    case "SET_IS_POSTING": {
      const { isPosting } = action.payload
      return computeState({ ...state, isPosting })
    }
    case "SET_IS_PUTTING": {
      const { isPutting } = action.payload
      return computeState({ ...state, isPutting })
    }
    case "SET_IS_PATCHING": {
      const { isPatching } = action.payload
      return computeState({ ...state, isPatching })
    }
    case "SET_IS_DELETING": {
      const { isDeleting } = action.payload
      return computeState({ ...state, isDeleting })
    }
    case "ADD_REQUEST": {
      const { request } = action.payload
      const { requests } = state
      const nextRequests = produce(requests, (draft: ResolvedRequests) => {
        draft.push(request)
      })
      return computeState({ ...state, requests: nextRequests })
    }
    case "CLEAR":
      return initialState
    default:
      return state
  }
}

const updatePartial = <
    Schema,
    State extends RecordState<Schema> | ItemsState<Schema>,
    Action extends UpdatePartialRecordAction<Schema> | UpdatePartialItemsAction<Schema>
  >(state: State, action: Action): State => {
  const { path, data: updateData } = action.payload
  const { data } = state
  const nextData = produce(data, (draft: Schema | Schema[]) => {
    // @TODO: Find better way for generic length of path
    // @TODO: Optional chaining
    const l = path.length
    // @ts-ignore
    if (l === 1) { draft[path[0]] = updateData }
    // @ts-ignore
    if (l === 2) { draft[path[0]][path[1]] = updateData }
    // @ts-ignore
    if (l === 3) { draft[path[0]][path[1]][path[2]] = updateData }
    // @ts-ignore
    if (l === 4) { draft[path[0]][path[1]][path[2]][path[3]] = updateData }
    // @ts-ignore
    if (l === 5) { draft[path[0]][path[1]][path[2]][path[3]][path[4]] = updateData }
    // @ts-ignore
    if (l === 6) { draft[path[0]][path[1]][path[2]][path[3]][path[4]][path[5]] = updateData }
  })
  return { ...state, data: nextData }
}

export const recordReducer = <Schema>(state: RecordState<Schema>, action: RecordAction<Schema>): RecordState<Schema> => {
  if (isBaseActionType(action.type)) return baseReducer(state, action as Action) as RecordState<Schema>
  switch (action.type) {
    case "SET_DATA": {
      const { data } = action.payload
      return computeState<RecordState<Schema>>({ ...state, data })
    }
    case "UPDATE_DATA": {
      const { data } = action.payload
      const { data: prevData = {} } = state
      // @TODO: Delete keys
      // @TODO: Deep merge
      const nextData = isSimpleValue(data) || isSimpleValue(prevData) ? data : { ...prevData as JsonObject, ...data as Partial<JsonObject> }
      return computeState<RecordState<Schema>>({ ...state, data: nextData } as RecordState<Schema>)
    }
    case "UPDATE_PARTIAL": {
      return computeState(updatePartial<Schema, RecordState<Schema>, UpdatePartialRecordAction<Schema>>(state, action))
    }
    default:
      return state
  }
}

export const itemsReducer = <Schema>(state: ItemsState<Schema>, action: ItemsAction<Schema>): ItemsState<Schema> => {
  if (isBaseActionType(action.type)) return baseReducer(state, action as Action) as ItemsState<Schema>
  switch (action.type) {
    case "SET_ITEMS": {
      const { items } = action.payload
      return computeState({ ...state, data: items } as ItemsState<Schema>)
    }
    case "ADD_ITEM": {
      const { item } = action.payload
      const { data = []} = state
      const nextData = produce(data, (draft: Schema[]) => {
        draft.push(item)
      })
      return computeState({ ...state, data: nextData }) as ItemsState<Schema>
    }
    case "UPDATE_ITEM": {
      const { index, item } = action.payload
      const { data = []} = state
      const nextData = produce(data, (draft: Schema[]) => {
        draft[index] = item
      })
      return computeState({ ...state, data: nextData }) as ItemsState<Schema>
    }
    case "REMOVE_ITEM": {
      const { index } = action.payload
      const { data = []} = state
      const nextData = produce(data, (draft: Schema[]) => {
        draft.splice(index, 1)
      })
      return computeState({ ...state, data: nextData }) as ItemsState<Schema>
    }
    case "UPDATE_PARTIAL": {
      return computeState(updatePartial<Schema, ItemsState<Schema>, UpdatePartialItemsAction<Schema>>(state, action))
    }
    default:
      return state
  }
}

export const useRestRecordReducer = <Schema>(initialData?: Schema) => {
  const [state, dispatch] = useReducer(
    recordReducer as (state: RecordState<Schema>, action: RecordAction<Schema>) => RecordState<Schema>,
    { ...initialState, data: initialData } as RecordState<Schema>
  )
  const actionCreators = useMemo(() => createActionCreatorsRecord<Schema>(), [])
  return [state, dispatch, actionCreators] as const
}
const useRestReducer = <Schema>(initialData?: Schema[]) => {
  const [state, dispatch] = useReducer(
    itemsReducer as (state: ItemsState<Schema>, action: ItemsAction<Schema>) => ItemsState<Schema>,
    { ...initialState, data: initialData } as ItemsState<Schema>
  )
  const actionCreators = useMemo(() => createActionCreatorsItems<Schema>(), [])
  return [state, dispatch, actionCreators] as const
}
export default useRestReducer
