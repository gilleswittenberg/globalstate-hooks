import { Id, Index } from "../useRestReducer"
type Identifiable = { id?: Id }
export default <Schema>(items: Schema[] | undefined, id: Id | Index): Index => {
  if (items === undefined) return -1
  if (items.length === 0) return -1
  const item = items[0] as Identifiable
  const hasId = item.hasOwnProperty("id")
  if (hasId) return items.findIndex((item: Identifiable) => item.id === id)
  return id as Index
}
