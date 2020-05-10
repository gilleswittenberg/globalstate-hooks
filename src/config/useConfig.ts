import createConfig from "./createConfig"
import setNameToApiConfig from "./setNameToApiConfig"

const useConfig = (name: string, conf?: Partial<Config>) => {
  const config = setNameToApiConfig(name, conf)
  return createConfig(config)
}
export default useConfig
