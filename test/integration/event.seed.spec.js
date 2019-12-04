import path from 'path';
import _ from 'lodash';
import { clear, expect } from '@lykmapipo/mongoose-test-helpers';
import { Event } from '../../src';

describe('Event Seed', () => {
  const { SEED_PATH } = process.env;
  let event;

  before(done => clear(done));

  before(() => {
    process.env.SEED_PATH = path.join(__dirname, '..', 'fixtures');
  });

  it('should be able to seed', done => {
    Event.seed((error, seeded) => {
      expect(error).to.not.exist;
      expect(seeded).to.exist;
      expect(seeded).to.length.at.least(1);
      event = _.first(seeded);
      done(error, seeded);
    });
  });

  it('should not throw if seed exist', done => {
    Event.seed((error, seeded) => {
      expect(error).to.not.exist;
      expect(seeded).to.exist;
      expect(seeded).to.length.at.least(1);
      done(error, seeded);
    });
  });

  it('should seed provided', done => {
    const seed = Event.fake().toObject();
    Event.seed(seed, (error, seeded) => {
      expect(error).to.not.exist;
      expect(seeded).to.exist;
      expect(seeded).to.length.at.least(1);
      done(error, seeded);
    });
  });

  it('should seed provided', done => {
    const seed = Event.fake().toObject();
    Event.seed([seed], (error, seeded) => {
      expect(error).to.not.exist;
      expect(seeded).to.exist;
      expect(seeded).to.length.at.least(1);
      done(error, seeded);
    });
  });

  it('should not throw if provided exist', done => {
    const seed = event.toObject();
    Event.seed(seed, (error, seeded) => {
      expect(error).to.not.exist;
      expect(seeded).to.exist;
      expect(seeded).to.length.at.least(1);
      done(error, seeded);
    });
  });

  it('should be able to seed from environment', done => {
    Event.seed((error, seeded) => {
      expect(error).to.not.exist;
      expect(seeded).to.exist;
      expect(seeded).to.length.at.least(1);
      done(error, seeded);
    });
  });

  it('should not throw if seed from environment exist', done => {
    Event.seed((error, seeded) => {
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
