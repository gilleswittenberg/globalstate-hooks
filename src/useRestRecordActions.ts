import { useRestRecordReducer, RecordAction } from "./useRestReducer"
import useConfig from "./config/useConfig"
import useCreateAction from "./actions/useCreateAction"

const useRestRecordActions = <Schema>(name: string, conf?: Partial<Config>, initialData?: Schema) => {
  const config = useConfig(name, conf)

  const [
    state,
    dispatch,
    actionCreators
  ] = useRestRecordReducer<Schema>(initialData)

  const handleSuccessIndex = (result: Schema) => {
    const { createSetData } = actionCreators
    dispatch(createSetData(result))
  }
  const index = useCreateAction<Schema, RecordAction<Schema>, RecordState<Schema>>(handleSuccessIndex, "GET", config, actionCreators, dispatch)

  const handleSuccessUpdate = (result: Schema) => {
    const { createSetData } = actionCreators
    dispatch(createSetData(result))
  }
  const update = useCreateAction<Schema, RecordAction<Schema>, RecordState<Schema>>(handleSuccessUpdate, "POST", config, actionCreators, dispatch, state)

  const handleSuccessClear = () => {
    const { createClear } = actionCreators
    dispatch(createClear())
  }
  const clear = useCreateAction<Schema, RecordAction<Schema>, RecordState<Schema>>(handleSuccessClear, undefined, config, actionCreators, dispatch, state)

  const handleSuccessUpdateState = (result: Schema) => {
    const { createSetData } = actionCreators
    dispatch(createSetData(result))
  }
  const updateState = useCreateAction<Schema, RecordAction<Schema>, RecordState<Schema>>(handleSuccessUpdateState, undefined, config, actionCreators, dispatch, state)

  const handleSuccessUpdatePartialState = (data: JSONValue, path: Path) => {
    const { createUpdatePartial } = actionCreators
    dispatch(createUpdatePartial(path, data))
  }
  const updatePartialState = useCreateAction<Schema, RecordAction<Schema>, RecordState<Schema>>(handleSuccessUpdatePartialState, undefined, config, actionCreators, dispatch, state)

  return [state, { index, update, clear, updateState, updatePartialState }] as const
}

export default useRestRecordActions
