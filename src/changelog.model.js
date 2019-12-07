import { mergeObjects } from '@lykmapipo/common';
import { createSchema, model } from '@lykmapipo/mongoose-common';
import actions from 'mongoose-rest-actions';
import exportable from '@lykmapipo/mongoose-exportable';

import { CHANGELOG_MODEL_NAME, CHANGELOG_SCHEMA_OPTIONS } from './internals';

// schemas
import { group, type } from './schema/base.schema';
import { event, comment } from './schema/changelog.base.schema';
import { image, audio, video, document } from './schema/files.schema';

const SCHEMA = mergeObjects(
  { group, type },
  { event },
  { comment },
  { image, audio, video, document }
);

/**
 * @module ChangeLog
 * @namespace ChangeLog
 * @name ChangeLog
 * @description A record(log) of a changes on an event.
 *
 * It may be need assessment, loss assessment, general notification,
 * action taken, private comment(internal note) or public comment etc.
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
 * ChangeLog.create(event, (error, created) => { ... });
 *
 */
const ChangeLogSchema = createSchema(
  SCHEMA,
  CHANGELOG_SCHEMA_OPTIONS,
  actions,
  exportable
);

/* export event model */
export default model(CHANGELOG_MODEL_NAME, ChangeLogSchema);
