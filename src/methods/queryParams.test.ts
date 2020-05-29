import queryParams from "./queryParams"

it("undefined", () => {
  expect(queryParams()).toBe("")
})

it("empty", () => {
  expect(queryParams({})).toBe("")
})

it("one", () => {
  expect(queryParams({ k: "value" })).toBe("?k=value")
})

it("multiple", () => {
  expect(queryParams({ k: "value", l: "test", m: 3 })).toBe("?k=value&l=test&m=3")
})

it("escape", () => {
  expect(queryParams({ ks: "a b" })).toBe("?ks=a%20b")
})
