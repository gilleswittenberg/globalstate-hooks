export default <Schema>(items: Schema[] | undefined, id: Id): Index => items?.findIndex((item: any) => item.id === id) ?? -1
