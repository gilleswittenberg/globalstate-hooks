import { useMemo } from "react"
import { createMethods } from "./fetch"

const useMethods = (additionalHeaders: RequestHeaders = {}) => useMemo(() => createMethods(additionalHeaders), [additionalHeaders])
export default useMethods
