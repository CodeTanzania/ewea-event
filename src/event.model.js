import {
  MODEL_NAME_EVENT,
  MODEL_NAME_EVENTCHANGELOG,
  COLLECTION_NAME_EVENT,
} from '@codetanzania/ewea-internals';
import { parallel, waterfall } from 'async';
import { forEach, get, includes, omit, pick, union } from 'lodash';
import { mergeObjects, idOf } from '@lykmapipo/common';
import { copyInstance, createSchema, model } from '@lykmapipo/mongoose-common';
import '@lykmapipo/mongoose-sequenceable';
import actions from 'mongoose-rest-actions';
import exportable from '@lykmapipo/mongoose-exportable';
import { Predefine } from '@lykmapipo/predefine';

import {
  EVENT_SCHEMA_OPTIONS,
  EVENT_STAGE_ALERT,
  EVENT_STAGE_EVENT,
  EVENT_STAGES,
  EVENT_OPTION_SELECT,
  EVENT_OPTION_AUTOPOPULATE,
  EVENT_UPDATE_ARRAY_FIELDS,
  EVENT_UPDATE_IGNORED_FIELDS,
  EVENT_RELATION_PREDEFINE_FIELDS,
} from './internals';

import {
  sendEventUpdates,
  sendEventNotification,
} from './api/notification.api';

import {
  group,
  type,
  level,
  severity,
  certainty,
  status,
  urgency,
  response,
} from './schema/base.schema';
import { location, address, areas } from './schema/geos.schema';
import { reporter, agencies, focals } from './schema/parties.schema';
import {
  stage,
  number,
  causes,
  description,
  places,
  instructions,
  interventions,
  impacts,
  remarks,
  startedAt,
  endedAt,
} from './schema/event.base.schema';

// TODO: calculate expose(risk) after create
// TODO: send actions after create
// TODO: ensure all fields in changelog schema?

const SCHEMA = mergeObjects(
  { group, type, level, severity, certainty, status, urgency, response },
  { stage, number },
  { location, address },
  { causes, description, places },
  { areas },
  { reporter, agencies, focals },
  { instructions, interventions, impacts, remarks, startedAt, endedAt }
);

/**
 * @module Event
 * @namespace Event
 * @name Event
 * @description A representation of an entity which define and track an
 * instance(or occurrence) of an emergency(or disaster) event.
 *
 * @see {@link https://en.wikipedia.org/wiki/Disaster}
 *
 * @author lally elias <lallyelias87@gmail.com>
 * @license MIT
 * @since 0.1.0
 * @version 0.1.0
 * @public
 * @example
 * const { Event } = require('@codetanzania/ewea-event');
 * Event.create(event, (error, created) => { ... });
 */
const EventSchema = createSchema(
  SCHEMA,
  EVENT_SCHEMA_OPTIONS,
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
 * @description event schema pre validation hook
 * @param {Function} done callback to invoke on success or error
 * @returns {object|Error} valid instance or error
 *
 * @author lally elias <lallyelias87@gmail.com>
 * @since 0.1.0
 * @version 0.1.0
 * @private
 */
EventSchema.pre('validate', function onPreValidate(done) {
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
 * @description event schema pre validation hook logic
 * @param {Function} done callback to invoke on success or error
 * @returns {object|Error} valid instance or error
 *
 * @author lally elias <lallyelias87@gmail.com>
 * @since 0.1.0
 * @version 0.1.0
 * @instance
 */
EventSchema.methods.preValidate = function preValidate(done) {
  // ensure started(or reported) date
  this.startedAt = this.startedAt || new Date();

  // ensure group from type
  if (this.type) {
    this.group = get(this, 'type.relations.group', this.group);
  }

  return done(null, this);
};

/*
 *------------------------------------------------------------------------------
 * Statics
 *------------------------------------------------------------------------------
 */

/* static constants */
EventSchema.statics.MODEL_NAME = MODEL_NAME_EVENT;
EventSchema.statics.COLLECTION_NAME = COLLECTION_NAME_EVENT;
EventSchema.statics.OPTION_SELECT = EVENT_OPTION_SELECT;
EventSchema.statics.OPTION_AUTOPOPULATE = EVENT_OPTION_AUTOPOPULATE;

EventSchema.statics.STAGE_ALERT = EVENT_STAGE_ALERT;
EventSchema.statics.STAGE_EVENT = EVENT_STAGE_EVENT;
EventSchema.statics.STAGES = EVENT_STAGES;

/**
 * @name prepareSeedCriteria
 * @function prepareSeedCriteria
 * @description define seed data criteria
 * @param {object} seed event to be seeded
 * @returns {object} packed criteria for seeding
 *
 * @author lally elias <lallyelias87@gmail.com>
 * @since 0.2.0
 * @version 0.1.0
 * @static
 */
EventSchema.statics.prepareSeedCriteria = seed => {
  const copyOfSeed = copyInstance(seed);

  const criteria = idOf(copyOfSeed)
    ? pick(copyOfSeed, '_id')
    : pick(copyOfSeed, 'group', 'type', 'number');

  return criteria;
};

/**
 * @name preloadRelations
 * @function preloadRelations
 * @description Preload given event relations
 * @param {object} event valid event instance or object
 * @param {Function} done callback to invoke on success or error
 * @returns {object|Error} pre-loaded relations or error
 * @author lally elias <lallyelias87@gmail.com>
 * @since 0.6.0
 * @version 0.1.0
 * @static
 * @example
 *
 * const event = { _id: '...', group: '...', type: '...' };
 * Event.preloadRelations(event, (error, updated) => { ... });
 */
EventSchema.statics.preloadRelations = (event, done) => {
  // prepare relations to preload
  const relations = {};

  // prepare predefines loader
  forEach(EVENT_RELATION_PREDEFINE_FIELDS, (criteria, relation) => {
    const related = get(event, relation);
    const relatedId = idOf(related) || related;
    // event has relation
    if (relatedId) {
      relations[relation] = next => Predefine.getById({ _id: relatedId }, next);
    }
    // use default criteria
    else if (criteria) {
      relations[relation] = next => Predefine.findOne(criteria, next);
    }
    // continue
    else {
      relations[relation] = next => next(null, null);
    }
  });

  // execute loader
  return parallel(relations, done);
};

/**
 * @name postWithChanges
 * @function postWithChanges
 * @description Update existing Event with the given changes
 * @param {object} event valid event object to save
 * @param {Function} done callback to invoke on success or error
 * @returns {object|Error} created event or error
 *
 * @author lally elias <lallyelias87@gmail.com>
 * @since 0.6.0
 * @version 0.1.0
 * @static
 * @example
 *
 * const event = { type: '...', description: '...' };
 * Event.postWithChanges(event, (error, created) => { ... });
 *
 */
EventSchema.statics.postWithChanges = (event, done) => {
  // ref
  const Event = model(MODEL_NAME_EVENT);

  // preload event relations
  const preloadRelated = next => Event.preloadRelations(event, next);

  // save event
  const saveEvent = (relations, next) => {
    const eventi = mergeObjects(event, relations);
    return Event.post(eventi, next);
  };

  // send event notification
  const sendNotification = (eventi, next) => {
    // TODO: check AUTO_EVENT_NOTIFICATION_ENABLED=true
    return sendEventNotification(eventi, (error /* , campaign */) => {
      return next(error, eventi);
    });
  };

  // TODO: ensure level, severity, certainty, status, urgency, response
  // TODO: save initial changelog(reported)

  // save event
  const tasks = [preloadRelated, saveEvent, sendNotification];
  return waterfall(tasks, done);
};

/**
 * @name updateWith
 * @function updateWith
 * @description Update existing Event with the given criteria and changes
 * @param {object} criteria valid event query criteria
 * @param {object} changes valid event changes to apply
 * @param {Function} done callback to invoke on success or error
 * @returns {object|Error} updated event or error
 *
 * @author lally elias <lallyelias87@gmail.com>
 * @since 0.6.0
 * @version 0.1.0
 * @static
 * @example
 *
 * const criteria = { _id: '...' };
 * const changes = { remarks: '...' };
 * Event.updateWith(criteria, changes, (error, updated) => { ... });
 *
 */
EventSchema.statics.updateWith = (criteria, changes, done) => {
  // ref
  const Event = model(MODEL_NAME_EVENT);

  // find existing event by given criteria
  const findEvent = next => {
    return Event.findOne(criteria)
      .orFail()
      .exec(next);
  };

  // apply changes to found event
  const applyChanges = (event, next) => {
    // compute updates with ignores
    const updates = { updatedAt: new Date() };
    const allowedChanges = omit(changes, ...EVENT_UPDATE_IGNORED_FIELDS);
    forEach(allowedChanges, (value, key) => {
      const isArrayField = includes(EVENT_UPDATE_ARRAY_FIELDS, key);
      if (isArrayField) {
        const existValue = get(event, key);
        updates[key] = union(existValue, [].concat(value));
      }
      updates[key] = value;
    });

    // persist event changes
    event.set(updates);
    return event.save(next);
  };

  // notify event updates
  const sendUpdates = (event, next) => {
    return sendEventUpdates(event, changes, (error /* , campaign */) => {
      return next(error, event);
    });
  };

  // update event
  const tasks = [findEvent, applyChanges, sendUpdates];
  return waterfall(tasks, done);
};

/**
 * @name updateWithChanges
 * @function updateWithChanges
 * @description Update existing Event with the given changes
 * @param {object} changes valid event changes to apply
 * @param {Function} done callback to invoke on success or error
 * @returns {object|Error} updated event or error
 *
 * @author lally elias <lallyelias87@gmail.com>
 * @since 0.6.0
 * @version 0.1.0
 * @static
 * @example
 *
 * const changes = { _id: '...', remarks: '...' };
 * Event.updateWithChanges(criteria, changes, (error, updated) => { ... });
 *
 */
EventSchema.statics.updateWithChanges = (changes, done) => {
  // ref
  const Event = model(MODEL_NAME_EVENT);
  const EventChangeLog = model(MODEL_NAME_EVENTCHANGELOG);

  // obtain event id
  const eventId = idOf(changes) || changes.id;

  // post changelog
  const postChangeLog = next => {
    let changed = omit(changes, EVENT_UPDATE_IGNORED_FIELDS);
    // TODO ensure event fields(description, instructions etc) in changelog
    const comment =
      changes.causes ||
      changes.impacts ||
      changes.interventions ||
      changes.remarks ||
      changes.places ||
      changes.instructions ||
      changes.description;
    changed = mergeObjects(changed, { event: eventId, comment });

    // TODO use EventChangeLog.postWithChanges once
    // all event fields are also in changelog
    return EventChangeLog.post(changed, next);
  };

  // update event with changes
  const updateEvent = (changelog, next) => {
    const criteria = { _id: eventId };
    return Event.updateWith(criteria, changes, next);
  };

  // update event with changes
  const tasks = [postChangeLog, updateEvent];
  return waterfall(tasks, done);
};

/**
 * @name updateWithChangeLog
 * @function updateWithChangeLog
 * @description Update existing event with the given changelog instance
 * @param {object} changelog valid event changelog to apply
 * @param {Function} done callback to invoke on success or error
 * @returns {object|Error} updated event or error
 *
 * @author lally elias <lallyelias87@gmail.com>
 * @since 0.6.0
 * @version 0.1.0
 * @static
 * @example
 *
 * const changes = { _id: '...', comment: '...' };
 * Event.updateWithChangeLog(criteria, changes, (error, updated) => { ... });
 *
 */
EventSchema.statics.updateWithChangeLog = (changelog, done) => {
  // ref
  const Event = model(MODEL_NAME_EVENT);

  // return if changelog has no event
  if (!changelog.event) {
    return done(null, changelog);
  }

  // convert changelog to object
  const changes = changelog.toObject();

  // ensure event criteria
  const criteria = { _id: idOf(changes.event) || changes.event };

  // update event with changelog
  return Event.updateWith(criteria, changes, done);
};

/* export event model */
export default model(MODEL_NAME_EVENT, EventSchema);
