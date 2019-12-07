import { mergeObjects } from '@lykmapipo/common';
import { createSchema, model } from '@lykmapipo/mongoose-common';
import actions from 'mongoose-rest-actions';
import exportable from '@lykmapipo/mongoose-exportable';

import {
  CHANGELOG_MODEL_NAME,
  CHANGELOG_COLLECTION_NAME,
  CHANGELOG_SCHEMA_OPTIONS,
  CHANGELOG_USE_CHANGE,
  CHANGELOG_USE_NOTIFICATION,
  CHANGELOG_USE_NEED,
  CHANGELOG_USE_EFFECT,
  CHANGELOG_USE_ASSESSMENT,
  CHANGELOG_USE_ACTION,
  CHANGELOG_USES,
} from './internals';

// schemas
import { group, type, fanction, action } from './schema/base.schema';
import { event, use, comment } from './schema/changelog.base.schema';
import { image, audio, video, document } from './schema/files.schema';

const SCHEMA = mergeObjects(
  { use },
  { group, type },
  { event },
  { function: fanction, action },
  { comment },
  { image, audio, video, document }
);

// TODO: all criteria use $in operator

/**
 * @module ChangeLog
 * @namespace ChangeLog
 * @name ChangeLog
 * @description A record(log) of a changes on an event.
 *
 * It may be need assessment, loss assessment, general notification,
 * action taken, general comments etc.
 *
 * @author lally elias <lallyelias87@gmail.com>
 * @license MIT
 * @since 0.1.0
 * @version 0.1.0
 * @public
 * @example
 *
 * const { ChangeLog } = require('@codetanzania/ewea-event');
 *
 * ChangeLog.create(changelog, (error, created) => { ... });
 *
 */
const ChangeLogSchema = createSchema(
  SCHEMA,
  CHANGELOG_SCHEMA_OPTIONS,
  actions,
  exportable
);

/*
 *------------------------------------------------------------------------------
 * Statics
 *------------------------------------------------------------------------------
 */

/* static constants */
ChangeLogSchema.statics.MODEL_NAME = CHANGELOG_MODEL_NAME;
ChangeLogSchema.statics.COLLECTION_NAME = CHANGELOG_COLLECTION_NAME;

ChangeLogSchema.statics.USE_CHANGE = CHANGELOG_USE_CHANGE;
ChangeLogSchema.statics.USE_NOTIFICATION = CHANGELOG_USE_NOTIFICATION;
ChangeLogSchema.statics.USE_NEED = CHANGELOG_USE_NEED;
ChangeLogSchema.statics.USE_EFFECT = CHANGELOG_USE_EFFECT;
ChangeLogSchema.statics.USE_ASSESSMENT = CHANGELOG_USE_ASSESSMENT;
ChangeLogSchema.statics.USE_ACTION = CHANGELOG_USE_ACTION;
ChangeLogSchema.statics.USES = CHANGELOG_USES;

/* export changelog model */
export default model(CHANGELOG_MODEL_NAME, ChangeLogSchema);
