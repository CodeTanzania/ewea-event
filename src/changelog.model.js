import { getString } from '@lykmapipo/env';
import { createSchema, model } from '@lykmapipo/mongoose-common';
import actions from 'mongoose-rest-actions';
import exportable from '@lykmapipo/mongoose-exportable';

// constants
const MODEL_NAME = getString('CHANGELOG_MODEL_NAME', 'EventChangeLog');
const COLLECTION_NAME = getString(
  'CHANGELOG_COLLECTION_NAME',
  'eventchangelogs'
);
const SCHEMA_OPTIONS = { collection: COLLECTION_NAME };

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
const ChangeLogSchema = createSchema({}, SCHEMA_OPTIONS, actions, exportable);

/* export event model */
export default model(MODEL_NAME, ChangeLogSchema);
