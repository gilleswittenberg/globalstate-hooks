import type { Config } from "./config/config"
import type { HandleSuccess } from "./actions/useCreateAction"
import { useRestRecordReducer, RecordState, RecordAction } from "./useRestReducer"
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

  const handleSuccessIndex = (result: Schema) => {
    const { createSetData } = actionCreators
    dispatch(createSetData(result))
  }
  const indexConfig = mergeConfig(config.index, config)
  const index = useCreateAction<Schema, RecordAction<Schema>, RecordState<Schema>>(handleSuccessIndex as HandleSuccess<Schema>, shouldMakeRequest(indexConfig) ? "GET" : undefined, config, actionCreators, dispatch)

  const handleSuccessUpdate = (result: Schema) => {
    const { createSetData } = actionCreators
    dispatch(createSetData(result))
  }
  const updateConfig = mergeConfig(config.update, config)
  const update = useCreateAction<Schema, RecordAction<Schema>, RecordState<Schema>>(handleSuccessUpdate as HandleSuccess<Schema>, shouldMakeRequest(updateConfig) ? "POST" : undefined, config, actionCreators, dispatch)

  const handleSuccessClear = () => {
    const { createClear } = actionCreators
    dispatch(createClear())
  }
  const clear = useCreateAction<Schema, RecordAction<Schema>, RecordState<Schema>>(handleSuccessClear as HandleSuccess<Schema>, undefined, config, actionCreators, dispatch)

  const handleSuccessUpdateState = (result: Schema) => {
    const { createSetData } = actionCreators
    dispatch(createSetData(result))
  }
  const updateState = useCreateAction<Schema, RecordAction<Schema>, RecordState<Schema>>(handleSuccessUpdateState as HandleSuccess<Schema>, undefined, config, actionCreators, dispatch)

  return [state, { index, update, clear, updateState } as RecordActions<Schema>] as const
}

export default useRestRecordActions
