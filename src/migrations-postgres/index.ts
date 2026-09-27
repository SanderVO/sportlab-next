import * as migration_20260927_124450_coolify_initial_schema from "./20260927_124450_coolify_initial_schema";

export const migrations = [
    {
        up: migration_20260927_124450_coolify_initial_schema.up,
        down: migration_20260927_124450_coolify_initial_schema.down,
        name: "20260927_124450_coolify_initial_schema",
    },
];
