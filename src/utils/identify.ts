import { Id, Index } from "../useRestReducer"
export type Identifiable = { id?: Id }
export default <Schema>(items: Schema[] | undefined, item: Schema): Index => {
  if (items === undefined) return -1
  if (items.length === 0) return -1
  const hasId = items.every((item: Identifiable) => item.hasOwnProperty("id"))
  if (hasId === false) return -1
  return items.findIndex((i: Identifiable) => i.id === (item as Identifiable).id )
}
