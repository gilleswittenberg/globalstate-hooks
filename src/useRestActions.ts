import useRestReducer from "./useRestReducer"
import createConfig from "./config/createConfig"
import useCreateAction from "./actions/useCreateAction"
import identify from "./utils/identify"

const useRestActions = <Schema extends DefaultSchema>(conf?: Partial<Config>, initialData?: Schema[]) => {

  const config = createConfig(conf)
  const makeRequest = config.api !== undefined

  const [
    state,
    dispatch,
    actionCreators
  ] = useRestReducer<Schema>(initialData)

  const handleSuccessIndex = (result: Schema[]) => {
    const { createSetItems } = actionCreators
    dispatch(createSetItems(result))
  }
  const index = useCreateAction<Schema>(handleSuccessIndex as HandleSuccess<Schema>, makeRequest ? "GET" : undefined, config, actionCreators, dispatch)

  const handleSuccessCreate = (result: Schema) => {
    const { createAddItem } = actionCreators
    dispatch(createAddItem(result))
  }
  const create = useCreateAction<Schema>(handleSuccessCreate as HandleSuccess<Schema>, makeRequest ? "POST" : undefined, config, actionCreators, dispatch)

  const handleSuccessRead = (result: Schema) => {
    const { createAddItem } = actionCreators
    dispatch(createAddItem(result))
  }
  const read = useCreateAction<Schema>(handleSuccessRead as HandleSuccess<Schema>, makeRequest ? "GET" : undefined, config, actionCreators, dispatch)

  const handleSuccessUpdate = (result: Schema, id: Id) => {
    const { createUpdateItem, createAddItem } = actionCreators
    const index = identify(state.data, id)
    if (index > -1) {
      dispatch(createUpdateItem(index, result))
    } else {
      dispatch(createAddItem(result))
    }
  }
  const update = useCreateAction<Schema>(handleSuccessUpdate as HandleSuccess<Schema>, makeRequest ? "PUT" : undefined, config, actionCreators, dispatch)

  const handleSuccessDelete = (id: Id) => {
    const { createRemoveItem } = actionCreators
    const index = identify(state.data, id)
    if (index > -1) {
      dispatch(createRemoveItem(index))
    }
  }
  const del = useCreateAction<Schema>(handleSuccessDelete as HandleSuccess<Schema>, makeRequest ? "DELETE" : undefined, config, actionCreators, dispatch)

  const handleSuccessClear = () => {
    const { createClear } = actionCreators
    dispatch(createClear())
  }
  const clear = useCreateAction<Schema>(handleSuccessClear as HandleSuccess<Schema>, undefined, config, actionCreators, dispatch)

  const handleSuccessUpdateState = (result: Schema, id: Id) => {
    const { createUpdateItem } = actionCreators
    const index = identify(state.data, id)
    if (index === -1) return
    dispatch(createUpdateItem(index, result))
  }
  const updateState = useCreateAction<Schema>(handleSuccessUpdateState as HandleSuccess<Schema>, undefined, config, actionCreators, dispatch)

  const handleSuccessUpdatePartialState = (data: Schema[], path: KeyPath) => {
    const { createUpdatePartial } = actionCreators
    dispatch(createUpdatePartial(path, data))
  }
  const updatePartialState = useCreateAction<Schema>(handleSuccessUpdatePartialState as HandleSuccess<Schema>, undefined, config, actionCreators, dispatch)

  return [state, { index, create, read, update, del, clear, updateState, updatePartialState }] as const
}

export default useRestActions
