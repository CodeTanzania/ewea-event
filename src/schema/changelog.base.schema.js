import { MODEL_NAME_EVENT } from '@codetanzania/ewea-internals';
import { get } from 'lodash';
import moment from 'moment';
import { compact } from '@lykmapipo/common';
import { ObjectId } from '@lykmapipo/mongoose-common';

import {
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
  ref: MODEL_NAME_EVENT,
  // required: true,
  index: true,
  exists: true,
  autopopulate: EVENT_OPTION_AUTOPOPULATE,
  taggable: true,
  exportable: {
    format: v => get(v, 'type.strings.name.en'),
    default: 'NA',
  },
  aggregatable: {
    unwind: true,
  },
  default: undefined,
};

/**
 * @name stage
 * @description System readable use of changelog.
 *
 * @memberof ChangeLog
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
 * @name keyword
 * @description Human readable, unique identifier used to reply
 * on event changelog.
 *
 * It consist of; the year of the event; and a six-digit, sequential
 * reply number e.g 2001-000033.
 *
 * @type {object}
 * @property {object} type - schema(data) type
 * @property {boolean} trim - force trimming
 * @property {boolean} uppercase - force value to uppercase
 * @property {boolean} required - mark required
 * @property {boolean} index - ensure database index
 * @property {boolean} unique - ensure unique database index
 * @property {boolean} searchable - allow searching
 * @property {boolean} taggable - allow field use for tagging
 * @property {boolean} exportable - allow field use for exporting
 * @property {object} fake - fake data generator options
 *
 * @author lally elias <lallyelias87@gmail.com>
 * @since 0.1.0
 * @version 0.1.0
 * @instance
 * @example
 * 2018-000033
 */
export const keyword = {
  type: String,
  trim: true,
  uppercase: true,
  required: true,
  index: true,
  // unique: true,
  searchable: true,
  taggable: true,
  exportable: true,
  sequenceable: {
    prefix: function prefix() {
      const year = moment(new Date()).format('YYYY');
      return compact([year]).join('');
    },
    suffix: '',
    length: 6,
    pad: '0',
    separator: '-',
  },
  fake: {
    generator: 'random',
    type: 'uuid',
  },
};

/**
 * @name comment
 * @description A brief human readable additional note for the
 * event changelog(or changes).
 *
 * It may be an internal note telling how far the event has been responded on
 * or a feedback.
 *
 * @memberof ChangeLog
 *
 * @type {object}
 * @property {object} type - schema(data) type
 * @property {boolean} trim - force trimming
 * @property {boolean} index - ensure database index
 * @property {boolean} searchable - allow for searching
 * @property {boolean} exportable - allow field use for exporting
 * @property {object} fake - fake data generator options
 *
 * @author lally elias <lallyelias87@gmail.com>
 * @since 0.1.0
 * @version 0.1.0
 * @instance
 * @example
 * Requested relief items should be provided to the victims immediately
 */
export const comment = {
  type: String,
  trim: true,
  index: true,
  searchable: true,
  exportable: true,
  fake: {
    generator: 'lorem',
    type: 'sentence',
  },
};

/**
 * @name value
 * @description Amount of need, effects, situation
 * or characteristics of an event.
 *
 * @memberof ChangeLog
 *
 * @type {object}
 * @property {object} type - schema(data) type
 * @property {boolean} min - set minimum value allowed
 * @property {boolean} required - mark required
 * @property {boolean} index - ensure database index
 * @property {boolean} exportable - allow field use for exporting
 * @property {object} fake - fake data generator options
 *
 * @author lally elias <lallyelias87@gmail.com>
 * @since 0.1.0
 * @version 0.1.0
 * @instance
 * @example
 * 99
 */
export const value = {
  type: Number,
  min: 0,
  // required: true,
  index: true,
  exportable: true,
  fake: {
    generator: 'random',
    type: 'number',
  },
};
