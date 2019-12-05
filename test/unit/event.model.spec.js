import _ from 'lodash';
import { expect } from '@lykmapipo/mongoose-test-helpers';
import Event from '../../src/event.model';

describe('Event Instance', () => {
  it('should have pre validate logics', () => {
    const event = Event.fake();
    expect(event.preValidate).to.exist;
    expect(event.preValidate).to.be.a('function');
    expect(event.preValidate.length).to.be.equal(1);
    expect(event.preValidate.name).to.be.equal('preValidate');
  });

  it('should set startedAt on pre validate', done => {
    const event = Event.fakeExcept('startedAt');

    expect(event.startedAt).to.not.exist;
    event.preValidate(error => {
      expect(event.startedAt).to.exist;
      done(error);
    });
  });
});

describe.skip('Event Validations', () => {
  it('should generate number', done => {
    const event = Event.fakeExcept('number');
    // expect(event.number).to.not.exist;
    event.validate(error => {
      expect(error).to.not.exist;
      expect(event.number).to.exist;
      expect(event.number).to.contain('TZ');
      done(error, event);
    });
  });
});

describe('Event Statics', () => {
  it('should expose model name', () => {
    expect(Event.MODEL_NAME).to.exist;
    expect(Event.MODEL_NAME).to.be.equal('Event');
  });

  it('should expose collection name', () => {
    expect(Event.COLLECTION_NAME).to.exist;
    expect(Event.COLLECTION_NAME).to.be.equal('events');
  });

  it('should expose select options', () => {
    expect(Event.OPTION_SELECT).to.exist;
    expect(Event.OPTION_SELECT).to.be.eql({
      group: 1,
      type: 1,
      number: 1,
    });
  });

  it('should expose autopopulate options', () => {
    expect(Event.OPTION_AUTOPOPULATE).to.exist;
    expect(Event.OPTION_AUTOPOPULATE).to.be.eql({
      select: {
        group: 1,
        type: 1,
        number: 1,
      },
      maxDepth: 1,
    });
  });

  it('should prepare seed criteria', () => {
    const { _id, ...rest } = Event.fake().toObject();
    const seed = Event.prepareSeedCriteria(rest);
    expect(seed).to.exist;
    expect(seed.number).to.exist;
  });

  it('should prepare seed criteria from object id', () => {
    const event = Event.fake().toObject();
    const seed = Event.prepareSeedCriteria(event);
    expect(seed).to.exist;
    expect(seed._id).to.exist;
  });

  it('should prepare seed criteria from object id', () => {
    const event = _.omit(Event.fake().toObject(), '_id');
    const seed = Event.prepareSeedCriteria(event);
    expect(seed).to.exist;
    expect(seed._id).to.not.exist;
  });
});

describe('Event Faker', () => {
  it('should fake number', () => {
    const event = Event.fake();
    expect(event.number).to.exist.and.be.a('string');
  });
});
