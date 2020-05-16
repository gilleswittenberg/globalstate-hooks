import createConfig from "./createConfig"
import setNameToApiConfig from "./setNameToApiConfig"

const useConfig = (conf?: Partial<Config>) => {
  return createConfig(conf)
}
export default useConfig
