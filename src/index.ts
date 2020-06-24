import "./misc/polyfills"
import type { ItemsState, RecordState } from "./useRestReducer"
import type { RequestHeaders, ResolvedRequest } from "./methods/fetch"
import useRestActions, { ItemsActions } from "./useRestActions"
import useRestRecordActions, { RecordActions } from "./useRestRecordActions"
import immer from "immer"

export type { ItemsState }
export type { RecordState }
export type { ItemsActions }
export type { RecordActions }
export type { ResolvedRequest }
export type { RequestHeaders }
export { useRestActions }
export { useRestRecordActions }

export { immer }
