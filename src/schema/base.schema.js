import { get } from 'lodash';
import { ObjectId } from '@lykmapipo/mongoose-common';
import { Predefine } from '@lykmapipo/predefine';

import { PREDEFINE_OPTION_AUTOPOPULATE } from '../internals';

/**
 * @name group
 * @description Event group underwhich an event belongs to.
 *
 * @memberof Event
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
 *   _id: '5dde6ca23631a92c2d616253',
 *   strings: { name: { en: 'Meteorological' }, code: 'MAT' },
 * }
 */
export const group = {
  type: ObjectId,
  ref: Predefine.MODEL_NAME,
  // required: true,
  index: true,
  exists: true,
  autopopulate: PREDEFINE_OPTION_AUTOPOPULATE,
  taggable: true,
  exportable: {
    format: v => get(v, 'strings.name.en'),
    default: 'NA',
  },
  aggregatable: { unwind: true },
  default: undefined,
};

/**
 * @name type
 * @description Event type underwhich an event belongs to.
 *
 * @memberof Event
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
 *   _id: '5dde6ca33631a92c2d616298',
 *   strings: { name: { en: 'Flood' }, code: 'FL' },
 * }
 */
export const type = {
  type: ObjectId,
  ref: Predefine.MODEL_NAME,
  // required: true,
  index: true,
  exists: true,
  autopopulate: PREDEFINE_OPTION_AUTOPOPULATE,
  taggable: true,
  exportable: {
    format: v => get(v, 'strings.name.en'),
    default: 'NA',
  },
  aggregatable: { unwind: true },
  default: undefined,
};

/**
 * @name function
 * @alias fanction
 * @description Group event response activities(i.e actions)
 *
 * @memberof Event
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
 *   _id: '5dde6ca33631a92c2d616298',
 *   strings: { name: { en: 'Communication and Warning' } },
 * }
 */
export const fanction = {
  type: ObjectId,
  ref: Predefine.MODEL_NAME,
  // required: true,
  index: true,
  exists: true,
  autopopulate: PREDEFINE_OPTION_AUTOPOPULATE,
  taggable: true,
  exportable: {
    format: v => get(v, 'strings.name.en'),
    default: 'NA',
  },
  aggregatable: { unwind: true },
  default: undefined,
};

/**
 * @name action
 * @alias action
 * @description Define an event response activity.
 *
 * @memberof Event
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
 *   _id: '5dde6ca33631a92c2d616298',
 *   strings: { name: { en: 'Disseminating warning information' } },
 * }
 */
export const action = {
  type: ObjectId,
  ref: Predefine.MODEL_NAME,
  // required: true,
  index: true,
  exists: true,
  autopopulate: PREDEFINE_OPTION_AUTOPOPULATE,
  taggable: true,
  exportable: {
    format: v => get(v, 'strings.name.en'),
    default: 'NA',
  },
  aggregatable: { unwind: true },
  default: undefined,
};

/**
 * @name indicator
 * @alias indicator
 * @description Define measure used to assess need, effects, situation
 * and characteristics of an event.
 *
 * @memberof Event
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
 *   _id: '5dde6ca33631a92c2d616298',
 *   strings: { name: { en: 'Damages and Losses' } },
 * }
 */
export const indicator = {
  type: ObjectId,
  ref: Predefine.MODEL_NAME,
  // required: true,
  index: true,
  exists: true,
  autopopulate: PREDEFINE_OPTION_AUTOPOPULATE,
  taggable: true,
  exportable: {
    format: v => get(v, 'strings.name.en'),
    default: 'NA',
  },
  aggregatable: { unwind: true },
  default: undefined,
};

/**
 * @name need
 * @alias need
 * @description Define a question used to assess need of an event.
 *
 * @memberof Event
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
 *   _id: '5dde6ca33631a92c2d616298',
 *   strings: { name: { en: 'Food' } },
 * }
 */
export const need = {
  type: ObjectId,
  ref: Predefine.MODEL_NAME,
  // required: true,
  index: true,
  exists: true,
  autopopulate: PREDEFINE_OPTION_AUTOPOPULATE,
  taggable: true,
  exportable: {
    format: v => get(v, 'strings.name.en'),
    default: 'NA',
  },
  aggregatable: { unwind: true },
  default: undefined,
};

/**
 * @name effect
 * @alias effect
 * @description Define a question used to assess effects of an event.
 *
 * @memberof Event
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
 *   _id: '5dde6ca33631a92c2d616298',
 *   strings: { name: { en: 'Houses Damaged' } },
 * }
 */
export const effect = {
  type: ObjectId,
  ref: Predefine.MODEL_NAME,
  // required: true,
  index: true,
  exists: true,
  autopopulate: PREDEFINE_OPTION_AUTOPOPULATE,
  taggable: true,
  exportable: {
    format: v => get(v, 'strings.name.en'),
    default: 'NA',
  },
  aggregatable: { unwind: true },
  default: undefined,
};

/**
 * @name unit
 * @alias unit
 * @description Define unit of measure of an event need, effects, situation
 * or characteristics.
 *
 * @memberof Event
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
 *   _id: '5dde6ca33631a92c2d616298',
 *   strings: { name: { en: 'gallon' } },
 * }
 */
export const unit = {
  type: ObjectId,
  ref: Predefine.MODEL_NAME,
  // required: true,
  index: true,
  exists: true,
  autopopulate: PREDEFINE_OPTION_AUTOPOPULATE,
  taggable: true,
  exportable: {
    format: v => get(v, 'strings.name.en'),
    default: 'NA',
  },
  aggregatable: { unwind: true },
  default: undefined,
};
