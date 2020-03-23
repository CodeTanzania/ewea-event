import { forEach, get, includes, omit, union } from 'lodash';
import { waterfall, parallel } from 'async';
import { idOf, mergeObjects } from '@lykmapipo/common';
import { Predefine } from '@lykmapipo/predefine';
import { sendEventNotification } from './notification.api';
import Event from '../event.model';
import EventChangeLog from '../changelog.model';

// TODO: move to internal/common
export const ignoredFields = [
  '_id',
  'id',
  'event',
  'keyword',
  'number',
  'location',
  'address',
  'createdAt',
  'use',
];

export const arrayFields = ['areas', 'agencies', 'focals'];

export const omitIgnored = obj => omit(obj, ...ignoredFields);

export const isArrayField = field => includes(arrayFields, field);

export const ACTION_PATCH = 'patch';

export const ACTION_PUT = 'put';

export const preLoadRelated = (optns, done) => {
  // TODO: load defaults related(Predefine.fetchDefaults)

  // ensure options
  const options = mergeObjects(optns);

  const ensureType = next => {
    const typeId = idOf(options.type) || options.type;
    if (typeId) {
      // TODO: or find default
      return Predefine.getById({ _id: typeId }, next);
    }
    return next(null, typeId);
  };

  const ensureGroup = next => {
    const typeId = idOf(options.type) || options.type;
    if (typeId) {
      // TODO: or find default
      // TODO: try use group if exists
      return Predefine.getById({ _id: typeId }, (error, type) => {
        const group = get(type, 'relations.group');
        return next(error, group);
      });
    }
    return next(null, null);
  };

  // execute tasks
  const tasks = { type: ensureType, group: ensureGroup };
  return parallel(tasks, done);
};

export const getEventJsonSchema = (optns, done) => {
  const jsonSchema = Event.jsonSchema();
  return done(null, jsonSchema);
};

export const exportEvents = (optns, done) => {
  const fileName = `events_exports_${Date.now()}.csv`;
  const readStream = Event.exportCsv(optns);
  return done(null, { fileName, readStream });
};

export const getEvents = (optns, done) => {
  return Event.get(optns, done);
};

export const getEventById = (optns, done) => {
  return Event.getById(optns, done);
};

export const postEventWithChanges = (optns, done) => {
  const options = mergeObjects(optns);

  return waterfall(
    [
      next => preLoadRelated(options, next),
      (related, next) => {
        const event = mergeObjects(options, related);
        return Event.post(event, next);
      },
      (event, next) => {
        // TODO: check AUTO_EVENT_NOTIFICATION_ENABLED=true
        return sendEventNotification(event, (/* error, sent */) => {
          // TODO: notify(or log) swallowed error
          return next(null, event);
        });
      },
      // TODO: ensure level, severity, certainty, status, urgency
      // TODO: save initial changelog
    ],
    done
  );
};

// TODO: accept changelog?
export const updateEvent = (optns, done) => {
  // obtain eventId
  const eventId = idOf(optns.event) || optns.event || optns.id;

  // fetch existing event
  const fetchEvent = next => {
    return Event.findById(eventId, (error, event) => {
      // TODO: report swallowed error
      return next(null, event);
    });
  };

  // apply changes
  const applyEventChanges = (event, next) => {
    if (event) {
      // compute other changes
      const changes = { updatedAt: new Date() };
      forEach(omitIgnored(optns), (value, key) => {
        if (isArrayField(key)) {
          const existValue = get(event, key);
          changes[key] = union(existValue, [].concat(value));
        }
        changes[key] = value;
      });
      // apply changes
      event.set(changes);
      return event.save(next); // TODO: put|patch
    }
    return next(null, event);
  };

  // update event
  const tasks = [fetchEvent, applyEventChanges];
  return waterfall(tasks, done);
};

export const updateEventWithChangeLog = (changelog, done) => {
  // return if changelog has no event
  if (!changelog.event) {
    return done(null, changelog);
  }

  // convert changelog to object
  const changes = changelog.toObject();
  // ensure event id
  changes.event = idOf(changes.event) || changes.event;

  // update event with changelog
  return updateEvent(changes, done);
};

// update event with changes
export const updateEventWithChanges = (optns, done) => {
  // save received changelogs
  const saveChangeLog = next => {
    return EventChangeLog.post(omitIgnored(optns), next);
  };

  // update event with received changes
  const saveEventChanges = (changelog, next) => {
    return updateEvent(optns, (error, event) => {
      return next(error, event, changelog);
    });
  };

  // TODO: sendEventUpdates(event, changelog);

  // collect event changes tasks
  const tasks = [saveChangeLog, saveEventChanges];

  // apply event changes
  return waterfall(tasks, done);
};

// put event with received changes
export const putEventWithChanges = (optns, done) => {
  // TODO: pass put as action
  return updateEventWithChanges(optns, (error, event /* , changelog */) => {
    return done(error, event);
  });
};

// patch event with received changes
export const patchEventWithChanges = (optns, done) => {
  // TODO: pass patch as action
  return updateEventWithChanges(optns, (error, event /* , changelog */) => {
    return done(error, event);
  });
};

// soft delete event
export const deleteEventWithChanges = (optns, done) => {
  return Event.del(optns, done);
};
