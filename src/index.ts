import "./misc/polyfills"
import type { ItemsState, RecordState } from "./reducer/useRestReducer"
import type { RequestHeaders, ResolvedRequest } from "./methods/fetch"
import useRestActions, { ItemsActions } from "./useRestActions"
import useRestRecordActions, { RecordActions } from "./useRestRecordActions"
import createGlobalState from "./helpers/createGlobalState"

export type { ItemsState }
export type { RecordState }
export type { ItemsActions }
export type { RecordActions }
export type { ResolvedRequest }
export type { RequestHeaders }
export { useRestActions }
export { useRestRecordActions }
export { createGlobalState }
