# GlobalState hooks

## Usage

```
import { useRestReducer } from "globalstate-hooks"

type Pet = {
  name: string
  type: "dog" | "cat"
}

const [state, { index, create, update, read, del, clear, updatePartial }] = useRestReducer<Pet>({
  api: {
    domain: "http://localhost/",
    name: "pets"
  }
})

index()
```
