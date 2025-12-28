import * as migration_20251213_220954 from './20251213_220954';
import * as migration_20251228_145802 from './20251228_145802';

export const migrations = [
  {
    up: migration_20251213_220954.up,
    down: migration_20251213_220954.down,
    name: '20251213_220954',
  },
  {
    up: migration_20251228_145802.up,
    down: migration_20251228_145802.down,
    name: '20251228_145802'
  },
];
