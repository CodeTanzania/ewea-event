import EventChangeLog from '../changelog.model';

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
  return EventChangeLog.post(optns, done);
};

export const putChangeLogWithChanges = (optns, done) => {
  return EventChangeLog.put(optns, done);
};

export const patchChangeLogWithChanges = (optns, done) => {
  return EventChangeLog.patch(optns, done);
};

export const deleteChangeLogWithChanges = (optns, done) => {
  return EventChangeLog.del(optns, done);
};
