import mapResponse from "./mapResponse"
import mapBody from "./mapBody"
import validate from "./validate"

const afterMethod = () => {} // eslint-disable-line @typescript-eslint/no-empty-function

const defaultConfig: Config = {
  api: undefined,
  additionalHeaders: {},
  mapResponse,
  mapBody,
  validate,
  invalidHandling: "abort",
  afterSuccess: afterMethod,
  afterFailure: afterMethod
}
export default defaultConfig
