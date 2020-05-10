import useRestReducer, { ItemsAction } from "./useRestReducer"
import useConfig from "./config/useConfig"
import useCreateAction from "./actions/useCreateAction"
//import getItemsIndex from "./utils/getItemsIndex"

const useRestIndexActions = <Schema>(name: string, conf?: Partial<Config>, initialData?: Schema[]) => {
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
  const index = useCreateAction<Schema, ItemsAction<Schema>>(handleSuccessIndex, "GET", config, actionCreators, dispatch)

  const handleSuccessClear = () => {
    const { createClear } = actionCreators
    dispatch(createClear())
  }
  const clear = useCreateAction<Schema, ItemsAction<Schema>>(handleSuccessClear, undefined, config, actionCreators, dispatch, state)

  return [state, { index, clear }] as const

  /*
  const handleSuccessUpdateState = (result: Schema, id: Id) => {
    const { createUpdateItem } = actionCreators
    const index = getItemsIndex<Schema>(state.data, id)
    if (index === -1) return
    dispatch(createUpdateItem(index, result))
  }
  const updateState = useCreateAction<Schema>(handleSuccessUpdateState, undefined, config, actionCreators, dispatch, state)

  return [state, { index, clear, updateState }] as const
  */
}

export default useRestIndexActions
