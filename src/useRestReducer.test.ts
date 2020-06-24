import {
  initialState,
  createStartGetting,
  createStopGetting,
  createStartPosting,
  createSetData,
  createUpdateData,
  createSetItems,
  createAddItem,
  createUpdateItem,
  createRemoveItem,
  recordReducer,
  itemsReducer
} from "./useRestReducer"


describe("baseState", () => {
  it("createStartGetting, createStopGetting", () => {
    type Schema = unknown
    const state = recordReducer<Schema>(initialState, createStartGetting())
    expect(state.isGetting).toBe(true)
    const state1 = recordReducer(state, createStopGetting())
    expect(state1.isGetting).toBe(false)
  })
})

describe("computedState", () => {
  it("isFetching", () => {
    type Schema = unknown
    const state = recordReducer<Schema>(initialState, createStartGetting())
    expect(state.isFetching).toBe(true)
  })

  it("isUpdating", () => {
    type Schema = unknown
    const state = recordReducer<Schema>(initialState, createStartPosting())
    expect(state.isUpdating).toBe(true)
  })

  it("isInitialized", () => {
    type Schema = unknown
    const state = recordReducer<Schema>(initialState, createStartGetting())
    expect(state.isInitialized).toBe(false)
  })
})

describe("recordReducer", () => {
  it("createSetData", () => {
    type Schema = { k: string }
    const state = recordReducer<Schema>(initialState, createSetData({ k: "v" }))
    expect(state.data).toEqual({ k: "v" })
  })

  it("createUpdateData", () => {
    type Schema = { k: string, l: string }
    const state = recordReducer<Schema>(initialState, createSetData({ k: "v", l: "w" }))
    const state1 = recordReducer<Schema>(state, createUpdateData<Schema>({ l: "x" }))
    expect(state1.data).toEqual({ k: "v", l: "x" })
  })
})

describe("itemsReducer", () => {
  it("createSetItems", () => {
    type Schema = { k: string }
    const state = itemsReducer<Schema>(initialState, createSetItems([{ k: "v" }, { k: "w" }]))
    expect(state.data).toEqual([{ k: "v" }, { k: "w" }])
  })

  it("createAddItem", () => {
    type Schema = { k: string }
    const state = itemsReducer<Schema>(initialState, createAddItem({ k: "v" }))
    expect(state.data).toEqual([{ k: "v" }])
  })

  it("createUpdateItem", () => {
    type Schema = { k: string }
    const state = itemsReducer<Schema>(initialState, createSetItems([{ k: "v" }, { k: "w" }]))
    const state1 = itemsReducer<Schema>(state, createUpdateItem(1, { k: "x" }))
    expect(state1.data).toEqual([{ k: "v" }, { k: "x" }])
  })

  it("createRemoveItem", () => {
    type Schema = { k: string }
    const state = itemsReducer<Schema>(initialState, createSetItems([{ k: "v" }, { k: "w" }, { k: "x" }]))
    const state1 = itemsReducer<Schema>(state, createRemoveItem(1))
    expect(state1.data).toEqual([{ k: "v" }, { k: "x" }])
  })
})
