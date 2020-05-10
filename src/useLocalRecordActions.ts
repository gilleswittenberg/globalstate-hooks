import { useRestRecordReducer, RecordAction } from "./useRestReducer"
import useConfig from "./config/useConfig"
import useCreateAction from "./actions/useCreateAction"

export default <Schema>() => {
  const config = useConfig("")
  const [
    state,
    dispatch,
    actionCreators
  ] = useRestRecordReducer<Schema>()

  const handleSuccessUpdate = (result: Schema) => {
    const { createSetData } = actionCreators
    dispatch(createSetData(result))
  }
  const update = useCreateAction<Schema, RecordAction<Schema>, RecordState<Schema>>(handleSuccessUpdate, undefined, config, actionCreators, dispatch, state)

  return [state, { update }] as const
}
