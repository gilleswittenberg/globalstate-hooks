import { Id, Uuid } from "../reducer/useRestReducer"
// LINK: https://stackoverflow.com/questions/7905929/how-to-test-valid-uuid-guid
const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
const isUuid = (a: unknown): a is Uuid => typeof a === "string" && uuidRegex.test(a)
export default (a: unknown): a is Id => typeof a === "number" || isUuid(a)
