import EventChangeLog from '../changelog.model';
import { updateEventWithChanges } from './event.api';

export const getChangeLogJsonSchema = (optns, done) => {
  const jsonSchema = EventChangeLog.jsonSchema();
  return done(null, jsonSchema);
};

export const exportChangeLogs = (optns, done) => {
  const fileName = `changelogs_exports_${Date.now()}.csv`;
  const readStream = EventChangeLog.exportCsv(optns);
  return done(null, { fileName, readStream });
};

export const getChangeLogs = (optns, done) => {
  return EventChangeLog.get(optns, done);
};

export const getChangeLogById = (optns, done) => {
  return EventChangeLog.getById(optns, done);
};

export const postChangeLogWithChanges = (optns, done) => {
  // TODO: pass put as action
  return updateEventWithChanges(optns, (error, event, changelog) => {
    return done(error, changelog);
  });
};

export const putChangeLogWithChanges = (optns, done) => {
  // TODO: send status update
  return EventChangeLog.put(optns, done);
};

export const patchChangeLogWithChanges = (optns, done) => {
  // TODO: send status update
  return EventChangeLog.patch(optns, done);
};

export const deleteChangeLogWithChanges = (optns, done) => {
  // TODO: sent status update
  return EventChangeLog.del(optns, done);
};
