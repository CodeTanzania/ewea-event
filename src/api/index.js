import Event from '../event.model';

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

export const postEventWitchChanges = (optns, done) => {
  return Event.post(optns, done);
};

export const putEventWitchChanges = (optns, done) => {
  return Event.put(optns, done);
};

export const patchEventWitchChanges = (optns, done) => {
  return Event.patch(optns, done);
};

export const deleteEventWitchChanges = (optns, done) => {
  return Event.del(optns, done);
};
