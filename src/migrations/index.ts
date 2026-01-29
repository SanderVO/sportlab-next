import * as migration_20251213_220954 from './20251213_220954';
import * as migration_20251228_145802 from './20251228_145802';
import * as migration_20260105_190801 from './20260105_190801';
import * as migration_20260106_224444 from './20260106_224444';
import * as migration_20260113_205651 from './20260113_205651';
import * as migration_20260116_203253 from './20260116_203253';
import * as migration_20260117_205828 from './20260117_205828';
import * as migration_20260129_190305 from './20260129_190305';

export const migrations = [
  {
    up: migration_20251213_220954.up,
    down: migration_20251213_220954.down,
    name: '20251213_220954',
  },
  {
    up: migration_20251228_145802.up,
    down: migration_20251228_145802.down,
    name: '20251228_145802',
  },
  {
    up: migration_20260105_190801.up,
    down: migration_20260105_190801.down,
    name: '20260105_190801',
  },
  {
    up: migration_20260106_224444.up,
    down: migration_20260106_224444.down,
    name: '20260106_224444',
  },
  {
    up: migration_20260113_205651.up,
    down: migration_20260113_205651.down,
    name: '20260113_205651',
  },
  {
    up: migration_20260116_203253.up,
    down: migration_20260116_203253.down,
    name: '20260116_203253',
  },
  {
    up: migration_20260117_205828.up,
    down: migration_20260117_205828.down,
    name: '20260117_205828',
  },
  {
    up: migration_20260129_190305.up,
    down: migration_20260129_190305.down,
    name: '20260129_190305'
  },
];
