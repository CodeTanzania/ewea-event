import { SchemaTypes } from '@lykmapipo/mongoose-common';
import { expect } from '@lykmapipo/mongoose-test-helpers';
import { Predefine } from '@lykmapipo/predefine';
import { Party } from '@codetanzania/emis-stakeholder';
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

  it('should have level field', () => {
    const level = Event.path('level');

    expect(level).to.exist;
    expect(level).to.be.instanceof(SchemaTypes.ObjectId);
    expect(level.options).to.exist;
    expect(level.options).to.be.an('object');
    expect(level.options.type).to.exist;
    expect(level.options.ref).to.exist;
    expect(level.options.ref).to.be.equal(Predefine.MODEL_NAME);
    // expect(level.options.required).to.be.true;
    expect(level.options.exists).to.be.true;
    expect(level.options.autopopulate).to.exist;
    expect(level.options.taggable).to.exist;
    expect(level.options.exportable).to.exist;
    // expect(level.options.aggregatable).to.exist;
    expect(level.options.default).to.be.undefined;
  });

  it('should have severity field', () => {
    const severity = Event.path('severity');

    expect(severity).to.exist;
    expect(severity).to.be.instanceof(SchemaTypes.ObjectId);
    expect(severity.options).to.exist;
    expect(severity.options).to.be.an('object');
    expect(severity.options.type).to.exist;
    expect(severity.options.ref).to.exist;
    expect(severity.options.ref).to.be.equal(Predefine.MODEL_NAME);
    // expect(severity.options.required).to.be.true;
    expect(severity.options.exists).to.be.true;
    expect(severity.options.autopopulate).to.exist;
    expect(severity.options.taggable).to.exist;
    expect(severity.options.exportable).to.exist;
    // expect(severity.options.aggregatable).to.exist;
    expect(severity.options.default).to.be.undefined;
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

  it('should have status field', () => {
    const status = Event.path('status');

    expect(status).to.exist;
    expect(status).to.be.instanceof(SchemaTypes.ObjectId);
    expect(status.options).to.exist;
    expect(status.options).to.be.an('object');
    expect(status.options.type).to.exist;
    expect(status.options.ref).to.exist;
    expect(status.options.ref).to.be.equal(Predefine.MODEL_NAME);
    // expect(status.options.required).to.be.true;
    expect(status.options.exists).to.be.true;
    expect(status.options.autopopulate).to.exist;
    expect(status.options.taggable).to.exist;
    expect(status.options.exportable).to.exist;
    // expect(status.options.aggregatable).to.exist;
    expect(status.options.default).to.be.undefined;
  });

  it('should have urgency field', () => {
    const urgency = Event.path('urgency');

    expect(urgency).to.exist;
    expect(urgency).to.be.instanceof(SchemaTypes.ObjectId);
    expect(urgency.options).to.exist;
    expect(urgency.options).to.be.an('object');
    expect(urgency.options.type).to.exist;
    expect(urgency.options.ref).to.exist;
    expect(urgency.options.ref).to.be.equal(Predefine.MODEL_NAME);
    // expect(urgency.options.required).to.be.true;
    expect(urgency.options.exists).to.be.true;
    expect(urgency.options.autopopulate).to.exist;
    expect(urgency.options.taggable).to.exist;
    expect(urgency.options.exportable).to.exist;
    // expect(urgency.options.aggregatable).to.exist;
    expect(urgency.options.default).to.be.undefined;
  });

  it('should have response field', () => {
    const response = Event.path('response');

    expect(response).to.exist;
    expect(response).to.be.instanceof(SchemaTypes.ObjectId);
    expect(response.options).to.exist;
    expect(response.options).to.be.an('object');
    expect(response.options.type).to.exist;
    expect(response.options.ref).to.exist;
    expect(response.options.ref).to.be.equal(Predefine.MODEL_NAME);
    // expect(response.options.required).to.be.true;
    expect(response.options.exists).to.be.true;
    expect(response.options.autopopulate).to.exist;
    expect(response.options.taggable).to.exist;
    expect(response.options.exportable).to.exist;
    // expect(response.options.aggregatable).to.exist;
    expect(response.options.default).to.be.undefined;
  });

  it('should have stage field', () => {
    const stage = Event.path('stage');

    expect(stage).to.exist;
    expect(stage).to.be.instanceof(SchemaTypes.String);
    expect(stage.options).to.exist;
    expect(stage.options).to.be.an('object');
    expect(stage.options.type).to.exist;
    expect(stage.options.trim).to.be.true;
    expect(stage.options.enum).to.be.eql(Event.STAGES);
    expect(stage.options.index).to.be.true;
    expect(stage.options.searchable).to.be.true;
    expect(stage.options.taggable).to.be.true;
    expect(stage.options.exportable).to.be.true;
    expect(stage.options.default).to.be.equal(Event.STAGE_ALERT);
    expect(stage.options.fake).to.exist;
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

  it('should have address field', () => {
    const address = Event.path('address');

    expect(address).to.exist;
    expect(address).to.be.instanceof(SchemaTypes.String);
    expect(address.options).to.exist;
    expect(address.options).to.be.an('object');
    expect(address.options.type).to.exist;
    expect(address.options.trim).to.be.true;
    expect(address.options.index).to.be.true;
    expect(address.options.searchable).to.be.true;
    expect(address.options.exportable).to.be.true;
    expect(address.options.fake).to.exist;
  });

  it('should have location field', () => {
    const location = Event.path('location');

    expect(location).to.exist;
    expect(location).to.be.an.instanceof(SchemaTypes.Embedded);
    expect(location.options.index).to.exist.and.be.equal('2dsphere');
    expect(location.options.fake).to.exist.and.be.a('function');
  });

  it('should have causes field', () => {
    const causes = Event.path('causes');

    expect(causes).to.exist;
    expect(causes).to.be.instanceof(SchemaTypes.String);
    expect(causes.options).to.exist;
    expect(causes.options).to.be.an('object');
    expect(causes.options.type).to.exist;
    expect(causes.options.trim).to.be.true;
    expect(causes.options.index).to.be.true;
    expect(causes.options.searchable).to.be.true;
    expect(causes.options.exportable).to.be.true;
    expect(causes.options.fake).to.exist;
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

  it('should have places field', () => {
    const places = Event.path('places');

    expect(places).to.exist;
    expect(places).to.be.instanceof(SchemaTypes.String);
    expect(places.options).to.exist;
    expect(places.options).to.be.an('object');
    expect(places.options.type).to.exist;
    expect(places.options.trim).to.be.true;
    expect(places.options.index).to.be.true;
    expect(places.options.searchable).to.be.true;
    expect(places.options.exportable).to.be.true;
    expect(places.options.fake).to.exist;
  });

  it('should have areas field', () => {
    const areas = Event.path('areas');

    expect(areas).to.exist;
    expect(areas).to.be.instanceof(SchemaTypes.Array);
    expect(areas.options).to.exist;
    expect(areas.options).to.be.an('object');
    expect(areas.options.type).to.exist;
    expect(areas.options.ref).to.exist;
    expect(areas.options.ref).to.be.equal(Predefine.MODEL_NAME);
    // expect(areas.options.required).to.be.true;
    expect(areas.options.exists).to.be.true;
    expect(areas.options.autopopulate).to.exist;
    expect(areas.options.taggable).to.exist;
    expect(areas.options.exportable).to.exist;
    // expect(areas.options.aggregatable).to.exist;
    expect(areas.options.default).to.be.undefined;
  });

  it('should have agencies field', () => {
    const agencies = Event.path('agencies');

    expect(agencies).to.exist;
    expect(agencies).to.be.instanceof(SchemaTypes.Array);
    expect(agencies.options).to.exist;
    expect(agencies.options).to.be.an('object');
    expect(agencies.options.type).to.exist;
    expect(agencies.options.ref).to.exist;
    expect(agencies.options.ref).to.be.equal(Party.MODEL_NAME);
    // expect(agencies.options.required).to.be.true;
    expect(agencies.options.exists).to.be.true;
    expect(agencies.options.autopopulate).to.exist;
    expect(agencies.options.taggable).to.exist;
    expect(agencies.options.exportable).to.exist;
    // expect(agencies.options.aggregatable).to.exist;
    expect(agencies.options.default).to.be.undefined;
  });

  it('should have focals field', () => {
    const focals = Event.path('focals');

    expect(focals).to.exist;
    expect(focals).to.be.instanceof(SchemaTypes.Array);
    expect(focals.options).to.exist;
    expect(focals.options).to.be.an('object');
    expect(focals.options.type).to.exist;
    expect(focals.options.ref).to.exist;
    expect(focals.options.ref).to.be.equal(Party.MODEL_NAME);
    // expect(focals.options.required).to.be.true;
    expect(focals.options.exists).to.be.true;
    expect(focals.options.autopopulate).to.exist;
    expect(focals.options.taggable).to.exist;
    expect(focals.options.exportable).to.exist;
    // expect(focals.options.aggregatable).to.exist;
    expect(focals.options.default).to.be.undefined;
  });

  it('should have instructions field', () => {
    const instructions = Event.path('instructions');

    expect(instructions).to.exist;
    expect(instructions).to.be.instanceof(SchemaTypes.String);
    expect(instructions.options).to.exist;
    expect(instructions.options).to.be.an('object');
    expect(instructions.options.type).to.exist;
    expect(instructions.options.trim).to.be.true;
    expect(instructions.options.index).to.be.true;
    expect(instructions.options.searchable).to.be.true;
    expect(instructions.options.exportable).to.be.true;
    expect(instructions.options.fake).to.exist;
  });

  it('should have interventions field', () => {
    const interventions = Event.path('interventions');

    expect(interventions).to.exist;
    expect(interventions).to.be.instanceof(SchemaTypes.String);
    expect(interventions.options).to.exist;
    expect(interventions.options).to.be.an('object');
    expect(interventions.options.type).to.exist;
    expect(interventions.options.trim).to.be.true;
    expect(interventions.options.index).to.be.true;
    expect(interventions.options.searchable).to.be.true;
    expect(interventions.options.exportable).to.be.true;
    expect(interventions.options.fake).to.exist;
  });

  it('should have impacts field', () => {
    const impacts = Event.path('impacts');

    expect(impacts).to.exist;
    expect(impacts).to.be.instanceof(SchemaTypes.String);
    expect(impacts.options).to.exist;
    expect(impacts.options).to.be.an('object');
    expect(impacts.options.type).to.exist;
    expect(impacts.options.trim).to.be.true;
    expect(impacts.options.index).to.be.true;
    expect(impacts.options.searchable).to.be.true;
    expect(impacts.options.exportable).to.be.true;
    expect(impacts.options.fake).to.exist;
  });

  it('should have remarks field', () => {
    const remarks = Event.path('remarks');

    expect(remarks).to.exist;
    expect(remarks).to.be.instanceof(SchemaTypes.String);
    expect(remarks.options).to.exist;
    expect(remarks.options).to.be.an('object');
    expect(remarks.options.type).to.exist;
    expect(remarks.options.trim).to.be.true;
    expect(remarks.options.index).to.be.true;
    expect(remarks.options.searchable).to.be.true;
    expect(remarks.options.exportable).to.be.true;
    expect(remarks.options.fake).to.exist;
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
