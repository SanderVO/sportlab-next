import * as migration_20260927_124450_coolify_initial_schema from './20260927_124450_coolify_initial_schema';
import * as migration_20260927_133230_add_exercises_collection from './20260927_133230_add_exercises_collection';
import * as migration_20261001_182326 from './20261001_182326';
import * as migration_20261003_191209 from './20261003_191209';
import * as migration_20261003_200000_update_cdn_urls from './20261003_200000_update_cdn_urls';
import * as migration_20261004_120000_add_lesson_program from './20261004_120000_add_lesson_program';
import * as migration_20261005_181519 from './20261005_181519';
import * as migration_20261006_210947 from './20261006_210947';
import * as migration_20261012_202615 from './20261012_202615';
import * as migration_20261017_134058_add_round_types from './20261017_134058_add_round_types';
import * as migration_20261018_132522_remove_exercise_quantity from './20261018_132522_remove_exercise_quantity';
import * as migration_20261020_112208_add_health_measurements from './20261020_112208_add_health_measurements';
import * as migration_20261020_155608_add_user_names_and_lesson_waitlist from './20261020_155608_add_user_names_and_lesson_waitlist';
import * as migration_20261028_164809_add_tv_access from './20261028_164809_add_tv_access';
import * as migration_20261102_202600_add_mcp_api_keys from './20261102_202600_add_mcp_api_keys';
import * as migration_20261103_204827_add_subscription_plan_prices from './20261103_204827_add_subscription_plan_prices';
import * as migration_20261103_210335_add_lesson_enrollment_cancelled_at from './20261103_210335_add_lesson_enrollment_cancelled_at';
import * as migration_20261103_213233_add_user_language from './20261103_213233_add_user_language';

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
    name: '20261003_191209',
  },
  {
    up: migration_20261003_200000_update_cdn_urls.up,
    down: migration_20261003_200000_update_cdn_urls.down,
    name: '20261003_200000_update_cdn_urls',
  },
  {
    up: migration_20261004_120000_add_lesson_program.up,
    down: migration_20261004_120000_add_lesson_program.down,
    name: '20261004_120000_add_lesson_program',
  },
  {
    up: migration_20261005_181519.up,
    down: migration_20261005_181519.down,
    name: '20261005_181519',
  },
  {
    up: migration_20261006_210947.up,
    down: migration_20261006_210947.down,
    name: '20261006_210947',
  },
  {
    up: migration_20261012_202615.up,
    down: migration_20261012_202615.down,
    name: '20261012_202615',
  },
  {
    up: migration_20261017_134058_add_round_types.up,
    down: migration_20261017_134058_add_round_types.down,
    name: '20261017_134058_add_round_types',
  },
  {
    up: migration_20261018_132522_remove_exercise_quantity.up,
    down: migration_20261018_132522_remove_exercise_quantity.down,
    name: '20261018_132522_remove_exercise_quantity',
  },
  {
    up: migration_20261020_112208_add_health_measurements.up,
    down: migration_20261020_112208_add_health_measurements.down,
    name: '20261020_112208_add_health_measurements',
  },
  {
    up: migration_20261020_155608_add_user_names_and_lesson_waitlist.up,
    down: migration_20261020_155608_add_user_names_and_lesson_waitlist.down,
    name: '20261020_155608_add_user_names_and_lesson_waitlist',
  },
  {
    up: migration_20261028_164809_add_tv_access.up,
    down: migration_20261028_164809_add_tv_access.down,
    name: '20261028_164809_add_tv_access',
  },
  {
    up: migration_20261102_202600_add_mcp_api_keys.up,
    down: migration_20261102_202600_add_mcp_api_keys.down,
    name: '20261102_202600_add_mcp_api_keys',
  },
  {
    up: migration_20261103_204827_add_subscription_plan_prices.up,
    down: migration_20261103_204827_add_subscription_plan_prices.down,
    name: '20261103_204827_add_subscription_plan_prices',
  },
  {
    up: migration_20261103_210335_add_lesson_enrollment_cancelled_at.up,
    down: migration_20261103_210335_add_lesson_enrollment_cancelled_at.down,
    name: '20261103_210335_add_lesson_enrollment_cancelled_at',
  },
  {
    up: migration_20261103_213233_add_user_language.up,
    down: migration_20261103_213233_add_user_language.down,
    name: '20261103_213233_add_user_language'
  },
];
