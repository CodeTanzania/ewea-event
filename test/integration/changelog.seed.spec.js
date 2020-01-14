import path from 'path';
import _ from 'lodash';
import { clear, expect } from '@lykmapipo/mongoose-test-helpers';
import { createModels } from '@lykmapipo/file';
import { Event, EventChangeLog } from '../../src';

describe('Event Changelog Seed', () => {
  const { SEED_PATH } = process.env;
  let changelog;
  let event;

  before(done => clear(done));

  before(() => {
    process.env.SEED_PATH = path.join(__dirname, '..', 'fixtures');
  });

  before(done =>
    Event.seed((error, seeded) => {
      event = _.first([].concat(seeded));
      return done(error, seeded);
    })
  );

  beforeEach(() => createModels());

  it('should be able to seed', done => {
    EventChangeLog.seed((error, seeded) => {
      expect(error).to.not.exist;
      expect(seeded).to.exist;
      expect(seeded).to.length.at.least(1);
      changelog = _.first(seeded);
      done(error, seeded);
    });
  });

  it('should not throw if seed exist', done => {
    EventChangeLog.seed((error, seeded) => {
      expect(error).to.not.exist;
      expect(seeded).to.exist;
      expect(seeded).to.length.at.least(1);
      done(error, seeded);
    });
  });

  it('should seed provided', done => {
    const seed = EventChangeLog.fakeOnly('comment');
    seed.set({ event });

    EventChangeLog.seed(seed.toObject(), (error, seeded) => {
      expect(error).to.not.exist;
      expect(seeded).to.exist;
      expect(seeded).to.length.at.least(1);
      done(error, seeded);
    });
  });

  it('should seed provided', done => {
    const seed = EventChangeLog.fakeOnly('comment');
    seed.set({ event });

    EventChangeLog.seed([seed.toObject()], (error, seeded) => {
      expect(error).to.not.exist;
      expect(seeded).to.exist;
      expect(seeded).to.length.at.least(1);
      done(error, seeded);
    });
  });

  it('should not throw if provided exist', done => {
    const seed = changelog.toObject();
    EventChangeLog.seed(seed, (error, seeded) => {
      expect(error).to.not.exist;
      expect(seeded).to.exist;
      expect(seeded).to.length.at.least(1);
      done(error, seeded);
    });
  });

  it('should be able to seed from environment', done => {
    EventChangeLog.seed((error, seeded) => {
      expect(error).to.not.exist;
      expect(seeded).to.exist;
      expect(seeded).to.length.at.least(1);
      done(error, seeded);
    });
  });

  it('should not throw if seed from environment exist', done => {
    EventChangeLog.seed((error, seeded) => {
      expect(error).to.not.exist;
      expect(seeded).to.exist;
      expect(seeded).to.length.at.least(1);
      done(error, seeded);
    });
  });

  after(done => clear(done));

  after(() => {
    process.env.SEED_PATH = SEED_PATH;
  });
});
