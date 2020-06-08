import type { Json } from "./types/Json"
import type { Id, KeyPath } from "./useRestReducer"
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
  read: (id: Id, conf?: Partial<Config>) => Promise<void>
  update: (id: Id, data: Schema, conf?: Partial<Config>) => Promise<void>
  del: (id: Id, conf?: Partial<Config>) => Promise<void>
  clear: () => Promise<void>
  updateState: (id: Id, data: Schema) => Promise<void>
  updatePartialState: (path: KeyPath, data: Json) => Promise<void>
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
  const create = useCreateAction<Schema>(handleSuccessCreate as HandleSuccess<Schema>, shouldMakeRequest(createConfig) ? "POST" : undefined, config, actionCreators, dispatch)

  const handleSuccessRead = (result: Schema) => {
    const { createAddItem } = actionCreators
    dispatch(createAddItem(result))
  }
  const readConfig = mergeConfig(config.read, config)
  const read = useCreateAction<Schema>(handleSuccessRead as HandleSuccess<Schema>, shouldMakeRequest(readConfig) ? "GET" : undefined, config, actionCreators, dispatch)

  const handleSuccessUpdate = (result: Schema, id: Id) => {
    const { createUpdateItem, createAddItem } = actionCreators
    const index = identify(state.data, id)
    if (index > -1) {
      dispatch(createUpdateItem(index, result))
    } else {
      dispatch(createAddItem(result))
    }
  }
  const updateConfig = mergeConfig(config.update, config)
  const update = useCreateAction<Schema>(handleSuccessUpdate as HandleSuccess<Schema>, shouldMakeRequest(updateConfig) ? "PUT" : undefined, config, actionCreators, dispatch)

  const handleSuccessDelete = (id: Id) => {
    const { createRemoveItem } = actionCreators
    const index = identify(state.data, id)
    if (index > -1) {
      dispatch(createRemoveItem(index))
    }
  }
  const delConfig = mergeConfig(config.del, config)
  const del = useCreateAction<Schema>(handleSuccessDelete as HandleSuccess<Schema>, shouldMakeRequest(delConfig) ? "DELETE" : undefined, config, actionCreators, dispatch)

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

  // TODO: type of data argument should be unknown
  const handleSuccessUpdatePartialState = (data: Schema[], path: KeyPath) => {
    const { createUpdatePartial } = actionCreators
    dispatch(createUpdatePartial(path, data))
  }
  const updatePartialState = useCreateAction<Schema>(handleSuccessUpdatePartialState as HandleSuccess<Schema>, undefined, config, actionCreators, dispatch)

  return [state, { index, create, read, update, del, clear, updateState, updatePartialState } as ItemsActions<Schema>] as const
}

export default useRestActions
