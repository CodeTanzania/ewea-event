import { isArray } from 'lodash';
import { waterfall } from 'async';
import { connect, syncIndexes } from '@lykmapipo/mongoose-common';
import { createModels } from '@lykmapipo/file';
import { Event, EventChangeLog } from '../src';

// naive logger
const log = (stage, error, result) => {
  if (error) {
    console.error(`${stage} seed error`, error);
  }
  if (result) {
    const val = isArray(result) ? result.length : result;
    console.info(`${stage} seed result`, val);
  }
};

// refs
let seedStart;
let seedEnd;

// seed events
const seedEvent = done => {
  Event.seed((error, seeded) => {
    log('events', error, seeded);
    done(error);
  });
};

// seed changelogs
const seedEventChangeLog = done => {
  EventChangeLog.seed((error, seeded) => {
    log('changelogs', error, seeded);
    done(error);
  });
};

// ensure indexes
const ensureIndexes = done => syncIndexes(error => done(error));

// ensure connections
const ensureConnection = done => connect(error => done(error));

const ensureFileModels = done => {
  createModels();
  return done();
};

// do seed
const seed = done => {
  seedStart = Date.now();
  return waterfall(
    [
      ensureConnection,
      ensureFileModels,
      ensureIndexes,
      seedEvent,
      seedEventChangeLog,
    ],
    done
  );
};

// do seeding
seed((error, results = [true]) => {
  seedEnd = Date.now();
  log('time', null, seedEnd - seedStart);
  log('final', error, results);
  process.exit(0);
});
