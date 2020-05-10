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
    const state = recordReducer(initialState, createStartGetting())
    expect(state.isGetting).toBe(true)
    const state1 = recordReducer(state, createStopGetting())
    expect(state1.isGetting).toBe(false)
  })
})

describe("computedState", () => {
  it("isFetching", () => {
    const state = recordReducer(initialState, createStartGetting())
    expect(state.isFetching).toBe(true)
  })

  it("isUpdating", () => {
    const state = recordReducer(initialState, createStartPosting())
    expect(state.isUpdating).toBe(true)
  })

  it("isInitialized", () => {
    const state = recordReducer(initialState, createStartGetting())
    expect(state.isInitialized).toBe(false)
  })
})

describe("recordReducer", () => {
  it("createSetData", () => {
    const state = recordReducer(initialState, createSetData({ k: "v" }))
    expect(state.data).toEqual({ k: "v" })
  })

  it("createUpdateData", () => {
    const state = recordReducer(initialState, createSetData({ k: "v", l: "w" }))
    const state1 = recordReducer(state, createUpdateData({ l: "x" }))
    expect(state1.data).toEqual({ k: "v", l: "x" })
  })
})

describe("itemsReducer", () => {
  it("createSetItems", () => {
    const state = itemsReducer(initialState, createSetItems([{ k: "v" }, { l: "w" }]))
    expect(state.data).toEqual([{ k: "v" }, { l: "w" }])
  })

  it("createAddItem", () => {
    const state = itemsReducer(initialState, createAddItem({ k: "v" }))
    expect(state.data).toEqual([{ k: "v" }])
  })

  it("createUpdateItem", () => {
    const state = itemsReducer(initialState, createSetItems([{ k: "v" }, { l: "w" }]))
    const state1 = itemsReducer(state, createUpdateItem(1, { m: "x" }))
    expect(state1.data).toEqual([{ k: "v" }, { m: "x" }])
  })

  it("createRemoveItem", () => {
    const state = itemsReducer(initialState, createSetItems([{ k: "v" }, { l: "w" }, { m: "x" }]))
    const state1 = itemsReducer(state, createRemoveItem(1))
    expect(state1.data).toEqual([{ k: "v" }, { m: "x" }])
  })
})
