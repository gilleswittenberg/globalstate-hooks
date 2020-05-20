import type { Optional } from "./Optional"
import type { Plural } from "./Plural"

export type ErrorMessage = string
export type OErrorMessage = Optional<ErrorMessage>
export type ErrorMessages = Plural<ErrorMessage>
