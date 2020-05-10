export default (name: string, config: Partial<Config> = {}) => {
  config.api = config.api ?? {}
  config.api.name = name
  return config
}
