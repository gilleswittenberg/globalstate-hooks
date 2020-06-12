import isId from "./isId"

describe("isId", () => {

  it("number", () => {
    expect(isId(3)).toBe(true)
  })

  it("uuid", () => {
    expect(isId("123e4567-e89b-12d3-a456-426614174000")).toBe(true)
  })

  it("string", () => {
    expect(isId("Lorem")).toBe(false)
  })
})
