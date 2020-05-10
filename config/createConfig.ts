import deepmerge from "deepmerge"
import defaultConfig from "./defaultConfig"

export default (config: Partial<Config> = {}, baseConfig: Config = defaultConfig): Config =>
  deepmerge(baseConfig, config)
