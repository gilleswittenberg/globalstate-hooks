import useRestReducer from "./useRestReducer"
import useConfig from "./config/useConfig"
import useCreateAction from "./actions/useCreateAction"
import getItemsIndex from "./utils/getItemsIndex"
import identifyByIndex from "./utils/identify"

const useRestActions = <Schema extends DefaultSchema>(name: string, conf?: Partial<Config>, initialData?: Schema[], identifyBy = "ID") => {
  const identify = identifyBy === "ID" ? getItemsIndex : identifyByIndex

  const config = useConfig(name, conf)

  const [
    state,
    dispatch,
    actionCreators
  ] = useRestReducer<Schema>(initialData)

  const handleSuccessIndex = (result: Schema[]) => {
    const { createSetItems } = actionCreators
    dispatch(createSetItems(result))
  }
  const index = useCreateAction<Schema>(handleSuccessIndex, "GET", config, actionCreators, dispatch)

  const handleSuccessCreate = (result: Schema) => {
    const { createAddItem } = actionCreators
    dispatch(createAddItem(result))
  }
  const create = useCreateAction<Schema>(handleSuccessCreate, "POST", config, actionCreators, dispatch)

  const handleSuccessRead = (result: Schema) => {
    const { createAddItem } = actionCreators
    dispatch(createAddItem(result))
  }
  const read = useCreateAction<Schema>(handleSuccessRead, "GET", config, actionCreators, dispatch)

  const handleSuccessUpdate = (result: Schema, id: Id) => {
    const { createUpdateItem, createAddItem } = actionCreators
    const index = identify(state.data, id)
    if (index > -1) {
      dispatch(createUpdateItem(index, result))
    } else {
      dispatch(createAddItem(result))
    }
  }
  const update = useCreateAction<Schema>(handleSuccessUpdate, "PUT", config, actionCreators, dispatch)

  const handleSuccessDelete = (result: Schema, id: Id) => {
    const { createRemoveItem } = actionCreators
    const index = identify(state.data, id)
    if (index > -1) {
      dispatch(createRemoveItem(index))
    }
  }
  const del = useCreateAction<Schema>(handleSuccessDelete, "DELETE", config, actionCreators, dispatch)

  const handleSuccessClear = () => {
    const { createClear } = actionCreators
    dispatch(createClear())
  }
  const clear = useCreateAction<Schema>(handleSuccessClear, undefined, config, actionCreators, dispatch)

  const handleSuccessUpdateState = (result: Schema, id: Id) => {
    const { createUpdateItem } = actionCreators
    const index = identify(state.data, id)
    if (index === -1) return
    dispatch(createUpdateItem(index, result))
  }
  const updateState = useCreateAction<Schema>(handleSuccessUpdateState, undefined, config, actionCreators, dispatch)

  const handleSuccessUpdatePartialState = (data: Schema[], path: KeyPath) => {
    const { createUpdatePartial } = actionCreators
    dispatch(createUpdatePartial(path, data))
  }
  const updatePartialState = useCreateAction<Schema>(handleSuccessUpdatePartialState, undefined, config, actionCreators, dispatch)

  return [state, { index, create, read, update, del, clear, updateState, updatePartialState }] as const
}

export default useRestActions
