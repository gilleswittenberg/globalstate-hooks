import { useCallback } from "react"
import type { Config } from "./config/config"
import type { HandleSuccess } from "./actions/useCreateAction"
import { useRestRecordReducer, RecordState, RecordAction } from "./reducer/useRestReducer"
import mergeConfig from "./config/mergeConfig"
import useCreateAction from "./actions/useCreateAction"
import shouldMakeRequest from "./config/shouldMakeRequest"

export type RecordActions<Schema> = {
  index: (conf?: Partial<Config>) => Promise<void>
  update: (data: Schema, conf?: Partial<Config>) => Promise<void>
  clear: () => void
  updateState: (data: Schema) => void
}

const useRestRecordActions = <Schema>(conf?: Partial<Config>, initialData?: Schema) => {

  const config = mergeConfig(conf)

  const [
    state,
    dispatch,
    actionCreators
  ] = useRestRecordReducer<Schema>(initialData)

  // index
  const indexConfig = mergeConfig(config.index, config)
  const handleSuccessIndex = (result: Schema) => {
    const { createSetData } = actionCreators
    dispatch(createSetData(result))
  }
  const index = useCreateAction<Schema, RecordAction<Schema>, RecordState<Schema>>(handleSuccessIndex as HandleSuccess<Schema>, shouldMakeRequest(indexConfig) ? "GET" : undefined, config, actionCreators, dispatch)
  const indexStable = useCallback(index, [])

  // update
  const updateConfig = mergeConfig(config.update, config)
  const handleSuccessUpdate = (result: Schema) => {
    const { createSetData } = actionCreators
    dispatch(createSetData(result))
  }
  const update = useCreateAction<Schema, RecordAction<Schema>, RecordState<Schema>>(handleSuccessUpdate as HandleSuccess<Schema>, shouldMakeRequest(updateConfig) ? "POST" : undefined, config, actionCreators, dispatch)
  const updateStable = useCallback(update, [])

  // clear
  const handleSuccessClear = () => {
    const { createClear } = actionCreators
    dispatch(createClear())
  }
  const clear = useCreateAction<Schema, RecordAction<Schema>, RecordState<Schema>>(handleSuccessClear as HandleSuccess<Schema>, undefined, config, actionCreators, dispatch)
  const clearStable = useCallback(clear, [])

  // update state (locally)
  const handleSuccessUpdateState = (result: Schema) => {
    const { createSetData } = actionCreators
    dispatch(createSetData(result))
  }
  const updateState = useCreateAction<Schema, RecordAction<Schema>, RecordState<Schema>>(handleSuccessUpdateState as HandleSuccess<Schema>, undefined, config, actionCreators, dispatch)
  const updateStateStable = useCallback(updateState, [])

  return [state, {
    index: indexStable,
    update: updateStable,
    clear: clearStable,
    updateState: updateStateStable
  } as RecordActions<Schema>] as const
}

export default useRestRecordActions
