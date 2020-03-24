import { SchemaTypes } from '@lykmapipo/mongoose-common';
import { expect } from '@lykmapipo/mongoose-test-helpers';
import { Predefine } from '@lykmapipo/predefine';
import { Party } from '@codetanzania/emis-stakeholder';
import Event from '../../src/event.model';
import ChangeLog from '../../src/changelog.model';

describe('ChangeLog Schema', () => {
  it('should have use field', () => {
    const use = ChangeLog.path('use');

    expect(use).to.exist;
    expect(use).to.be.instanceof(SchemaTypes.String);
    expect(use.options).to.exist;
    expect(use.options).to.be.an('object');
    expect(use.options.type).to.exist;
    expect(use.options.trim).to.be.true;
    expect(use.options.enum).to.be.eql(ChangeLog.USES);
    expect(use.options.index).to.be.true;
    expect(use.options.searchable).to.be.true;
    expect(use.options.taggable).to.be.true;
    expect(use.options.exportable).to.be.true;
    expect(use.options.default).to.be.equal(ChangeLog.USE_CHANGE);
    expect(use.options.fake).to.exist;
  });

  it('should have keyword field', () => {
    const keyword = ChangeLog.path('keyword');

    expect(keyword).to.exist;
    expect(keyword).to.be.instanceof(SchemaTypes.String);
    expect(keyword.options).to.exist;
    expect(keyword.options).to.be.an('object');
    expect(keyword.options.type).to.exist;
    expect(keyword.options.trim).to.be.true;
    expect(keyword.options.uppercase).to.be.true;
    expect(keyword.options.index).to.be.true;
    // expect(keyword.options.unique).to.be.true;
    // expect(keyword.options.required).to.be.true;
    expect(keyword.options.searchable).to.be.true;
    expect(keyword.options.taggable).to.be.true;
    expect(keyword.options.fake).to.exist;
  });

  it('should have initiator field', () => {
    const initiator = ChangeLog.path('initiator');

    expect(initiator).to.exist;
    expect(initiator).to.be.instanceof(SchemaTypes.ObjectId);
    expect(initiator.options).to.exist;
    expect(initiator.options).to.be.an('object');
    expect(initiator.options.type).to.exist;
    expect(initiator.options.ref).to.exist;
    expect(initiator.options.ref).to.be.equal(Party.MODEL_NAME);
    expect(initiator.options.index).to.be.true;
    // expect(initiator.options.required).to.be.true;
    expect(initiator.options.exists).to.be.true;
    expect(initiator.options.autopopulate).to.exist;
    expect(initiator.options.taggable).to.exist;
    expect(initiator.options.exportable).to.exist;
    // expect(initiator.options.aggregatable).to.exist;
    expect(initiator.options.default).to.be.undefined;
  });

  it('should have verifier field', () => {
    const verifier = ChangeLog.path('verifier');

    expect(verifier).to.exist;
    expect(verifier).to.be.instanceof(SchemaTypes.ObjectId);
    expect(verifier.options).to.exist;
    expect(verifier.options).to.be.an('object');
    expect(verifier.options.type).to.exist;
    expect(verifier.options.ref).to.exist;
    expect(verifier.options.ref).to.be.equal(Party.MODEL_NAME);
    expect(verifier.options.index).to.be.true;
    // expect(verifier.options.required).to.be.true;
    expect(verifier.options.exists).to.be.true;
    expect(verifier.options.autopopulate).to.exist;
    expect(verifier.options.taggable).to.exist;
    expect(verifier.options.exportable).to.exist;
    // expect(verifier.options.aggregatable).to.exist;
    expect(verifier.options.default).to.be.undefined;
  });

  it('should have group field', () => {
    const group = ChangeLog.path('group');

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
    const type = ChangeLog.path('type');

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
    const level = ChangeLog.path('level');

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
    const severity = ChangeLog.path('severity');

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
    const certainty = ChangeLog.path('certainty');

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
    const status = ChangeLog.path('status');

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
    const urgency = ChangeLog.path('urgency');

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
    const response = ChangeLog.path('response');

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

  it('should have event field', () => {
    const event = ChangeLog.path('event');

    expect(event).to.exist;
    expect(event).to.be.instanceof(SchemaTypes.ObjectId);
    expect(event.options).to.exist;
    expect(event.options).to.be.an('object');
    expect(event.options.type).to.exist;
    expect(event.options.ref).to.exist;
    expect(event.options.ref).to.be.equal(Event.MODEL_NAME);
    expect(event.options.index).to.be.true;
    // expect(event.options.required).to.be.true;
    expect(event.options.exists).to.be.true;
    expect(event.options.autopopulate).to.exist;
    expect(event.options.taggable).to.exist;
    expect(event.options.exportable).to.exist;
    // expect(event.options.aggregatable).to.exist;
    expect(event.options.default).to.be.undefined;
  });

  it('should have function field', () => {
    const fanction = ChangeLog.path('function');

    expect(fanction).to.exist;
    expect(fanction).to.be.instanceof(SchemaTypes.ObjectId);
    expect(fanction.options).to.exist;
    expect(fanction.options).to.be.an('object');
    expect(fanction.options.type).to.exist;
    expect(fanction.options.ref).to.exist;
    expect(fanction.options.ref).to.be.equal(Predefine.MODEL_NAME);
    expect(fanction.options.index).to.be.true;
    // expect(fanction.options.required).to.be.true;
    expect(fanction.options.exists).to.be.true;
    expect(fanction.options.autopopulate).to.exist;
    expect(fanction.options.taggable).to.exist;
    expect(fanction.options.exportable).to.exist;
    // expect(fanction.options.aggregatable).to.exist;
    expect(fanction.options.default).to.be.undefined;
  });

  it('should have action field', () => {
    const action = ChangeLog.path('action');

    expect(action).to.exist;
    expect(action).to.be.instanceof(SchemaTypes.ObjectId);
    expect(action.options).to.exist;
    expect(action.options).to.be.an('object');
    expect(action.options.type).to.exist;
    expect(action.options.ref).to.exist;
    expect(action.options.ref).to.be.equal(Predefine.MODEL_NAME);
    expect(action.options.index).to.be.true;
    // expect(action.options.required).to.be.true;
    expect(action.options.exists).to.be.true;
    expect(action.options.autopopulate).to.exist;
    expect(action.options.taggable).to.exist;
    expect(action.options.exportable).to.exist;
    // expect(action.options.aggregatable).to.exist;
    expect(action.options.default).to.be.undefined;
  });

  it('should have catalogue field', () => {
    const catalogue = ChangeLog.path('catalogue');

    expect(catalogue).to.exist;
    expect(catalogue).to.be.instanceof(SchemaTypes.ObjectId);
    expect(catalogue.options).to.exist;
    expect(catalogue.options).to.be.an('object');
    expect(catalogue.options.type).to.exist;
    expect(catalogue.options.ref).to.exist;
    expect(catalogue.options.ref).to.be.equal(Predefine.MODEL_NAME);
    expect(catalogue.options.index).to.be.true;
    // expect(catalogue.options.required).to.be.true;
    expect(catalogue.options.exists).to.be.true;
    expect(catalogue.options.autopopulate).to.exist;
    expect(catalogue.options.taggable).to.exist;
    expect(catalogue.options.exportable).to.exist;
    // expect(catalogue.options.aggregatable).to.exist;
    expect(catalogue.options.default).to.be.undefined;
  });

  it('should have indicator field', () => {
    const indicator = ChangeLog.path('indicator');

    expect(indicator).to.exist;
    expect(indicator).to.be.instanceof(SchemaTypes.ObjectId);
    expect(indicator.options).to.exist;
    expect(indicator.options).to.be.an('object');
    expect(indicator.options.type).to.exist;
    expect(indicator.options.ref).to.exist;
    expect(indicator.options.ref).to.be.equal(Predefine.MODEL_NAME);
    expect(indicator.options.index).to.be.true;
    // expect(indicator.options.required).to.be.true;
    expect(indicator.options.exists).to.be.true;
    expect(indicator.options.autopopulate).to.exist;
    expect(indicator.options.taggable).to.exist;
    expect(indicator.options.exportable).to.exist;
    // expect(indicator.options.aggregatable).to.exist;
    expect(indicator.options.default).to.be.undefined;
  });

  it('should have topic field', () => {
    const topic = ChangeLog.path('topic');

    expect(topic).to.exist;
    expect(topic).to.be.instanceof(SchemaTypes.ObjectId);
    expect(topic.options).to.exist;
    expect(topic.options).to.be.an('object');
    expect(topic.options.type).to.exist;
    expect(topic.options.ref).to.exist;
    expect(topic.options.ref).to.be.equal(Predefine.MODEL_NAME);
    expect(topic.options.index).to.be.true;
    // expect(topic.options.required).to.be.true;
    expect(topic.options.exists).to.be.true;
    expect(topic.options.autopopulate).to.exist;
    expect(topic.options.taggable).to.exist;
    expect(topic.options.exportable).to.exist;
    // expect(topic.options.aggregatable).to.exist;
    expect(topic.options.default).to.be.undefined;
  });

  it('should have question field', () => {
    const question = ChangeLog.path('question');

    expect(question).to.exist;
    expect(question).to.be.instanceof(SchemaTypes.ObjectId);
    expect(question.options).to.exist;
    expect(question.options).to.be.an('object');
    expect(question.options.type).to.exist;
    expect(question.options.ref).to.exist;
    expect(question.options.ref).to.be.equal(Predefine.MODEL_NAME);
    expect(question.options.index).to.be.true;
    // expect(question.options.required).to.be.true;
    expect(question.options.exists).to.be.true;
    expect(question.options.autopopulate).to.exist;
    expect(question.options.taggable).to.exist;
    expect(question.options.exportable).to.exist;
    // expect(question.options.aggregatable).to.exist;
    expect(question.options.default).to.be.undefined;
  });

  it('should have need field', () => {
    const need = ChangeLog.path('need');

    expect(need).to.exist;
    expect(need).to.be.instanceof(SchemaTypes.ObjectId);
    expect(need.options).to.exist;
    expect(need.options).to.be.an('object');
    expect(need.options.type).to.exist;
    expect(need.options.ref).to.exist;
    expect(need.options.ref).to.be.equal(Predefine.MODEL_NAME);
    expect(need.options.index).to.be.true;
    // expect(need.options.required).to.be.true;
    expect(need.options.exists).to.be.true;
    expect(need.options.autopopulate).to.exist;
    expect(need.options.taggable).to.exist;
    expect(need.options.exportable).to.exist;
    // expect(need.options.aggregatable).to.exist;
    expect(need.options.default).to.be.undefined;
  });

  it('should have effect field', () => {
    const effect = ChangeLog.path('effect');

    expect(effect).to.exist;
    expect(effect).to.be.instanceof(SchemaTypes.ObjectId);
    expect(effect.options).to.exist;
    expect(effect.options).to.be.an('object');
    expect(effect.options.type).to.exist;
    expect(effect.options.ref).to.exist;
    expect(effect.options.ref).to.be.equal(Predefine.MODEL_NAME);
    expect(effect.options.index).to.be.true;
    // expect(effect.options.required).to.be.true;
    expect(effect.options.exists).to.be.true;
    expect(effect.options.autopopulate).to.exist;
    expect(effect.options.taggable).to.exist;
    expect(effect.options.exportable).to.exist;
    // expect(effect.options.aggregatable).to.exist;
    expect(effect.options.default).to.be.undefined;
  });

  it('should have value field', () => {
    const value = ChangeLog.path('value');

    expect(value).to.exist;
    expect(value).to.be.instanceof(SchemaTypes.Number);
    expect(value.options).to.exist;
    expect(value.options).to.be.an('object');
    expect(value.options.type).to.exist;
    expect(value.options.min).to.be.equal(0);
    // expect(value.options.required).to.be.true;
    expect(value.options.index).to.be.true;
    expect(value.options.exportable).to.be.true;
    expect(value.options.fake).to.exist;
  });

  it('should have unit field', () => {
    const unit = ChangeLog.path('unit');

    expect(unit).to.exist;
    expect(unit).to.be.instanceof(SchemaTypes.ObjectId);
    expect(unit.options).to.exist;
    expect(unit.options).to.be.an('object');
    expect(unit.options.type).to.exist;
    expect(unit.options.ref).to.exist;
    expect(unit.options.ref).to.be.equal(Predefine.MODEL_NAME);
    expect(unit.options.index).to.be.true;
    // expect(unit.options.required).to.be.true;
    expect(unit.options.exists).to.be.true;
    expect(unit.options.autopopulate).to.exist;
    expect(unit.options.taggable).to.exist;
    expect(unit.options.exportable).to.exist;
    // expect(unit.options.aggregatable).to.exist;
    expect(unit.options.default).to.be.undefined;
  });

  it('should have areas field', () => {
    const areas = ChangeLog.path('areas');

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

  it('should have groups field', () => {
    const groups = ChangeLog.path('groups');

    expect(groups).to.exist;
    expect(groups).to.be.instanceof(SchemaTypes.Array);
    expect(groups.options).to.exist;
    expect(groups.options).to.be.an('object');
    expect(groups.options.type).to.exist;
    expect(groups.options.ref).to.exist;
    expect(groups.options.ref).to.be.equal(Predefine.MODEL_NAME);
    // expect(groups.options.required).to.be.true;
    expect(groups.options.exists).to.be.true;
    expect(groups.options.autopopulate).to.exist;
    expect(groups.options.taggable).to.exist;
    expect(groups.options.exportable).to.exist;
    // expect(groups.options.aggregatable).to.exist;
    expect(groups.options.default).to.be.undefined;
  });

  it('should have roles field', () => {
    const roles = ChangeLog.path('roles');

    expect(roles).to.exist;
    expect(roles).to.be.instanceof(SchemaTypes.Array);
    expect(roles.options).to.exist;
    expect(roles.options).to.be.an('object');
    expect(roles.options.type).to.exist;
    expect(roles.options.ref).to.exist;
    expect(roles.options.ref).to.be.equal(Predefine.MODEL_NAME);
    // expect(roles.options.required).to.be.true;
    expect(roles.options.exists).to.be.true;
    expect(roles.options.autopopulate).to.exist;
    expect(roles.options.taggable).to.exist;
    expect(roles.options.exportable).to.exist;
    // expect(roles.options.aggregatable).to.exist;
    expect(roles.options.default).to.be.undefined;
  });

  it('should have agencies field', () => {
    const agencies = ChangeLog.path('agencies');

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
    const focals = ChangeLog.path('focals');

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

  it('should have image file field', () => {
    const image = ChangeLog.path('image');

    expect(image).to.exist;
    expect(image).to.be.an.instanceof(SchemaTypes.ObjectId);
    expect(image.options).to.exist;
    expect(image.options.ref).to.be.equal('Image');
    expect(image.options.autopopulate).to.be.exist;
  });

  it('should have audio file field', () => {
    const audio = ChangeLog.path('audio');

    expect(audio).to.exist;
    expect(audio).to.be.an.instanceof(SchemaTypes.ObjectId);
    expect(audio.options).to.exist;
    expect(audio.options.ref).to.be.equal('Audio');
    expect(audio.options.autopopulate).to.be.exist;
  });

  it('should have video file field', () => {
    const video = ChangeLog.path('video');

    expect(video).to.exist;
    expect(video).to.be.an.instanceof(SchemaTypes.ObjectId);
    expect(video.options).to.exist;
    expect(video.options.ref).to.be.equal('Video');
    expect(video.options.autopopulate).to.be.exist;
  });

  it('should have document file field', () => {
    const document = ChangeLog.path('document');

    expect(document).to.exist;
    expect(document).to.be.an.instanceof(SchemaTypes.ObjectId);
    expect(document.options).to.exist;
    expect(document.options.ref).to.be.equal('Document');
    expect(document.options.autopopulate).to.be.exist;
  });

  it('should have location field', () => {
    const location = ChangeLog.path('location');

    expect(location).to.exist;
    expect(location).to.be.an.instanceof(SchemaTypes.Embedded);
    expect(location.options.index).to.exist.and.be.equal('2dsphere');
    expect(location.options.fake).to.exist.and.be.a('function');
  });

  it('should have address field', () => {
    const address = ChangeLog.path('address');

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

  it('should have comment field', () => {
    const comment = ChangeLog.path('comment');

    expect(comment).to.exist;
    expect(comment).to.be.instanceof(SchemaTypes.String);
    expect(comment.options).to.exist;
    expect(comment.options).to.be.an('object');
    expect(comment.options.type).to.exist;
    expect(comment.options.trim).to.be.true;
    expect(comment.options.index).to.be.true;
    expect(comment.options.searchable).to.be.true;
    expect(comment.options.exportable).to.be.true;
    expect(comment.options.fake).to.exist;
  });
});
