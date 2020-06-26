import { Index } from "../reducer/useRestReducer"
import { IdKey } from "../config/config"
export default <Schema>(items: Schema[] | undefined, item: Schema, idKey: IdKey = "id"): Index => {
  if (items === undefined) return -1
  if (items.length === 0) return -1
  return items.findIndex(i => equalItems(i, item, idKey))
}


const equalItems = (item: any, item1: any, idKey: IdKey = "id") => {
  return item?.[idKey] === item1?.[idKey]
}
