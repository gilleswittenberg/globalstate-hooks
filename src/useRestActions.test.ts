import nock from "nock"
import { renderHook, act } from "@testing-library/react-hooks"
import useRestActions from "./useRestActions"

const domain = "http://localhost/"
const name = "pets"
const api = { domain, name }
const config = { api }
type Pet = { name: string, type: string }

describe("useRestActions", () => {
  describe("index", () => {
    it("fetch", async () => {
      const { result } = renderHook(() => useRestActions<Pet>(config))

      nock(domain)
        .get("/pets/")
        .reply(200, [
          { name: "Fifi", type: "dog" },
          { name: "Milo", type: "cat" }
        ])
      const [, { index }] = result.current
      await act(async () => await index())

      const [state] = result.current
      expect(state.data).toEqual([
        { name: "Fifi", type: "dog" },
        { name: "Milo", type: "cat" }
      ])
    })

    it("runtime validation", async () => {
      const { result } = renderHook(() => useRestActions<Pet>({
        api,
        validate: () => false
      }))

      nock(domain)
        .get("/pets/")
        .reply(200, [
          { name2: "Fifi", type: "dog" }
        ])
      const [, { index }] = result.current
      await act(async () => await index())

      const [state] = result.current
      expect(state.data).toBeUndefined()
    })

    it("simple values", async () => {
      const strings = ["Fifi", "Milo"]
      const { result } = renderHook(() => useRestActions<string>(config))

      nock(domain)
        .get("/pets/")
        .reply(200, strings)
      const [, { index }] = result.current
      await act(async () => await index())

      const [state] = result.current
      expect(state.data).toEqual(strings)
    })
  })

  describe("create", () => {
    it("fetch", async () => {
      const { result } = renderHook(() => useRestActions<Pet>(config))

      const item = { name: "Fifi", type: "dog" }

      nock(domain)
        .post("/pets/")
        .reply(201, item)
      const [, { create }] = result.current
      await act(async () => await create(item))

      const [state] = result.current
      expect(state.data).toEqual([item])
    })
  })

  describe("read", () => {
    it("fetch", async () => {
      const { result } = renderHook(() => useRestActions<Pet>(config))

      const id = 3
      const item = { id, name: "Fifi", type: "dog" }

      nock(domain)
        .get(`/pets/${ id }/`)
        .reply(200, item)
      const [, { read }] = result.current
      await act(async () => await read(id))

      const [state] = result.current
      expect(state.data).toEqual([item])
    })
  })

  describe("update", () => {
    it("fetch", async () => {
      const { result } = renderHook(() => useRestActions<Pet>(config))

      const id = 3
      const item = { id, name: "Fifi", type: "dog" }

      nock(domain)
        .put(`/pets/${ id }/`)
        .reply(200, item)
      const [, { update }] = result.current
      await act(async () => await update(id, item))

      const [state] = result.current
      expect(state.data).toEqual([item])
    })

    it("update item", async () => {

      const id = 3
      const item = { id, name: "Fifi", type: "dog" }
      const updatedItem = { ...item, name: "Fififi" }

      const { result } = renderHook(() => useRestActions<Pet>(config, [item]))

      nock(domain)
        .put(`/pets/${ id }/`)
        .reply(200, updatedItem)

      const [state] = result.current
      expect(state.data).toEqual([item])

      const [, { update }] = result.current
      await act(async () => await update(id, updatedItem))

      const [state1] = result.current
      expect(state1.data).toEqual([updatedItem])
    })
  })

  describe("delete", () => {
    it("fetch", async () => {

      const id = 3
      const item = { id, name: "Fifi", type: "dog" }

      const { result } = renderHook(() => useRestActions<Pet>(config, [item]))

      nock(domain)
        .delete(`/pets/${ id }/`)
        .reply(204)

      const [state] = result.current
      expect(state.data).toEqual([item])

      const [, { del }] = result.current
      await act(async () => await del(id))
      const [state1] = result.current
      expect(state1.data).toEqual([])
    })
  })

  describe("initialData", () => {
    it("items", async () => {
      const item = { name: "Fifi", type: "dog" }
      const { result } = renderHook(() => useRestActions<Pet>(undefined, [item]))
      const [state] = result.current
      expect(state.data).toEqual([item])
    })
  })

  describe("updateState", () => {
    it("update", async () => {
      const id = 3
      const item = { id, name: "Fifi", type: "dog" }
      const updatedItem = { ...item, name: "Fififi" }

      const { result } = renderHook(() => useRestActions<Pet>(undefined, [item]))

      const [, { updateState }] = result.current
      await act(async () => await updateState(id, updatedItem))

      const [state] = result.current
      expect(state.data).toEqual([updatedItem])
    })
  })

  describe("updatePartialState", () => {
    it("update", async () => {
      const item = { name: "Mimi", type: "cat" }
      const item1 = { name: "Fifi", type: "dog" }

      const { result } = renderHook(() => useRestActions<Pet>(undefined, [item, item1]))

      const [, { updatePartialState }] = result.current
      await act(async () => await updatePartialState([1, "name"], "Fififi"))

      const [state] = result.current
      expect(state.data?.[1]).toEqual({ name: "Fififi", type: "dog" })
    })
  })

  describe("identify by index", () => {
    it("update", async () => {
      const item = { name: "Mimi", type: "cat" }
      const item1 = { name: "Fifi", type: "dog" }
      const updatedItem1 = { ...item1, name: "Fififi" }

      const { result } = renderHook(() => useRestActions<Pet>(undefined, [item, item1]))

      const [, { updateState }] = result.current
      await act(async () => await updateState(1, updatedItem1))

      const [state] = result.current
      expect(state.data).toEqual([item, updatedItem1])
    })
  })

  describe("config", () => {

    it("mapResponse", async () => {
      const { result } = renderHook(() => useRestActions<Pet>({
        api,
        mapResponse: (response: any) => response.results // eslint-disable-line @typescript-eslint/no-explicit-any
      }))

      nock(domain)
        .get("/pets/")
        .reply(200, {
            results: [
              { name: "Fifi", type: "dog" },
              { name: "Milo", type: "cat" }
            ]
          }
        )
      const [, { index }] = result.current
      await act(async () => await index())

      const [state] = result.current
      expect(state.data).toEqual([
        { name: "Fifi", type: "dog" },
        { name: "Milo", type: "cat" }
      ])
    })

    it("mapBody", async () => {
      const { result } = renderHook(() => useRestActions<Pet>({
        api,
        mapBody: (body: any) => ({ ...body, extra: "Extra" }) // eslint-disable-line @typescript-eslint/no-explicit-any
      }))

      const id = 3
      const item = { id, name: "Fifi", type: "dog" }
      const itemExtra = { ...item, extra: "Extra" }

      nock(domain)
        .put(`/pets/${ id }/`, itemExtra)
        .reply(200, itemExtra)
      const [, { update }] = result.current
      await act(async () => await update(id, item))
    })

    it("afterSuccess", async () => {
      let called = 0
      const { result } = renderHook(() => useRestActions<Pet>({
        api,
        afterSuccess: () => { called++ }
      }))

      const id = 3
      const item = { id, name: "Fifi", type: "dog" }

      nock(domain)
        .get(`/pets/${ id }/`)
        .reply(200, item)
      const [, { read }] = result.current
      await act(async () => await read(id))
      expect(called).toBe(1)
    })

    it("afterFailure", async () => {
      let called = 0
      const { result } = renderHook(() => useRestActions<Pet>({
        api,
        afterFailure: () => { called++ }
      }))

      const id = 3
      const item = { id, name: "Fifi", type: "dog" }

      nock(domain)
        .post("/pets/")
        .reply(400, { error: "INVALID_REQUEST" })
      const [, { create }] = result.current
      await act(async () => await create(item))
      expect(called).toBe(1)
    })
  })

  describe("sub config", () => {

    it("api", async () => {
      const { result } = renderHook(() => useRestActions<Pet>({ index: { api } }))

      nock(domain)
        .get("/pets/")
        .reply(200, [
          { name: "Fifi", type: "dog" },
          { name: "Milo", type: "cat" }
        ])
      const [, { index }] = result.current
      await act(async () => await index())

      const [state] = result.current
      expect(state.data).toEqual([
        { name: "Fifi", type: "dog" },
        { name: "Milo", type: "cat" }
      ])
    })
  })

  describe("local", () => {

    it("create", async () => {

      const item = { name: "Fifi", type: "dog" }

      const { result } = renderHook(() => useRestActions<Pet>())
      const [, { create }] = result.current
      await act(async () => await create(item))

      const [state] = result.current
      expect(state.data).toEqual([item])
    })

    it("update", async () => {

      const item = { name: "Mimi", type: "cat" }
      const item1 = { name: "Fifi", type: "dog" }
      const updatedItem1 = { ...item1, name: "Fififi" }

      const { result } = renderHook(() => useRestActions<Pet>(undefined, [item, item1]))
      const [, { update }] = result.current
      await act(async () => await update(1, updatedItem1))

      const [state] = result.current
      expect(state.data).toEqual([item, updatedItem1])
    })

    it("del", async () => {

      const item = { name: "Mimi", type: "cat" }
      const item1 = { name: "Fifi", type: "dog" }

      const { result } = renderHook(() => useRestActions<Pet>(undefined, [item, item1]))
      const [, { del }] = result.current
      await act(async () => await del(0))

      const [state] = result.current
      expect(state.data).toEqual([item1])
    })
  })
})
