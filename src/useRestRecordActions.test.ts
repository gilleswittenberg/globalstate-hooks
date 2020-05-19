import nock from "nock"
import { renderHook, act } from "@testing-library/react-hooks"
import useRestRecordActions from "./useRestRecordActions"

const domain = "http://localhost/"
const name = "pet"
const api = { domain, name }
const config = { api }
type Pet = { name: string, type: string }

describe("useRestRecordActions", () => {
  describe("actions", () => {

    describe("index", () => {
      it("fetch", async () => {
        const { result } = renderHook(() => useRestRecordActions<Pet>(config))

        nock(domain)
          .get("/pet/")
          .reply(200, { name: "Fifi", type: "dog" })
        const [, { index }] = result.current
        await act(async () => await index())

        const [state] = result.current
        expect(state.data).toEqual({ name: "Fifi", type: "dog" })
      })

      it("simple value", async () => {
        const { result } = renderHook(() => useRestRecordActions<string>(config))

        nock(domain)
          .get("/pet/")
          .reply(200, "Fifi")
        const [, { index }] = result.current
        await act(async () => await index())

        const [state] = result.current
        expect(state.data).toEqual("Fifi")
      })
    })

    describe("update", () => {
      it("record", async () => {
        const { result } = renderHook(() => useRestRecordActions<Pet>(config))

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
        await act(async () => await update(updatedItem))

        const [state1] = result.current
        expect(state1.data).toEqual(updatedItem)
      })

      it("simple value", async () => {
        const { result } = renderHook(() => useRestRecordActions<string>(config, "Fifi"))

        nock(domain)
          .post("/pet/")
          .reply(200, "Fififi")
        const [, { update }] = result.current
        await act(async () => await update())

        const [state] = result.current
        expect(state.data).toEqual("Fififi")
      })

    })
  })

  describe("local", () => {

    it("update", async () => {

      const item = { name: "Fifi", type: "dog" }

      const { result } = renderHook(() => useRestRecordActions<Pet>())
      const [, { update }] = result.current
      await act(async () => await update(item))

      const [state] = result.current
      expect(state.data).toEqual(item)
    })
  })

  describe("initialData", () => {
    it("record", async () => {
      const item = { name: "Fifi", type: "dog" }
      const { result } = renderHook(() => useRestRecordActions<Pet>(undefined, item))
      const [state] = result.current
      expect(state.data).toEqual(item)
    })
  })

  describe("updateState", () => {
    it("update", async () => {
      const item = { name: "Fifi", type: "dog" }
      const updatedItem = { ...item, name: "Fififi" }

      const { result } = renderHook(() => useRestRecordActions<Pet>(undefined, item))

      const [, { updateState }] = result.current
      await act(async () => await updateState(updatedItem))

      const [state] = result.current
      expect(state.data).toEqual(updatedItem)
    })
  })
})
