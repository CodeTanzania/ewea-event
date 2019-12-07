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