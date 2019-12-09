import _ from 'lodash';
import { expect } from '@lykmapipo/mongoose-test-helpers';
import EventChangeLog from '../../src/changelog.model';

describe('EventChangeLog Instance', () => {
  it('should have pre validate logics', () => {
    const changelog = EventChangeLog.fake();
    expect(changelog.preValidate).to.exist;
    expect(changelog.preValidate).to.be.a('function');
    expect(changelog.preValidate.length).to.be.equal(1);
    expect(changelog.preValidate.name).to.be.equal('preValidate');
  });
});

describe.skip('EventChangeLog Validations', () => {});

describe('EventChangeLog Statics', () => {
  it('should expose model name', () => {
    expect(EventChangeLog.MODEL_NAME).to.exist;
    expect(EventChangeLog.MODEL_NAME).to.be.equal('EventChangeLog');
  });

  it('should expose collection name', () => {
    expect(EventChangeLog.COLLECTION_NAME).to.exist;
    expect(EventChangeLog.COLLECTION_NAME).to.be.equal('eventchangelogs');
  });

  it.skip('should expose select options', () => {});

  it.skip('should expose autopopulate options', () => {});

  it('should prepare seed criteria', () => {
    const { _id, ...rest } = EventChangeLog.fake().toObject();
    const seed = EventChangeLog.prepareSeedCriteria(rest);
    expect(seed).to.exist;
    expect(seed.use).to.exist;
  });

  it('should prepare seed criteria from object id', () => {
    const changelog = EventChangeLog.fake().toObject();
    const seed = EventChangeLog.prepareSeedCriteria(changelog);
    expect(seed).to.exist;
    expect(seed._id).to.exist;
  });

  it('should prepare seed criteria from object id', () => {
    const changelog = _.omit(EventChangeLog.fake().toObject(), '_id');
    const seed = EventChangeLog.prepareSeedCriteria(changelog);
    expect(seed).to.exist;
    expect(seed._id).to.not.exist;
  });
});

describe.skip('EventChangeLog Faker', () => {});
