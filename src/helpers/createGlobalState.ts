import type { ItemsState, RecordState } from "../reducer/useRestReducer"
import type { ItemsActions } from "../useRestActions"
import type { RecordActions } from "../useRestRecordActions"
import { createContext, useContext } from "react"

type BaseContext = {
  state: Record<string, ItemsState<unknown> | RecordState<unknown>>
  actions: Record<string, ItemsActions<unknown> | RecordActions<unknown>>
}

export default <Context extends BaseContext>() => {
  const GlobalStateContext = createContext<Context | undefined>(undefined)

  const useGlobalData = (key: keyof Context["state"]) => {
    const { state } = useContext(GlobalStateContext) as Context
    return (state as Context["state"])[key].data
  }

  const useGlobalState = () => {
    const { state } = useContext(GlobalStateContext) as Context
    return state as Context["state"]
  }

  const useGlobalActions = () => {
    const { actions } = useContext(GlobalStateContext) as Context
    return actions as Context["actions"]
  }

  return {
    GlobalStateContext,
    GlobalStateProvider: GlobalStateContext.Provider,
    useGlobalData,
    useGlobalState,
    useGlobalActions
  }
}
