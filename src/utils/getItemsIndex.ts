export default <Schema extends Identifiable>(items: Schema[] | undefined, id: Id): Index => items?.findIndex(item => item.id === id) ?? -1
