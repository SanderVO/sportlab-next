// Kept apart from the Users collection so access helpers can import it without a circular import.
export enum RolesEnum {
    ADMIN = "admin",
    EDITOR = "editor",
    USER = "user",
    COACH = "coach",
}
