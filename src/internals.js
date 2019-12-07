import { getString } from '@lykmapipo/env';

// common constants
export const POPULATION_MAX_DEPTH = 1;
export const DEFAULT_COUNTRY_CODE = getString('DEFAULT_COUNTRY_CODE', 'TZ');
export const COUNTRY_CODE = getString('COUNTRY_CODE', DEFAULT_COUNTRY_CODE);

// event schema
export const EVENT_MODEL_NAME = getString('EVENT_MODEL_NAME', 'Event');
export const EVENT_COLLECTION_NAME = getString(
  'EVENT_COLLECTION_NAME',
  'events'
);
export const EVENT_SCHEMA_OPTIONS = { collection: EVENT_COLLECTION_NAME };

// event options
export const EVENT_OPTION_SELECT = { group: 1, type: 1, number: 1 };
export const EVENT_OPTION_AUTOPOPULATE = {
  select: EVENT_OPTION_SELECT,
  maxDepth: POPULATION_MAX_DEPTH,
};

// event stages
export const EVENT_STAGE_ALERT = 'Alert';
export const EVENT_STAGE_EVENT = 'Event';
export const EVENT_STAGES = [EVENT_STAGE_ALERT, EVENT_STAGE_EVENT];

// changelog schema
export const CHANGELOG_MODEL_NAME = getString(
  'CHANGELOG_MODEL_NAME',
  'EventChangeLog'
);
export const CHANGELOG_COLLECTION_NAME = getString(
  'CHANGELOG_COLLECTION_NAME',
  'eventchangelogs'
);
export const CHANGELOG_SCHEMA_OPTIONS = {
  collection: CHANGELOG_COLLECTION_NAME,
};

// changelog use
export const CHANGELOG_USE_CHANGE = 'change';
export const CHANGELOG_USE_NOTIFICATION = 'notification';
export const CHANGELOG_USE_NEED = 'need';
export const CHANGELOG_USE_EFFECT = 'effect';
export const CHANGELOG_USE_ASSESSMENT = 'assessment';
export const CHANGELOG_USE_ACTION = 'action';
export const CHANGELOG_USE_EXPOSURE = 'exposure';
export const CHANGELOG_USES = [
  CHANGELOG_USE_CHANGE,
  CHANGELOG_USE_NOTIFICATION,
  CHANGELOG_USE_NEED,
  CHANGELOG_USE_EFFECT,
  CHANGELOG_USE_ASSESSMENT,
  CHANGELOG_USE_ACTION,
  CHANGELOG_USE_EXPOSURE,
];

// relation options
export const PREDEFINE_OPTION_SELECT = {
  'strings.name': 1,
  'strings.color': 1,
  'strings.code': 1,
};
export const PREDEFINE_OPTION_AUTOPOPULATE = {
  select: PREDEFINE_OPTION_SELECT,
  maxDepth: POPULATION_MAX_DEPTH,
};
