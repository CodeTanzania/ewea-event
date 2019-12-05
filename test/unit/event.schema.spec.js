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
    expect(group.options.index).to.be.true;
    // expect(group.options.required).to.be.true;
    expect(group.options.exists).to.be.true;
    expect(group.options.autopopulate).to.exist;
    expect(group.options.taggable).to.exist;
    expect(group.options.exportable).to.exist;
    // expect(group.options.aggregatable).to.exist;
    expect(group.options.default).to.be.undefined;
  });

  it('should have type field', () => {
    const type = Event.path('type');

    expect(type).to.exist;
    expect(type).to.be.instanceof(SchemaTypes.ObjectId);
    expect(type.options).to.exist;
    expect(type.options).to.be.an('object');
    expect(type.options.type).to.exist;
    expect(type.options.ref).to.exist;
    expect(type.options.ref).to.be.equal(Predefine.MODEL_NAME);
    // expect(type.options.required).to.be.true;
    expect(type.options.exists).to.be.true;
    expect(type.options.autopopulate).to.exist;
    expect(type.options.taggable).to.exist;
    expect(type.options.exportable).to.exist;
    // expect(type.options.aggregatable).to.exist;
    expect(type.options.default).to.be.undefined;
  });

  it('should have certainty field', () => {
    const certainty = Event.path('certainty');

    expect(certainty).to.exist;
    expect(certainty).to.be.instanceof(SchemaTypes.ObjectId);
    expect(certainty.options).to.exist;
    expect(certainty.options).to.be.an('object');
    expect(certainty.options.type).to.exist;
    expect(certainty.options.ref).to.exist;
    expect(certainty.options.ref).to.be.equal(Predefine.MODEL_NAME);
    // expect(certainty.options.required).to.be.true;
    expect(certainty.options.exists).to.be.true;
    expect(certainty.options.autopopulate).to.exist;
    expect(certainty.options.taggable).to.exist;
    expect(certainty.options.exportable).to.exist;
    // expect(certainty.options.aggregatable).to.exist;
    expect(certainty.options.default).to.be.undefined;
  });

  it('should have number field', () => {
    const number = Event.path('number');

    expect(number).to.exist;
    expect(number).to.be.instanceof(SchemaTypes.String);
    expect(number.options).to.exist;
    expect(number.options).to.be.an('object');
    expect(number.options.type).to.exist;
    expect(number.options.trim).to.be.true;
    expect(number.options.uppercase).to.be.true;
    expect(number.options.index).to.be.true;
    // expect(number.options.unique).to.be.true;
    // expect(number.options.required).to.be.true;
    expect(number.options.searchable).to.be.true;
    expect(number.options.taggable).to.be.true;
    expect(number.options.fake).to.exist;
  });

  it('should have cause field', () => {
    const cause = Event.path('cause');

    expect(cause).to.exist;
    expect(cause).to.be.instanceof(SchemaTypes.String);
    expect(cause.options).to.exist;
    expect(cause.options).to.be.an('object');
    expect(cause.options.type).to.exist;
    expect(cause.options.trim).to.be.true;
    expect(cause.options.index).to.be.true;
    expect(cause.options.searchable).to.be.true;
    expect(cause.options.exportable).to.be.true;
    expect(cause.options.fake).to.exist;
  });

  it('should have description field', () => {
    const description = Event.path('description');

    expect(description).to.exist;
    expect(description).to.be.instanceof(SchemaTypes.String);
    expect(description.options).to.exist;
    expect(description.options).to.be.an('object');
    expect(description.options.type).to.exist;
    expect(description.options.trim).to.be.true;
    expect(description.options.index).to.be.true;
    expect(description.options.searchable).to.be.true;
    expect(description.options.exportable).to.be.true;
    expect(description.options.fake).to.exist;
  });

  it('should have instruction field', () => {
    const instruction = Event.path('instruction');

    expect(instruction).to.exist;
    expect(instruction).to.be.instanceof(SchemaTypes.String);
    expect(instruction.options).to.exist;
    expect(instruction.options).to.be.an('object');
    expect(instruction.options.type).to.exist;
    expect(instruction.options.trim).to.be.true;
    expect(instruction.options.index).to.be.true;
    expect(instruction.options.searchable).to.be.true;
    expect(instruction.options.exportable).to.be.true;
    expect(instruction.options.fake).to.exist;
  });

  it('should have startedAt field', () => {
    const startedAt = Event.path('startedAt');

    expect(startedAt).to.exist;
    expect(startedAt).to.be.instanceof(SchemaTypes.Date);
    expect(startedAt.options).to.exist;
    expect(startedAt.options).to.be.an('object');
    expect(startedAt.options.type).to.exist;
    expect(startedAt.options.index).to.be.true;
    expect(startedAt.options.fake).to.exist;
  });

  it('should have endedAt field', () => {
    const endedAt = Event.path('endedAt');

    expect(endedAt).to.exist;
    expect(endedAt).to.be.instanceof(SchemaTypes.Date);
    expect(endedAt.options).to.exist;
    expect(endedAt.options).to.be.an('object');
    expect(endedAt.options.type).to.exist;
    expect(endedAt.options.index).to.be.true;
    expect(endedAt.options.fake).to.exist;
  });
});
