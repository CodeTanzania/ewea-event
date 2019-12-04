import { SchemaTypes } from '@lykmapipo/mongoose-common';
import { expect } from '@lykmapipo/mongoose-test-helpers';
import { Predefine } from '@lykmapipo/predefine';
import Event from '../../src/event.model';

describe('Event Schema', () => {
  it('should have group field', () => {
    const group = Event.path('group');

    expect(group).to.exist;
    expect(group).to.be.instanceof(SchemaTypes.ObjectId);
    expect(group.options).to.exist;
    expect(group.options).to.be.an('object');
    expect(group.options.type).to.exist;
    expect(group.options.ref).to.exist;
    expect(group.options.ref).to.be.equal(Predefine.MODEL_NAME);
    // expect(group.options.required).to.be.true;
    expect(group.options.default).to.be.undefined;
    expect(group.options.index).to.be.true;
    expect(group.options.exists).to.be.true;
    expect(group.options.autopopulate).to.exist;
  });
});
