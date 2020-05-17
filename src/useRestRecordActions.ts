import { useRestRecordReducer, RecordAction } from "./useRestReducer"
import createConfig from "./config/createConfig"
import useCreateAction from "./actions/useCreateAction"

const useRestRecordActions = <Schema extends DefaultSchema>(conf?: Partial<Config>, initialData?: Schema) => {

  const config = createConfig(conf)
  const makeRequest = config.api !== undefined

  const [
    state,
    dispatch,
    actionCreators
  ] = useRestRecordReducer<Schema>(initialData)

  const handleSuccessIndex = (result: Schema) => {
    const { createSetData } = actionCreators
    dispatch(createSetData(result))
  }
  const index = useCreateAction<Schema, RecordAction<Schema>, RecordState<Schema>>(handleSuccessIndex as HandleSuccess<Schema>, makeRequest ? "GET" : undefined, config, actionCreators, dispatch)

  const handleSuccessUpdate = (result: Schema) => {
    const { createSetData } = actionCreators
    dispatch(createSetData(result))
  }
  const update = useCreateAction<Schema, RecordAction<Schema>, RecordState<Schema>>(handleSuccessUpdate as HandleSuccess<Schema>, makeRequest ? "POST" : undefined, config, actionCreators, dispatch)

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

  const handleSuccessUpdatePartialState = (data: Schema, path: KeyPath) => {
    const { createUpdatePartial } = actionCreators
    dispatch(createUpdatePartial(path, data))
  }
  const updatePartialState = useCreateAction<Schema, RecordAction<Schema>, RecordState<Schema>>(handleSuccessUpdatePartialState as HandleSuccess<Schema>, undefined, config, actionCreators, dispatch)

  return [state, { index, update, clear, updateState, updatePartialState }] as const
}

export default useRestRecordActions
