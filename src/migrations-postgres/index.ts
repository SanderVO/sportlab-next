import * as migration_20260927_124450_coolify_initial_schema from "./20260927_124450_coolify_initial_schema";
import * as migration_20260927_133230_add_exercises_collection from "./20260927_133230_add_exercises_collection";

export const migrations = [
    {
        up: migration_20260927_124450_coolify_initial_schema.up,
        down: migration_20260927_124450_coolify_initial_schema.down,
        name: "20260927_124450_coolify_initial_schema",
    },
    {
        up: migration_20260927_133230_add_exercises_collection.up,
        down: migration_20260927_133230_add_exercises_collection.down,
        name: "20260927_133230_add_exercises_collection",
    },
];
