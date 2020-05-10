import nock from "nock"
import { renderHook, act } from "@testing-library/react-hooks"
import useRestActions from "./useRestActions"
import { get } from "./fetch"

const domain = "http://localhost/"
type Pet = { id?: number, name: string, type: "dog" | "cat" }

describe("useRestActions", () => {
  describe("index", () => {
    it("fetch", async () => {
      const { result } = renderHook(() => useRestActions<Pet>("pets", { api: { domain } }))

      const scope = nock(domain)
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
      const { result } = renderHook(() => useRestActions<Pet>("pets", {
        api: { domain },
        validate: () => false
      }))

      const scope = nock(domain)
        .get("/pets/")
        .reply(200, [
          { name2: "Fifi", type: "dog" }
        ])
      const [, { index }] = result.current
      await act(async () => await index())

      const [state] = result.current
      expect(state.data).toBeUndefined()
    })
  })

  describe("create", () => {
    it("fetch", async () => {
      const { result } = renderHook(() => useRestActions<Pet>("pets", { api: { domain } }))

      const item = { name: "Fifi", type: "dog" }

      const scope = nock(domain)
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
      const { result } = renderHook(() => useRestActions<Pet>("pets", { api: { domain } }))

      const id = 3
      const item = { id, name: "Fifi", type: "dog" }

      const scope = nock(domain)
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
      const { result } = renderHook(() => useRestActions<Pet>("pets", { api: { domain } }))

      const id = 3
      const item = { id, name: "Fifi", type: "dog" }

      const scope = nock(domain)
        .put(`/pets/${ id }/`)
        .reply(200, item)
      const [, { update }] = result.current
      await act(async () => await update(id, item))

      const [state] = result.current
      expect(state.data).toEqual([item])
    })

    xit("update item", async () => {
      const { result, waitForNextUpdate } = renderHook(() => useRestActions<Pet>("pets", { api: { domain } }))

      const id = 3
      const item = { id, name: "Fifi", type: "dog" }
      const updatedItem = { ...item, name: "Fififi" }

      const scope = nock(domain)
        .get("/pets/")
        .reply(200, [item])
        .put(`/pets/${ id }/`)
        .reply(200, updatedItem)

      const [, { index }] = result.current
      await act(async () => await index())

      const [state] = result.current
      console.log(state)
      expect(state.data).toEqual([item])

      const [, { update }] = result.current
      await act(async () => await update(id, updatedItem))

      const [state1] = result.current
      console.log(state1)
      expect(state1.data).toEqual([updatedItem])
    })
  })

  describe("delete", () => {
    xit("fetch", async () => {
      const { result } = renderHook(() => useRestActions<Pet>("pets", { api: { domain } }))

      const id = 3
      const item = { id, name: "Fifi", type: "dog" }

      const scope = nock(domain)
        .get("/pets/")
        .reply(200, [item])
        .delete(`/pets/${ id }/`)
        .reply(204)

      const [, { index }] = result.current
      await act(async () => await index())
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
      const { result } = renderHook(() => useRestActions<Pet>("pets", undefined, [item]))
      const [state] = result.current
      expect(state.data).toEqual([item])
    })
  })

  describe("updateState", () => {
    it("update", async () => {
      const id = 3
      const item = { id, name: "Fifi", type: "dog" }
      const updatedItem = { ...item, name: "Fififi" }

      const { result } = renderHook(() => useRestActions<Pet>("pets", undefined, [item]))

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

      const { result } = renderHook(() => useRestActions<Pet>("pets", undefined, [item, item1]))

      const [, { updatePartialState }] = result.current
      await act(async () => await updatePartialState([1, "name"], "Fififi"))

      const [state] = result.current
      expect(state.data[1]).toEqual({ name: "Fififi", type: "dog" })
    })
  })

  describe("identify by index", () => {
    it("update", async () => {
      const item = { name: "Mimi", type: "cat" }
      const item1 = { name: "Fifi", type: "dog" }
      const updatedItem1 = { ...item1, name: "Fififi" }

      const { result } = renderHook(() => useRestActions<Pet>("pets", undefined, [item, item1], "INDEX"))

      const [, { updateState }] = result.current
      await act(async () => await updateState(1, updatedItem1))

      const [state] = result.current
      expect(state.data).toEqual([item, updatedItem1])
    })
  })

  describe("config", () => {
    it("url", async () => {
      const id = 4
      const { result } = renderHook(() => useRestActions<Pet>("pets", {
        api: {
          url: `${ domain }pets/detail/${ id }/`
        }
      }))

      const item = { id, name: "Fifi", type: "dog" }

      const scope = nock(domain)
        .get(`/pets/detail/${ id }/`)
        .reply(200, item)
      const [, { read }] = result.current
      await act(async () => await read(id))

      const [state] = result.current
      expect(state.data).toEqual([item])
    })

    it("mapResponse", async () => {
      const { result } = renderHook(() => useRestActions<Pet>("pets", {
        api: { domain },
        mapResponse: (response: any) => response.results
      }))

      const scope = nock(domain)
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
      const { result } = renderHook(() => useRestActions<Pet>("pets", {
        api: { domain },
        mapBody: (body: any) => ({ ...body, extra: "Extra" })
      }))

      const id = 3
      const item = { id, name: "Fifi", type: "dog" }
      const itemExtra = { ...item, extra: "Extra" }

      const scope = nock(domain)
        .put(`/pets/${ id }/`, itemExtra)
        .reply(200, itemExtra)
      const [, { update }] = result.current
      await act(async () => await update(id, item))
    })

    it("afterSuccess", async () => {
      let called = 0
      const { result } = renderHook(() => useRestActions<Pet>("pets", {
        api: { domain },
        afterSuccess: (request: ResolvedRequest) => { called++ }
      }))

      const id = 3
      const item = { id, name: "Fifi", type: "dog" }

      const scope = nock(domain)
        .get(`/pets/${ id }/`)
        .reply(200, item)
      const [, { read }] = result.current
      await act(async () => await read(id))
      expect(called).toBe(1)
    })

    it("afterFailure", async () => {
      let called = 0
      const { result } = renderHook(() => useRestActions<Pet>("pets", {
        api: { domain },
        afterFailure: (request: ResolvedRequest) => { called++ }
      }))

      const id = 3
      const item = { id, name: "Fifi", type: "dog" }

      const scope = nock(domain)
        .post("/pets/")
        .reply(400, { error: "INVALID_REQUEST" })
      const [, { create }] = result.current
      await act(async () => await create(item))
      expect(called).toBe(1)
    })
  })
})
