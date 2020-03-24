import {
  POPULATION_MAX_DEPTH,
  COLLECTION_NAME_EVENT,
  COLLECTION_NAME_EVENTCHANGELOG,
} from '@codetanzania/ewea-internals';
import { idOf } from '@lykmapipo/common';
import { getString } from '@lykmapipo/env';
import { isObjectId } from '@lykmapipo/mongoose-common';

// common constants
export const DEFAULT_COUNTRY_CODE = getString('DEFAULT_COUNTRY_CODE', 'TZ');
export const COUNTRY_CODE = getString('COUNTRY_CODE', DEFAULT_COUNTRY_CODE);

// event schema
export const EVENT_SCHEMA_OPTIONS = { collection: COLLECTION_NAME_EVENT };

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
export const CHANGELOG_SCHEMA_OPTIONS = {
  collection: COLLECTION_NAME_EVENTCHANGELOG,
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

export const EVENT_UPDATE_ARRAY_FIELDS = ['areas', 'agencies', 'focals'];

export const EVENT_UPDATE_IGNORED_FIELDS = [
  '_id',
  'id',
  'event',
  'keyword',
  'number',
  // 'location', ignore for changelog
  // 'address', ignore for changelog
  'createdAt',
  'use',
];

export const EVENT_CHANGELOG_RELATED_FIELDS = [
  'group',
  'type',
  'level',
  'severity',
  'certainty',
  'status',
  'urgency',
];

export const EVENT_RELATION_PREDEFINE_FIELDS = {
  // group: undefined, // TODO: default group(Unknown)
  type: undefined, // TODO: default type(Unknown)
  level: { 'strings.name.en': 'White', namespace: 'EventLevel' },
  severity: { 'strings.name.en': 'Unknown', namespace: 'EventSeverity' },
  certainty: { 'strings.name.en': 'Unknown', namespace: 'EventCertainty' },
  status: { 'strings.name.en': 'Actual', namespace: 'EventStatus' },
  urgency: { 'strings.name.en': 'Unknown', namespace: 'EventUrgency' },
  response: { 'strings.name.en': 'None', namespace: 'EventResponse' },
};

// TODO: refactor to areSameObjectId(vali8&common)
export const deduplicate = (a, b) => {
  const idOfA = idOf(a) || a;
  const idOfB = idOf(b) || b;
  if (isObjectId(idOfA)) {
    return idOfA.equals(idOfB);
  }
  return idOfA === idOfB;
};
