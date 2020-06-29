import type { ItemsState, RecordState } from "../reducer/useRestReducer"
import type { ItemsActions } from "../useRestActions"
import type { RecordActions } from "../useRestRecordActions"
import { createContext, useContext } from "react"

type BaseContext = {
  state: Record<string, ItemsState<any> | RecordState<any>>
  actions: Record<string, ItemsActions<any> | RecordActions<any>>
}

export default <Context extends BaseContext>() => {
  const GlobalStateContext = createContext<Context | undefined>(undefined)

  const useGlobalData = (key: keyof Context["state"]) => {
    const { state } = useContext(GlobalStateContext) as Context
    return (state as Context["state"])[key].data
  }

  const useGlobalState = (key?: keyof Context["state"]) => {
    const { state } = useContext(GlobalStateContext) as Context
    if (key === undefined) return state as Context["state"]
    return (state as Context["state"])[key]
  }

  const useGlobalActions = (key?: keyof Context["actions"]) => {
    const { actions } = useContext(GlobalStateContext) as Context
    if (key === undefined) return actions as Context["actions"]
    return (actions as Context["actions"])[key]
  }

  return {
    GlobalStateContext,
    GlobalStateProvider: GlobalStateContext.Provider,
    useGlobalData,
    useGlobalState,
    useGlobalActions
  }
}
