import nock from "nock"
import { renderHook, act } from "@testing-library/react-hooks"
import useRestActions from "./useRestActions"
import type { Id } from "./reducer/useRestReducer"

const domain = "http://localhost/"
const name = "pets"
const api = { domain, name }
const config = { api }
type Pet = { id?: Id, name: string, type: string }
type Pets = Pet[]

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

    it("uuid", async () => {
      const { result } = renderHook(() => useRestActions<string>(config))

      const item = "123e4567-e89b-12d3-a456-426614174000"

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
      await act(async () => await read({ id }))

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
      await act(async () => await update(item))

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
      await act(async () => await update(updatedItem))

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
      await act(async () => await del(item))
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
      await act(async () => await updateState(updatedItem))

      const [state] = result.current
      expect(state.data).toEqual([updatedItem])
    })
  })

  describe("config", () => {

    it("mapResponse", async () => {
      const { result } = renderHook(() => useRestActions<Pet>({
        api,
        mapResponse: (response: unknown) => (response as { results: Pets }).results
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

    describe("idKey", () => {

      it("update", async () => {

        const items = [
          { uuid: "3067d397-a3ed-4802-bed7-a6a8ac3c12eb", name: "Fifi", type: "dog" },
          { uuid: "9b21d88d-4372-4112-a09b-df3ba15be522", name: "Milo", type: "cat" }
        ]

        const { result } = renderHook(() => useRestActions<Pet>({
          api,
          idKey: "uuid"
        }, items))

        const updatedItem = { uuid: "9b21d88d-4372-4112-a09b-df3ba15be522", name: "Milo sr.", type: "cat" }

        nock(domain)
          .put(`/pets/${ items[1].uuid }/`)
          .reply(200, updatedItem)

        const [, { update }] = result.current
        await act(async () => await update(updatedItem))

        const [state] = result.current
        expect(state.data?.[1]).toEqual(updatedItem)
      })

      it("del", async () => {

        const items = [
          { uuid: "3067d397-a3ed-4802-bed7-a6a8ac3c12eb", name: "Fifi", type: "dog" },
          { uuid: "9b21d88d-4372-4112-a09b-df3ba15be522", name: "Milo", type: "cat" }
        ]

        const { result } = renderHook(() => useRestActions<Pet>({
          api,
          idKey: "uuid"
        }, items))

        nock(domain)
          .delete(`/pets/${ items[1].uuid }/`)
          .reply(200)

        const [, { del }] = result.current
        await act(async () => await del(items[1]))

        const [state] = result.current
        expect(state.data).toEqual([items[0]])
      })
    })

    xit("shouldIndex", async () => {

      const items = [
        { id: 1, name: "Fifi", type: "dog" },
        { id: 2, name: "Milo", type: "cat" }
      ]

      nock(domain)
        .get("/pets/")
        .reply(200, items)

      const { result } = renderHook(() => useRestActions<Pet>({
        api,
        shouldIndex: true
      }))

      nock(domain)
        .delete("/pets/1/")
        .reply(200, [])

      const [, { del }] = result.current
      await act(async () => await del(items[0]))

      const [state] = result.current
      expect(state.data?.length).toBe(1)
    })

    it("mapBody", async () => {
      const { result } = renderHook(() => useRestActions<Pet>({
        api,
        mapBody: (body: unknown) => ({ ...body as Pet, extra: "Extra" })
      }))

      const id = 3
      const item = { id, name: "Fifi", type: "dog" }
      const itemExtra = { ...item, extra: "Extra" }

      nock(domain)
        .put(`/pets/${ id }/`, itemExtra)
        .reply(200, itemExtra)
      const [, { update }] = result.current
      await act(async () => await update(item))
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
      await act(async () => await read({ id }))
      expect(called).toBe(1)
    })

    it("afterFailure", async () => {
      let called = 0
      const { result } = renderHook(() => useRestActions<Pet>({
        api,
        afterFailure: () => { called++ }
      }))

      const item = { name: "Fifi", type: "dog" }

      nock(domain)
        .post("/pets/")
        .reply(400, { error: "INVALID_REQUEST" })
      const [, { create }] = result.current
      await act(async () => {
        try {
          await create(item)
        } catch (err) {}
      })
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

      const item = { id: 1, name: "Mimi", type: "cat" }
      const item1 = { id: 2, name: "Fifi", type: "dog" }
      const updatedItem1 = { ...item1, name: "Fififi" }

      const { result } = renderHook(() => useRestActions<Pet>(undefined, [item, item1]))
      const [, { update }] = result.current
      await act(async () => await update(updatedItem1))

      const [state] = result.current
      expect(state.data).toEqual([item, updatedItem1])
    })

    it("del", async () => {

      const item = { id: 1, name: "Mimi", type: "cat" }
      const item1 = { id: 2, name: "Fifi", type: "dog" }

      const { result } = renderHook(() => useRestActions<Pet>(undefined, [item, item1]))
      const [, { del }] = result.current
      await act(async () => await del(item))

      const [state] = result.current
      expect(state.data).toEqual([item1])
    })
  })
})
