import { SchemaTypes } from '@lykmapipo/mongoose-common';
import { expect } from '@lykmapipo/mongoose-test-helpers';
import { Predefine } from '@lykmapipo/predefine';
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
});
