import type { HandleSuccess } from "./actions/useCreateAction"
import type { Config } from "./config/config"
import useRestReducer from "./useRestReducer"
import mergeConfig from "./config/mergeConfig"
import useCreateAction from "./actions/useCreateAction"
import identify from "./utils/identify"
import shouldMakeRequest from "./config/shouldMakeRequest"

export type ItemsActions<Schema> = {
  index: (conf?: Partial<Config>) => Promise<void>
  create: (data: Schema, conf?: Partial<Config>) => Promise<void>
  read: (data: Partial<Schema>, conf?: Partial<Config>) => Promise<void>
  update: (data: Schema, conf?: Partial<Config>) => Promise<void>
  del: (data: Schema, conf?: Partial<Config>) => Promise<void>
  clear: () => void
  updateState: (data: Schema) => void
}

const useRestActions = <Schema>(conf?: Partial<Config>, initialData?: Schema[]) => {

  const config = mergeConfig(conf)

  const [
    state,
    dispatch,
    actionCreators
  ] = useRestReducer<Schema>(initialData)

  const handleSuccessIndex = (result: Schema[]) => {
    const { createSetItems } = actionCreators
    dispatch(createSetItems(result))
  }
  const indexConfig = mergeConfig(config.index, config)
  const index = useCreateAction<Schema>(handleSuccessIndex as HandleSuccess<Schema>, shouldMakeRequest(indexConfig) ? "GET" : undefined, indexConfig, actionCreators, dispatch)

  const handleSuccessCreate = (result: Schema) => {
    const { createAddItem } = actionCreators
    dispatch(createAddItem(result))
  }
  const createConfig = mergeConfig(config.create, config)
  const create = useCreateAction<Schema>(handleSuccessCreate as HandleSuccess<Schema>, shouldMakeRequest(createConfig) ? "POST" : undefined, createConfig, actionCreators, dispatch)

  const handleSuccessRead = (result: Schema) => {
    const { createAddItem } = actionCreators
    dispatch(createAddItem(result))
  }
  const readConfig = mergeConfig(config.read, config)
  const read = useCreateAction<Schema>(handleSuccessRead as HandleSuccess<Schema>, shouldMakeRequest(readConfig) ? "GET" : undefined, readConfig, actionCreators, dispatch)

  const handleSuccessUpdate = (item: Schema) => {
    const { createUpdateItem, createAddItem } = actionCreators
    const index = identify(state.data, item)
    if (index > -1) {
      dispatch(createUpdateItem(index, item))
    } else {
      dispatch(createAddItem(item))
    }
  }
  const updateConfig = mergeConfig(config.update, config)
  const update = useCreateAction<Schema>(handleSuccessUpdate as HandleSuccess<Schema>, shouldMakeRequest(updateConfig) ? "PUT" : undefined, updateConfig, actionCreators, dispatch)

  const handleSuccessDelete = (item: Schema) => {
    const { createRemoveItem } = actionCreators
    const index = identify(state.data, item)
    if (index === -1) return
    dispatch(createRemoveItem(index))
  }
  const delConfig = mergeConfig(config.del, config)
  const del = useCreateAction<Schema>(handleSuccessDelete as HandleSuccess<Schema>, shouldMakeRequest(delConfig) ? "DELETE" : undefined, delConfig, actionCreators, dispatch)

  const handleSuccessClear = () => {
    const { createClear } = actionCreators
    dispatch(createClear())
  }
  const clear = useCreateAction<Schema>(handleSuccessClear as HandleSuccess<Schema>, undefined, config, actionCreators, dispatch)

  const handleSuccessUpdateState = (item: Schema) => {
    const { createUpdateItem } = actionCreators
    const index = identify(state.data, item)
    if (index === -1) return
    dispatch(createUpdateItem(index, item))
  }
  const updateState = useCreateAction<Schema>(handleSuccessUpdateState as HandleSuccess<Schema>, undefined, config, actionCreators, dispatch)

  return [state, { index, create, read, update, del, clear, updateState } as ItemsActions<Schema>] as const
}

export default useRestActions
