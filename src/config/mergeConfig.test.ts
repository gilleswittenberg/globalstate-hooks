import mergeConfig from "./mergeConfig"

describe("mergeConfig", () => {

  it("additionalHeaders", () => {
    const additionalHeaders = { Authorization: "Bearer token_abcdef" }
    const config = { api: { additionalHeaders } }
    const mergedConfig = mergeConfig(config)
    expect(mergedConfig.api).toEqual({ additionalHeaders })
  })

  it("undefined", () => {
    const additionalHeaders = { Authorization: "Bearer token_abcdef" }
    const config = { api: { additionalHeaders } }
    const mergedConfig = mergeConfig(config)
    const mergedConfig1 = mergeConfig(undefined, mergedConfig)
    expect(mergedConfig1.api).toEqual({ additionalHeaders })
  })
})
