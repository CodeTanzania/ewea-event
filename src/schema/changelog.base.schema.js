import { get } from 'lodash';
import { ObjectId } from '@lykmapipo/mongoose-common';

import {
  EVENT_MODEL_NAME,
  EVENT_OPTION_AUTOPOPULATE,
  CHANGELOG_USE_CHANGE,
  CHANGELOG_USES,
} from '../internals';

/**
 * @name event
 * @description Event underwhich a changelog belongs to.
 *
 * @memberof ChangeLog
 *
 * @type {object}
 * @property {object} type - schema(data) type
 * @property {boolean} required - mark required
 * @property {boolean} index - ensure database index
 * @property {boolean} exists - ensure ref exists before save
 * @property {object} autopopulate - auto populate(eager loading) options
 * @property {boolean} taggable - allow field use for tagging
 * @property {boolean} exportable - allow field use for exporting
 * @property {boolean} aggregatable - allow field use for aggregation
 * @property {boolean} default - default value set when none provided
 * @property {object} fake - fake data generator options
 *
 * @author lally elias <lallyelias87@gmail.com>
 * @since 0.1.0
 * @version 0.1.0
 * @instance
 * @example
 * {
 *   _id: '5d535a0a62b47901d3294ff8',
 *   type: { strings: { name: { en: 'Flood' }, code: 'FL' } },
 * }
 */
export const event = {
  type: ObjectId,
  ref: EVENT_MODEL_NAME,
  // required: true,
  index: true,
  exists: true,
  autopopulate: EVENT_OPTION_AUTOPOPULATE,
  taggable: true,
  exportable: {
    format: v => get(v, 'type.strings.name.en'),
    default: 'NA',
  },
  aggregatable: { unwind: true },
  default: undefined,
};

/**
 * @name stage
 * @description System readable use of changelog.
 *
 * @type {object}
 * @property {object} type - schema(data) type
 * @property {boolean} trim - force trimming
 * @property {string[]} enum - collection of allowed values
 * @property {boolean} index - ensure database index
 * @property {boolean} searchable - allow for searching
 * @property {boolean} taggable - allow field use for tagging
 * @property {boolean} exportable - allow field use for exporting
 * @property {boolean} default - default value set when none provided
 * @property {object} fake - fake data generator options
 *
 * @since 0.1.0
 * @version 0.1.0
 * @instance
 * @example
 * change
 */
export const use = {
  type: String,
  trim: true,
  enum: CHANGELOG_USES,
  index: true,
  searchable: true,
  taggable: true,
  exportable: true,
  default: CHANGELOG_USE_CHANGE,
  fake: true,
};

/**
 * @name comment
 * @description Additional note for the changes.
 *
 * It may be an internal note telling how far the event has been responded on
 * or a feedback.
 *
 * @type {object}
 * @since 0.1.0
 * @version 0.1.0
 * @instance
 */
export const comment = {
  type: String,
  index: true,
  trim: true,
  searchable: true,
};
