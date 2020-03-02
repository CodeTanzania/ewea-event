import { get } from 'lodash';
import { waterfall, parallel } from 'async';
import { idOf, mergeObjects } from '@lykmapipo/common';
import { Predefine } from '@lykmapipo/predefine';
import Event from '../event.model';
import { sendEventNotification } from './notification.api';

export const preLoadRelated = (optns, done) => {
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

export const putEventWithChanges = (optns, done) => {
  return Event.put(optns, done);
};

export const patchEventWithChanges = (optns, done) => {
  return Event.patch(optns, done);
};

export const deleteEventWithChanges = (optns, done) => {
  return Event.del(optns, done);
};
