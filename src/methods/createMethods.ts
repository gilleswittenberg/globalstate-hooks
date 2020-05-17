import { createMethods } from "./fetch"

export default (additionalHeaders: RequestHeaders = {}) => createMethods(additionalHeaders)
