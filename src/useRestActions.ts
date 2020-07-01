import { useCallback, useEffect } from "react"
import type { HandleSuccess } from "./actions/useCreateAction"
import type { Config } from "./config/config"
import useRestReducer from "./reducer/useRestReducer"
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

  // index
  const indexConfig = mergeConfig(config.index, config)
  const handleSuccessIndex = useCallback((result: Schema[]) => {
    const { createSetItems } = actionCreators
    dispatch(createSetItems(result))
  }, [ actionCreators, dispatch ])
  const index = useCreateAction<Schema>(handleSuccessIndex as HandleSuccess<Schema>, shouldMakeRequest(indexConfig) ? "GET" : undefined, indexConfig, actionCreators, dispatch)
  const indexStable = useCallback(index, [ handleSuccessIndex ])

  // create
  const createConfig = mergeConfig(config.create, config)
  const handleSuccessCreate = useCallback((result: Schema) => {
    const { createAddItem } = actionCreators
    dispatch(createAddItem(result))
  }, [ actionCreators, dispatch ])
  const create = useCreateAction<Schema>(handleSuccessCreate as HandleSuccess<Schema>, shouldMakeRequest(createConfig) ? "POST" : undefined, createConfig, actionCreators, dispatch)
  const createStable = useCallback(create, [ handleSuccessCreate ])

  // read
  const readConfig = mergeConfig(config.read, config)
  const handleSuccessRead = useCallback((result: Schema) => {
    const { createAddItem } = actionCreators
    dispatch(createAddItem(result))
  }, [ actionCreators, dispatch ])
  const read = useCreateAction<Schema>(handleSuccessRead as HandleSuccess<Schema>, shouldMakeRequest(readConfig) ? "GET" : undefined, readConfig, actionCreators, dispatch)
  const readStable = useCallback(read, [ handleSuccessRead ])

  // update
  const updateConfig = mergeConfig(config.update, config)
  const handleSuccessUpdate = useCallback((item: Schema) => {
    const { createUpdateItem, createAddItem } = actionCreators
    const index = identify(state.data, item, config.idKey)
    if (index > -1) {
      dispatch(createUpdateItem(index, item))
    } else {
      dispatch(createAddItem(item))
    }
  }, [ actionCreators, state, config, dispatch ])

  const update = useCreateAction<Schema>(handleSuccessUpdate as HandleSuccess<Schema>, shouldMakeRequest(updateConfig) ? "PUT" : undefined, updateConfig, actionCreators, dispatch)
  const updateStable = useCallback(update, [ handleSuccessUpdate ])

  // delete
  const deleteConfig = mergeConfig(config.del, config)
  const handleSuccessDelete = useCallback((item: Schema) => {
    const { createRemoveItem } = actionCreators
    const index = identify(state.data, item, config.idKey)
    if (index === -1) return
    dispatch(createRemoveItem(index))
  }, [ actionCreators, state, config, dispatch ])

  const del = useCreateAction<Schema>(handleSuccessDelete as HandleSuccess<Schema>, shouldMakeRequest(deleteConfig) ? "DELETE" : undefined, deleteConfig, actionCreators, dispatch)
  const delStable = useCallback(del, [ handleSuccessDelete ])

  // clear
  const handleSuccessClear = useCallback(() => {
    const { createClear } = actionCreators
    dispatch(createClear())
  }, [ actionCreators, dispatch ])
  const clear = useCreateAction<Schema>(handleSuccessClear as HandleSuccess<Schema>, undefined, config, actionCreators, dispatch)
  const clearStable = useCallback(clear, [ handleSuccessClear ])

  // update state (locally)
  const handleSuccessUpdateState = useCallback((item: Schema) => {
    const { createUpdateItem } = actionCreators
    const index = identify(state.data, item, config.idKey)
    if (index === -1) return
    dispatch(createUpdateItem(index, item))
  }, [ actionCreators, state, config, dispatch ])
  const updateState = useCreateAction<Schema>(handleSuccessUpdateState as HandleSuccess<Schema>, undefined, config, actionCreators, dispatch)
  const updateStateStable = useCallback(updateState, [ handleSuccessUpdateState ])

  useEffect(() => {
    if (config.shouldIndex === false) return
    indexStable()
  }, [indexStable])

  return [state, {
    index: indexStable,
    create: createStable,
    read: readStable,
    update: updateStable,
    del: delStable,
    clear: clearStable,
    updateState: updateStateStable
  } as ItemsActions<Schema>] as const
}

export default useRestActions
