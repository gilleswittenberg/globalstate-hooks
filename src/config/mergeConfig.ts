import deepmerge from "deepmerge"
import { defaultConfig } from "./config"
import type { Config } from "./config"

export default (config: Partial<Config> = {}, baseConfig: Config = defaultConfig): Config =>
  deepmerge(baseConfig, config)
