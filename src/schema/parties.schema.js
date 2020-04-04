import { get } from 'lodash';
import { join } from '@lykmapipo/common';
import { ObjectId } from '@lykmapipo/mongoose-common';
import { Contact } from '@lykmapipo/postman';
import { Predefine } from '@lykmapipo/predefine';
import { Party } from '@codetanzania/emis-stakeholder';

import { PREDEFINE_OPTION_AUTOPOPULATE, deduplicate } from '../internals';

/**
 * @name reporter
 * @description A party i.e civilian, customer etc which the event.
 *
 * @memberof Event
 *
 * @type {object}
 * @property {object} type - schema(data) type
 * @property {boolean} index - ensure database index
 * @property {boolean} taggable - allow field use for tagging
 * @property {boolean} exportable - allow field use for exporting
 * @property {boolean} default - default value set when none provided
 * @property {object} fake - fake data generator options
 *
 * @author lally elias <lallyelias87@gmail.com>
 * @since 0.1.0
 * @version 0.1.0
 * @instance
 * @example
 * {
 *   name: "Jane Doe",
 *   mobile: "+255715463739",
 *   email: "jane.doe@example.com",
 * }
 */
export const reporter = Contact; // TODO: index, test

/**
 * @name initiator
 * @alias changer
 * @description A party(i.e company, organization, individual etc) who
 * initiated(or record) an event changelog(or changes).
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
 *   _id: "5bcda2c073dd0700048fb846",
 *   name: "Jane Doe",
 *   mobile: "+255715463739",
 *   email: "jane.doe@example.com",
 * }
 */
export const initiator = {
  type: ObjectId,
  ref: Party.MODEL_NAME,
  // required: true,
  index: true,
  exists: true,
  autopopulate: Party.OPTION_AUTOPOPULATE,
  taggable: true,
  exportable: {
    format: (v) => get(v, 'name'),
    default: 'NA',
  },
  aggregatable: { unwind: true },
  default: undefined,
};

/**
 * @name verifier
 * @alias approver
 * @description A party(i.e company, organization, individual etc) who
 * verify(or approve) an event changelog(or changes).
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
 *   _id: "5bcda2c073dd0700048fb846",
 *   name: "Jane Doe",
 *   mobile: "+255715463739",
 *   email: "jane.doe@example.com",
 * }
 */
export const verifier = {
  type: ObjectId,
  ref: Party.MODEL_NAME,
  // required: true,
  index: true,
  exists: true,
  autopopulate: Party.OPTION_AUTOPOPULATE,
  taggable: true,
  exportable: {
    format: (v) => get(v, 'name'),
    default: 'NA',
  },
  aggregatable: { unwind: true },
  default: undefined,
};

/**
 * @name groups
 * @description Set of party groups(e.g Scouts, Religious Institutions etc)
 * who are responding to an event.
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
 * [{
 *   _id: '5dde6ca23631a92c2d616253',
 *   strings: { name: { en: 'Scouts' } },
 * }]
 */
export const groups = {
  type: [ObjectId],
  ref: Predefine.MODEL_NAME,
  // required: true,
  index: true,
  exists: true,
  duplicate: deduplicate,
  autopopulate: PREDEFINE_OPTION_AUTOPOPULATE,
  taggable: true,
  exportable: {
    format: (v) => join(v, ', ', 'strings.name.en'),
    default: 'NA',
  },
  aggregatable: { unwind: true },
  default: undefined,
};

/**
 * @name roles
 * @description Set of party roles(e.g Ward Executive Officer etc) who are
 * responding to an event.
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
 * [{
 *   _id: '5dde6ca23631a92c2d616253',
 *   strings: { name: { en: 'Ward Executive Officer' } },
 * }]
 */
export const roles = {
  type: [ObjectId],
  ref: Predefine.MODEL_NAME,
  // required: true,
  index: true,
  exists: true,
  duplicate: deduplicate,
  autopopulate: PREDEFINE_OPTION_AUTOPOPULATE,
  taggable: true,
  exportable: {
    format: (v) => join(v, ', ', 'strings.name.en'),
    default: 'NA',
  },
  aggregatable: { unwind: true },
  default: undefined,
};

/**
 * @name agencies
 * @alias organizations
 * @description Set of agencies(or organizations) who are responding to
 * an event.
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
 * [{
 *   _id: "5bcda2c073dd0700048fb846",
 *   name: "Police Force",
 *   mobile: "+255715463739",
 *   email: "police.force@example.com",
 * }]
 */
export const agencies = {
  type: [ObjectId],
  ref: Party.MODEL_NAME,
  // required: true,
  index: true,
  exists: true,
  duplicate: deduplicate,
  autopopulate: Party.OPTION_AUTOPOPULATE,
  taggable: true,
  exportable: {
    format: (v) => join(v, ', ', 'name'),
    default: 'NA',
  },
  aggregatable: { unwind: true },
  default: undefined,
};

/**
 * @name focals
 * @alias responder
 * @description Set of people(or individuals) who are responding to an event.
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
 * [{
 *   _id: "5bcda2c073dd0700048fb846",
 *   name: "Jane Doe",
 *   mobile: "+255715463739",
 *   email: "jane.doe@example.com",
 * }]
 */
export const focals = {
  type: [ObjectId],
  ref: Party.MODEL_NAME,
  // required: true,
  index: true,
  exists: true,
  duplicate: deduplicate,
  autopopulate: Party.OPTION_AUTOPOPULATE,
  taggable: true,
  exportable: {
    format: (v) => join(v, ', ', 'name'),
    default: 'NA',
  },
  aggregatable: { unwind: true },
  default: undefined,
};
