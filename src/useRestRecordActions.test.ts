import nock from "nock"
import { renderHook, act } from "@testing-library/react-hooks"
import useRestRecordActions from "./useRestRecordActions"

const domain = "http://localhost/"
type Pet = { name: string, type: "dog" | "cat" }

describe("useRestRecordActions", () => {
  describe("index", () => {
    it("fetch", async () => {
      const { result } = renderHook(() => useRestRecordActions<Pet>("pet", { api: { domain } }))

      nock(domain)
        .get("/pet/")
        .reply(200, { name: "Fifi", type: "dog" })
      const [, { index }] = result.current
      await act(async () => await index())

      const [state] = result.current
      expect(state.data).toEqual({ name: "Fifi", type: "dog" })
    })
  })

  describe("update", () => {
    it("record", async () => {
      const { result } = renderHook(() => useRestRecordActions<Pet>("pet", { api: { domain } }))

      const item = { name: "Fifi", type: "dog" }
      const updatedItem = { ...item, name: "Fififi" }

      nock(domain)
        .get("/pet/")
        .reply(200, item)
        .post("/pet/")
        .reply(200, updatedItem)

      const [, { index }] = result.current
      await act(async () => await index())

      const [state] = result.current
      expect(state.data).toEqual(item)

      const [, { update }] = result.current
      await act(async () => await update(undefined, updatedItem))

      const [state1] = result.current
      expect(state1.data).toEqual(updatedItem)
    })
  })

  describe("initialData", () => {
    it("record", async () => {
      const item = { name: "Fifi", type: "dog" }
      const { result } = renderHook(() => useRestRecordActions<Pet>("pets", undefined, item))
      const [state] = result.current
      expect(state.data).toEqual(item)
    })
  })

  describe("updateState", () => {
    it("update", async () => {
      const id = 3
      const item = { id, name: "Fifi", type: "dog" }
      const updatedItem = { ...item, name: "Fififi" }

      const { result } = renderHook(() => useRestRecordActions<Pet>("pets", undefined, item))

      const [, { updateState }] = result.current
      await act(async () => await updateState(updatedItem))

      const [state] = result.current
      expect(state.data).toEqual(updatedItem)
    })
  })
})
