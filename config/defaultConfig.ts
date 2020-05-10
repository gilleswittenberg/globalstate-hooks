import mapResponse from "./mapResponse"
import mapBody from "./mapBody"
import validate from "./validate"

const afterMethod = (request: ResolvedRequest) => {}

const defaultConfig: Config = {
  api: {
    domain: "http://localhost/"
  },
  additionalHeaders: {},
  mapResponse,
  mapBody,
  validate,
  invalidHandling: "abort",
  afterSuccess: afterMethod,
  afterFailure: afterMethod
}
export default defaultConfig
