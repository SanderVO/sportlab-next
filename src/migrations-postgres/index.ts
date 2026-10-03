import * as migration_20260927_124450_coolify_initial_schema from './20260927_124450_coolify_initial_schema';
import * as migration_20260927_133230_add_exercises_collection from './20260927_133230_add_exercises_collection';
import * as migration_20261001_182326 from './20261001_182326';
import * as migration_20261003_191209 from './20261003_191209';

export const migrations = [
  {
    up: migration_20260927_124450_coolify_initial_schema.up,
    down: migration_20260927_124450_coolify_initial_schema.down,
    name: '20260927_124450_coolify_initial_schema',
  },
  {
    up: migration_20260927_133230_add_exercises_collection.up,
    down: migration_20260927_133230_add_exercises_collection.down,
    name: '20260927_133230_add_exercises_collection',
  },
  {
    up: migration_20261001_182326.up,
    down: migration_20261001_182326.down,
    name: '20261001_182326',
  },
  {
    up: migration_20261003_191209.up,
    down: migration_20261003_191209.down,
    name: '20261003_191209'
  },
];
