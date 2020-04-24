import {
  MODEL_NAME_EVENT,
  MODEL_NAME_EVENTCHANGELOG,
  COLLECTION_NAME_EVENTCHANGELOG,
} from '@codetanzania/ewea-internals';
import { waterfall } from 'async';
import { pick } from 'lodash';
import { mergeObjects, idOf } from '@lykmapipo/common';
import { copyInstance, createSchema, model } from '@lykmapipo/mongoose-common';
import '@lykmapipo/mongoose-sequenceable';
import actions from 'mongoose-rest-actions';
import exportable from '@lykmapipo/mongoose-exportable';

import {
  CHANGELOG_SCHEMA_OPTIONS,
  CHANGELOG_USE_CHANGE,
  CHANGELOG_USE_NOTIFICATION,
  CHANGELOG_USE_NEED,
  CHANGELOG_USE_EFFECT,
  CHANGELOG_USE_ASSESSMENT,
  CHANGELOG_USE_ACTION,
  CHANGELOG_USES,
  EVENT_CHANGELOG_RELATED_FIELDS,
} from './internals';

import {
  initiator,
  verifier,
  groups,
  roles,
  agencies,
  focals,
} from './schema/parties.schema';

import {
  group,
  type,
  level,
  severity,
  certainty,
  status,
  urgency,
  response,
  fanction,
  action,
  catalogue,
  indicator,
  topic,
  question,
  need, // TODO: remove
  effect, // TODO: remove
  unit,
} from './schema/base.schema';

import { areas, location, address } from './schema/geos.schema';
import {
  event,
  use,
  keyword,
  comment,
  value,
} from './schema/changelog.base.schema';
import { image, audio, video, document } from './schema/files.schema';

const SCHEMA = mergeObjects(
  { use, keyword },
  { initiator, verifier },
  { group, type, level, severity, certainty, status, urgency, response },
  { event },
  { function: fanction, action, catalogue },
  { indicator, topic, question, need, effect, value, unit },
  { areas },
  { groups, roles, agencies, focals },
  { image, audio, video, document },
  { location, address },
  { comment }
);

// TODO: all criteria use $in operator
// TODO: update event after post, update, patch and delete
// TODO: send notification after save
// TODO: notify respective parties after save
// TODO: handle endedAt changelog to close event
// TODO: add all event fields to best track changes

/**
 * @module ChangeLog
 * @namespace ChangeLog
 * @name ChangeLog
 * @description A record(log) of a changes on an event.
 *
 * It may be need assessment, loss assessment, general notification,
 * action taken, general comments etc.
 *
 * @author lally elias <lallyelias87@gmail.com>
 * @license MIT
 * @since 0.1.0
 * @version 0.1.0
 * @public
 * @example
 * const { ChangeLog } = require('@codetanzania/ewea-event');
 * ChangeLog.create(changelog, (error, created) => { ... });
 */
const ChangeLogSchema = createSchema(
  SCHEMA,
  CHANGELOG_SCHEMA_OPTIONS,
  actions,
  exportable
);

/*
 *------------------------------------------------------------------------------
 *  Hooks
 *------------------------------------------------------------------------------
 */

/**
 * @name validate
 * @function validate
 * @description event changelog schema pre validation hook
 * @param {Function} done callback to invoke on success or error
 * @returns {object|Error} valid instance or error
 *
 * @author lally elias <lallyelias87@gmail.com>
 * @since 0.1.0
 * @version 0.1.0
 * @private
 */
ChangeLogSchema.pre('validate', function onPreValidate(done) {
  return this.preValidate(done);
});

/*
 *------------------------------------------------------------------------------
 *  Instance
 *------------------------------------------------------------------------------
 */

/**
 * @name preValidate
 * @function preValidate
 * @description event changelog schema pre validation hook logic
 * @param {Function} done callback to invoke on success or error
 * @returns {object|Error} valid instance or error
 *
 * @author lally elias <lallyelias87@gmail.com>
 * @since 0.1.0
 * @version 0.1.0
 * @instance
 */
ChangeLogSchema.methods.preValidate = function preValidate(done) {
  // TODO: ensureRelated or ensureDefaults
  return done(null, this);
};

/**
 * @name updateEvent
 * @function updateEvent
 * @description Update existing event with the changes from this changelog
 * @param {Function} done callback to invoke on success or error
 * @returns {object|Error} valid changelog or error
 *
 * @author lally elias <lallyelias87@gmail.com>
 * @since 0.6.0
 * @version 0.1.0
 * @static
 * @example
 *
 * changelog.updateEvent((error, changelog) => { ... });
 *
 */
ChangeLogSchema.methods.updateEvent = function updateEvent(done) {
  // ref
  const Event = model(MODEL_NAME_EVENT);

  // update event with changes
  const updateRelatedEvent = (next) => Event.updateWithChangeLog(this, next);

  // ensure changelog event fields
  const updateSelfRelated = (eventi, next) => {
    const old = pick(this, ...EVENT_CHANGELOG_RELATED_FIELDS);
    const now = pick(eventi, ...EVENT_CHANGELOG_RELATED_FIELDS);
    const updates = mergeObjects(now, old);

    // update changelog
    this.set(updates);
    return this.save(next);
  };

  // update event
  const tasks = [updateRelatedEvent, updateSelfRelated];
  return waterfall(tasks, done);
};

/*
 *------------------------------------------------------------------------------
 * Statics
 *------------------------------------------------------------------------------
 */

/* static constants */
ChangeLogSchema.statics.MODEL_NAME = MODEL_NAME_EVENTCHANGELOG;
ChangeLogSchema.statics.COLLECTION_NAME = COLLECTION_NAME_EVENTCHANGELOG;

ChangeLogSchema.statics.USE_CHANGE = CHANGELOG_USE_CHANGE;
ChangeLogSchema.statics.USE_NOTIFICATION = CHANGELOG_USE_NOTIFICATION;
ChangeLogSchema.statics.USE_NEED = CHANGELOG_USE_NEED;
ChangeLogSchema.statics.USE_EFFECT = CHANGELOG_USE_EFFECT;
ChangeLogSchema.statics.USE_ASSESSMENT = CHANGELOG_USE_ASSESSMENT;
ChangeLogSchema.statics.USE_ACTION = CHANGELOG_USE_ACTION;
ChangeLogSchema.statics.USES = CHANGELOG_USES;

/**
 * @name prepareSeedCriteria
 * @function prepareSeedCriteria
 * @description define seed data criteria
 * @param {object} seed event changelog to be seeded
 * @returns {object} packed criteria for seeding
 *
 * @author lally elias <lallyelias87@gmail.com>
 * @since 0.2.0
 * @version 0.1.0
 * @static
 */
ChangeLogSchema.statics.prepareSeedCriteria = (seed) => {
  const copyOfSeed = copyInstance(seed);
  const fields = [
    'use',
    'initiator',
    'verifier',
    'group',
    'type',
    'event',
    'function',
    'action',
    'need',
    'effect',
    'unit',
  ];

  const criteria = idOf(copyOfSeed)
    ? pick(copyOfSeed, '_id')
    : pick(copyOfSeed, ...fields);

  return criteria;
};

/**
 * @name postWithChanges
 * @function postWithChanges
 * @description Post changelog and update existing event with the given changes
 * @param {object} changes valid event changes to apply
 * @param {Function} done callback to invoke on success or error
 * @returns {object|Error} valid changelog or error
 *
 * @author lally elias <lallyelias87@gmail.com>
 * @since 0.6.0
 * @version 0.1.0
 * @static
 * @example
 *
 * const changes = { comment: '...' };
 * EventChangeLog.postWithChanges(changes, (error, changelog) => { ... });
 *
 */
ChangeLogSchema.statics.postWithChanges = (changes, done) => {
  // ref
  // const Event = model(MODEL_NAME_EVENT);
  const EventChangeLog = model(MODEL_NAME_EVENTCHANGELOG);

  // save changes
  const saveChangeLog = (next) => EventChangeLog.post(changes, next);

  // update event with changes
  const updateEvent = (changelog, next) => changelog.updateEvent(next);

  // post changelog
  const tasks = [saveChangeLog, updateEvent];
  return waterfall(tasks, done);
};

/**
 * @name putWithChanges
 * @function putWithChanges
 * @description Put changelog and update existing event with
 * the given changes
 * @param {object} changes valid event changes to apply
 * @param {Function} done callback to invoke on success or error
 * @returns {object|Error} valid changelog or error
 *
 * @author lally elias <lallyelias87@gmail.com>
 * @since 0.6.0
 * @version 0.1.0
 * @static
 * @example
 *
 * const changes = { comment: '...' };
 * EventChangeLog.putWithChanges(changes, (error, changelog) => { ... });
 *
 */
ChangeLogSchema.statics.putWithChanges = (changes, done) => {
  // ref
  const EventChangeLog = model(MODEL_NAME_EVENTCHANGELOG);

  // put existing changelog
  const putChangeLog = (next) => EventChangeLog.put(changes, next);

  // update event with changes
  const updateEvent = (changelog, next) => changelog.updateEvent(next);

  // put changelog
  const tasks = [putChangeLog, updateEvent];
  return waterfall(tasks, done);
};

/**
 * @name patchWithChanges
 * @function patchWithChanges
 * @description Patch changelog and update existing event with
 * the given changes
 * @param {object} changes valid event changes to apply
 * @param {Function} done callback to invoke on success or error
 * @returns {object|Error} valid changelog or error
 *
 * @author lally elias <lallyelias87@gmail.com>
 * @since 0.6.0
 * @version 0.1.0
 * @static
 * @example
 *
 * const changes = { comment: '...' };
 * EventChangeLog.patchWithChanges(changes, (error, changelog) => { ... });
 *
 */
ChangeLogSchema.statics.patchWithChanges = (changes, done) => {
  // ref
  const EventChangeLog = model(MODEL_NAME_EVENTCHANGELOG);

  // patch existing changelog
  const patchChangeLog = (next) => EventChangeLog.patch(changes, next);

  // update event with changes
  const updateEvent = (changelog, next) => changelog.updateEvent(next);

  // patch changelog
  const tasks = [patchChangeLog, updateEvent];
  return waterfall(tasks, done);
};

/* export changelog model */
export default model(MODEL_NAME_EVENTCHANGELOG, ChangeLogSchema);
