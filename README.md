# Global State, Reducers, REST

Create an abstraction for a globally managed React state and actions backed up by a REST Backend
- Type garantees at compile time (TypeScript)
- Type garantees at runtime (JSON) [https://github.com/vriad/zod]
- mapping of response and request data to types
- adjustable endpoint routing
- request queuing
- allow for polling / syncing

## Hooks

- useGlobalState
- useGlobalData
- useGlobalActions
  - useRestActions
  - useRestIndexActions
  - useRestRecordActions
    - useRestReducer
  - useLocalActions
  - useLocalRecordActions
    - useReducer
  - useGraphQLActions
    - useGraphQLReducer

### useGlobalState

- only reading state
- this should be type inferred from Schema

```
const { pets } = useGlobalState()
```

### useGlobalData

- only reading state data
- this should be type inferred from Schema

```
const pets = useGlobalData("pets")
```

### useGlobalActions

- only actions (writing)
- allow for specifying additional Actions (dependent on state, dispatch)
- allow for specifying convenience Actions (pure)

```
const { pets: { index } } = useGlobalActions()
```

### useRestActions (Index + CRUD)
- index
- create
- read
- update
- delete
- clear

### useRestReducer
- single (object)
- many (array)
- generic schema

#### state
```
{
  isGetting: boolean
  isPosting: boolean
  isPutting: boolean
  isPatching: boolean
  isDeleting: boolean
  requests: ResolvedRequests
  data: Schema | undefined

  // calculated properties
  isFetching: isGetting || isPosting || isPutting || isDeleting
  isUpdating: isPosting || isPutting || isDeleting
  isInitialized: data !== undefined
  errorMessages: requests.filter(hasError).map(pickError)
}
```

#### actions
- SET_IS_GETTING
- SET_IS_POSTING
- SET_IS_PUTTING
- SET_IS_PATCHING
- SET_IS_DELETING
- ADD_REQUEST
- CLEAR

##### single (object)
- SET_DATA

##### many (array)
- SET_ITEMS
- ADD_ITEM
- UPDATE_ITEM
- DELETE_ITEM
- MOVE_ITEM ?

## Testing

- unit testing [https://github.com/nock/nock]
- e2e testing [https://www.cypress.io/]
