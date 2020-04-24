'use strict';

const eweaInternals = require('@codetanzania/ewea-internals');
const common = require('@lykmapipo/common');
const env = require('@lykmapipo/env');
const mongooseCommon = require('@lykmapipo/mongoose-common');
const expressCommon = require('@lykmapipo/express-common');
const expressRestActions = require('@lykmapipo/express-rest-actions');
const file = require('@lykmapipo/file');
const async = require('async');
const lodash = require('lodash');
require('@lykmapipo/mongoose-sequenceable');
const actions = require('mongoose-rest-actions');
const exportable = require('@lykmapipo/mongoose-exportable');
const predefine = require('@lykmapipo/predefine');
const postman = require('@lykmapipo/postman');
const mongooseGeojsonSchemas = require('mongoose-geojson-schemas');
const emisStakeholder = require('@codetanzania/emis-stakeholder');
const moment = require('moment');

// common constants
const DEFAULT_COUNTRY_CODE = env.getString('DEFAULT_COUNTRY_CODE', 'TZ');
const COUNTRY_CODE = env.getString('COUNTRY_CODE', DEFAULT_COUNTRY_CODE);

// event schema
const EVENT_SCHEMA_OPTIONS = { collection: eweaInternals.COLLECTION_NAME_EVENT };

// event options
const EVENT_OPTION_SELECT = { group: 1, type: 1, number: 1 };
const EVENT_OPTION_AUTOPOPULATE = {
  select: EVENT_OPTION_SELECT,
  maxDepth: eweaInternals.POPULATION_MAX_DEPTH,
};

// event stages
const EVENT_STAGE_ALERT = 'Alert';
const EVENT_STAGE_EVENT = 'Event';
const EVENT_STAGES = [EVENT_STAGE_ALERT, EVENT_STAGE_EVENT];

// changelog schema
const CHANGELOG_SCHEMA_OPTIONS = {
  collection: eweaInternals.COLLECTION_NAME_EVENTCHANGELOG,
};

// changelog use
const CHANGELOG_USE_CHANGE = 'change';
const CHANGELOG_USE_NOTIFICATION = 'notification';
const CHANGELOG_USE_NEED = 'need';
const CHANGELOG_USE_EFFECT = 'effect';
const CHANGELOG_USE_ASSESSMENT = 'assessment';
const CHANGELOG_USE_ACTION = 'action';
const CHANGELOG_USE_EXPOSURE = 'exposure';
const CHANGELOG_USES = [
  CHANGELOG_USE_CHANGE,
  CHANGELOG_USE_NOTIFICATION,
  CHANGELOG_USE_NEED,
  CHANGELOG_USE_EFFECT,
  CHANGELOG_USE_ASSESSMENT,
  CHANGELOG_USE_ACTION,
  CHANGELOG_USE_EXPOSURE,
];

// relation options
const PREDEFINE_OPTION_SELECT = {
  'strings.name': 1,
  'strings.color': 1,
  'strings.code': 1,
};
const PREDEFINE_OPTION_AUTOPOPULATE = {
  select: PREDEFINE_OPTION_SELECT,
  maxDepth: eweaInternals.POPULATION_MAX_DEPTH,
};

const EVENT_UPDATE_ARRAY_FIELDS = ['areas', 'agencies', 'focals'];

const EVENT_UPDATE_IGNORED_FIELDS = [
  '_id',
  'id',
  'event',
  'keyword',
  'number',
  // 'location', ignore for changelog
  // 'address', ignore for changelog
  'createdAt',
  'use',
];

const EVENT_CHANGELOG_RELATED_FIELDS = [
  'group',
  'type',
  'level',
  'severity',
  'certainty',
  'status',
  'urgency',
];

const EVENT_RELATION_PREDEFINE_FIELDS = {
  // group: undefined, // TODO: default group(Unknown)
  type: undefined, // TODO: default type(Unknown)
  level: { 'strings.name.en': 'White', namespace: 'EventLevel' },
  severity: { 'strings.name.en': 'Unknown', namespace: 'EventSeverity' },
  certainty: { 'strings.name.en': 'Unknown', namespace: 'EventCertainty' },
  status: { 'strings.name.en': 'Actual', namespace: 'EventStatus' },
  urgency: { 'strings.name.en': 'Unknown', namespace: 'EventUrgency' },
  response: { 'strings.name.en': 'None', namespace: 'EventResponse' },
};

// TODO: refactor to areSameObjectId(vali8&common)
const deduplicate = (a, b) => {
  // grab actual ids
  const idOfA = common.idOf(a) || a;
  const idOfB = common.idOf(b) || b;

  // convert to string
  const idA = mongooseCommon.isObjectId(idOfA) ? idOfA.toString() : idOfA;
  const idB = mongooseCommon.isObjectId(idOfB) ? idOfB.toString() : idOfB;

  // check if are equal
  return idA === idB;
};

const ENABLE_SYNC_TRANSPORT = env.getBoolean('ENABLE_SYNC_TRANSPORT', false);

const SMTP_FROM_NAME = env.getString('SMTP_FROM_NAME', 'EWEA Notification');

const NOTIFICATION_CHANNELS = env.getStringSet('NOTIFICATION_CHANNELS', [
  postman.CHANNEL_EMAIL,
]);

// TODO use localized templates
// TODO per changelog field message template
/* templates */
const TEMPLATES_EVENT_NOTIFICATION_FOOTER = '\n\nRegards,\n{sender}';
const TEMPLATES_EVENT_NOTIFICATION_TITLE =
  '{level} Advisory: {type} {stage} - No. {number}';
const TEMPLATES_EVENT_NOTIFICATION_MESSAGE =
  'Causes: {causes} \n\nDescription: {description} \n\nInstructions: {instructions} \n\nAreas: {areas} \n\nPlaces: {places}';
const TEMPLATES_EVENT_STATUS_UPDATE_TITLE =
  'Status Update: {type} {stage} - No. {number}';
const TEMPLATES_EVENT_STATUS_UPDATE_MESSAGE =
  'Causes: {causes} \n\nDescription: {description} \n\nInstructions: {instructions} \n\nAreas: {areas} \n\nPlaces: {places} \n\nUpdates: {updates}';

// TODO
// sendMessage
// sendActionNotification
// sendActionsNotification

const sendCampaign = (message, done) => {
  // prepare campaign
  const isCampaignInstance = message instanceof postman.Campaign;
  let campaign = isCampaignInstance ? message.toObject() : message;

  // ensure campaign channels
  campaign.channels = common.uniq(
    [].concat(NOTIFICATION_CHANNELS).concat(message.channels)
  );

  // instantiate campaign
  campaign = new postman.Campaign(message);

  // queue campaign in production
  // or if is asynchronous send
  if (env.isProduction() && !ENABLE_SYNC_TRANSPORT) {
    campaign.queue();
    done(null, campaign);
  }

  // direct send campaign in development & test
  else {
    campaign.send(done);
  }
};

// send create event notification
const sendEventNotification = (event, done) => {
  // prepare recipient criteria
  // TODO: handle agencies, focals
  let areaIds = lodash.map([].concat(event.areas), (area) => {
    return lodash.get(area, '_id');
  });
  areaIds = common.uniq(areaIds).concat(null);
  const criteria = { area: { $in: areaIds } };

  // prepare notification title/subject
  const subject = common.parseTemplate(TEMPLATES_EVENT_NOTIFICATION_TITLE, {
    level: lodash.get(event, 'level.strings.name.en'),
    type: lodash.get(event, 'type.strings.name.en'),
    stage: event.stage,
    number: event.number,
  });

  // prepare notification areas body
  let areaNames = lodash.map([].concat(event.areas), (area) => {
    return lodash.get(area, 'strings.name.en', 'N/A');
  });
  areaNames = common.uniq(areaNames);

  // prepare notification body
  const body = common.parseTemplate(TEMPLATES_EVENT_NOTIFICATION_MESSAGE, {
    causes: lodash.get(event, 'causes', 'N/A'),
    description: lodash.get(event, 'description', 'N/A'),
    instructions: lodash.get(event, 'instructions', 'N/A'),
    areas: areaNames.join(', '),
    places: lodash.get(event, 'places', 'N/A'),
  });

  // prepare notification footer
  const footer = common.parseTemplate(TEMPLATES_EVENT_NOTIFICATION_FOOTER, {
    sender: SMTP_FROM_NAME,
  });

  // prepare notification message
  const message = body + footer;

  // send campaign
  sendCampaign({ criteria, subject, message }, done);
};

// send event changes/changelogs notifications
const sendEventUpdates = (event, changelog, done) => {
  // prepare recipient criteria
  // TODO: handle agencies, focals
  let areaIds = lodash.map([].concat(event.areas), (area) => {
    return lodash.get(area, '_id');
  });
  areaIds = common.uniq(areaIds).concat(null);
  const criteria = { area: { $in: areaIds } };

  // prepare notification title/subject
  const subject = common.parseTemplate(TEMPLATES_EVENT_STATUS_UPDATE_TITLE, {
    type: lodash.get(event, 'type.strings.name.en'),
    stage: event.stage,
    number: event.number,
  });

  // prepare notification areas body
  let areaNames = lodash.map([].concat(event.areas), (area) => {
    return lodash.get(area, 'strings.name.en', 'N/A');
  });
  areaNames = common.uniq(areaNames);

  // prepare updates
  // TODO: compute updates from other changelog attributes i.e
  // agencies, focals, areas, effect, need, impacts etc
  const updates = changelog.comment || 'N/A';

  // prepare notification body
  const body = common.parseTemplate(TEMPLATES_EVENT_STATUS_UPDATE_MESSAGE, {
    causes: lodash.get(event, 'causes', 'N/A'),
    description: lodash.get(event, 'description', 'N/A'),
    instructions: lodash.get(event, 'instructions', 'N/A'),
    areas: areaNames.join(', '),
    places: lodash.get(event, 'places', 'N/A'),
    updates,
  });

  // prepare notification footer
  const footer = common.parseTemplate(TEMPLATES_EVENT_NOTIFICATION_FOOTER, {
    sender: SMTP_FROM_NAME,
  });

  // prepare notification message
  const message = body + footer;

  // send campaign
  sendCampaign({ criteria, subject, message }, done);
};

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
const group = {
  type: mongooseCommon.ObjectId,
  ref: predefine.Predefine.MODEL_NAME,
  // required: true,
  index: true,
  exists: true,
  autopopulate: PREDEFINE_OPTION_AUTOPOPULATE,
  taggable: true,
  exportable: {
    format: (v) => lodash.get(v, 'strings.name.en'),
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
const type = {
  type: mongooseCommon.ObjectId,
  ref: predefine.Predefine.MODEL_NAME,
  // required: true,
  index: true,
  exists: true,
  autopopulate: PREDEFINE_OPTION_AUTOPOPULATE,
  taggable: true,
  exportable: {
    format: (v) => lodash.get(v, 'strings.name.en'),
    default: 'NA',
  },
  aggregatable: { unwind: true },
  default: undefined,
};

/**
 * @name level
 * @description Event awareness level underwhich an event belongs to.
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
 * @since 0.5.0
 * @version 0.1.0
 * @instance
 * @example
 * {
 *   _id: '5dde6ca33631a92c2d616298',
 *   strings: { name: { en: 'Orange' } },
 * }
 */
const level = {
  type: mongooseCommon.ObjectId,
  ref: predefine.Predefine.MODEL_NAME,
  // required: true,
  index: true,
  exists: true,
  autopopulate: PREDEFINE_OPTION_AUTOPOPULATE,
  taggable: true,
  exportable: {
    format: (v) => lodash.get(v, 'strings.name.en'),
    default: 'NA',
  },
  aggregatable: { unwind: true },
  default: undefined,
};

/**
 * @name severity
 * @description Currently assigned severity of an event.
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
 *   _id: '5dde6ca23631a92c2d616250',
 *   strings: { name: { en: 'Extreme' } },
 * }
 */
const severity = {
  type: mongooseCommon.ObjectId,
  ref: predefine.Predefine.MODEL_NAME,
  // required: true,
  index: true,
  exists: true,
  autopopulate: PREDEFINE_OPTION_AUTOPOPULATE,
  taggable: true,
  exportable: {
    format: (v) => lodash.get(v, 'strings.name.en'),
    default: 'NA',
  },
  aggregatable: { unwind: true },
  default: undefined,
};

/**
 * @name certainty
 * @description Currently assigned certainty of an event.
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
 *   _id: '5dde6ca33631a92c2d616284',
 *   strings: { name: { en: 'Possible' } },
 * }
 */
const certainty = {
  type: mongooseCommon.ObjectId,
  ref: predefine.Predefine.MODEL_NAME,
  // required: true,
  index: true,
  exists: true,
  autopopulate: PREDEFINE_OPTION_AUTOPOPULATE,
  taggable: true,
  exportable: {
    format: (v) => lodash.get(v, 'strings.name.en'),
    default: 'NA',
  },
  aggregatable: { unwind: true },
  default: undefined,
};

/**
 * @name status
 * @description Currently assigned status of an event.
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
 *   _id: '5dde6ca33631a92c2d616284',
 *   strings: { name: { en: 'Actual' } },
 * }
 */
const status = {
  type: mongooseCommon.ObjectId,
  ref: predefine.Predefine.MODEL_NAME,
  // required: true,
  index: true,
  exists: true,
  autopopulate: PREDEFINE_OPTION_AUTOPOPULATE,
  taggable: true,
  exportable: {
    format: (v) => lodash.get(v, 'strings.name.en'),
    default: 'NA',
  },
  aggregatable: { unwind: true },
  default: undefined,
};

/**
 * @name urgency
 * @description Currently assigned urgency of an event.
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
 *   _id: '5dde6ca33631a92c2d616284',
 *   strings: { name: { en: 'Immediate' } },
 * }
 */
const urgency = {
  type: mongooseCommon.ObjectId,
  ref: predefine.Predefine.MODEL_NAME,
  // required: true,
  index: true,
  exists: true,
  autopopulate: PREDEFINE_OPTION_AUTOPOPULATE,
  taggable: true,
  exportable: {
    format: (v) => lodash.get(v, 'strings.name.en'),
    default: 'NA',
  },
  aggregatable: { unwind: true },
  default: undefined,
};

/**
 * @name response
 * @description Currently assigned response of an event.
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
 *   _id: '5dde6ca33631a92c2d616284',
 *   strings: { name: { en: 'Evacuate' } },
 * }
 */
const response = {
  type: mongooseCommon.ObjectId,
  ref: predefine.Predefine.MODEL_NAME,
  // required: true,
  index: true,
  exists: true,
  autopopulate: PREDEFINE_OPTION_AUTOPOPULATE,
  taggable: true,
  exportable: {
    format: (v) => lodash.get(v, 'strings.name.en'),
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
const fanction = {
  type: mongooseCommon.ObjectId,
  ref: predefine.Predefine.MODEL_NAME,
  // required: true,
  index: true,
  exists: true,
  autopopulate: PREDEFINE_OPTION_AUTOPOPULATE,
  taggable: true,
  exportable: {
    format: (v) => lodash.get(v, 'strings.name.en'),
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
const action = {
  type: mongooseCommon.ObjectId,
  ref: predefine.Predefine.MODEL_NAME,
  // required: true,
  index: true,
  exists: true,
  autopopulate: PREDEFINE_OPTION_AUTOPOPULATE,
  taggable: true,
  exportable: {
    format: (v) => lodash.get(v, 'strings.name.en'),
    default: 'NA',
  },
  aggregatable: { unwind: true },
  default: undefined,
};

/**
 * @name catalogue
 * @alias catalogue
 * @description Define an event response activity catalogue.
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
const catalogue = {
  type: mongooseCommon.ObjectId,
  ref: predefine.Predefine.MODEL_NAME,
  // required: true,
  index: true,
  exists: true,
  autopopulate: PREDEFINE_OPTION_AUTOPOPULATE,
  taggable: true,
  exportable: {
    format: (v) => lodash.get(v, 'strings.name.en'),
    default: 'NA',
  },
  aggregatable: { unwind: true },
  default: undefined,
};

/**
 * @name indicator
 * @alias indicator
 * @description Define indicator used to assess need, effects, situation
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
const indicator = {
  type: mongooseCommon.ObjectId,
  ref: predefine.Predefine.MODEL_NAME,
  // required: true,
  index: true,
  exists: true,
  autopopulate: PREDEFINE_OPTION_AUTOPOPULATE,
  taggable: true,
  exportable: {
    format: (v) => lodash.get(v, 'strings.name.en'),
    default: 'NA',
  },
  aggregatable: { unwind: true },
  default: undefined,
};

/**
 * @name topic
 * @alias topic
 * @description Define topic used to assess need, effects, situation
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
 *   strings: { name: { en: 'Water' } },
 * }
 */
const topic = {
  type: mongooseCommon.ObjectId,
  ref: predefine.Predefine.MODEL_NAME,
  // required: true,
  index: true,
  exists: true,
  autopopulate: PREDEFINE_OPTION_AUTOPOPULATE,
  taggable: true,
  exportable: {
    format: (v) => lodash.get(v, 'strings.name.en'),
    default: 'NA',
  },
  aggregatable: { unwind: true },
  default: undefined,
};

/**
 * @name question
 * @alias question
 * @description Define a question used to assess need and effects of an event.
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
const question = {
  type: mongooseCommon.ObjectId,
  ref: predefine.Predefine.MODEL_NAME,
  // required: true,
  index: true,
  exists: true,
  autopopulate: PREDEFINE_OPTION_AUTOPOPULATE,
  taggable: true,
  exportable: {
    format: (v) => lodash.get(v, 'strings.name.en'),
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
const need = {
  type: mongooseCommon.ObjectId,
  ref: predefine.Predefine.MODEL_NAME,
  // required: true,
  index: true,
  exists: true,
  autopopulate: PREDEFINE_OPTION_AUTOPOPULATE,
  taggable: true,
  exportable: {
    format: (v) => lodash.get(v, 'strings.name.en'),
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
const effect = {
  type: mongooseCommon.ObjectId,
  ref: predefine.Predefine.MODEL_NAME,
  // required: true,
  index: true,
  exists: true,
  autopopulate: PREDEFINE_OPTION_AUTOPOPULATE,
  taggable: true,
  exportable: {
    format: (v) => lodash.get(v, 'strings.name.en'),
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
const unit = {
  type: mongooseCommon.ObjectId,
  ref: predefine.Predefine.MODEL_NAME,
  // required: true,
  index: true,
  exists: true,
  autopopulate: PREDEFINE_OPTION_AUTOPOPULATE,
  taggable: true,
  exportable: {
    format: (v) => lodash.get(v, 'strings.name.en'),
    default: 'NA',
  },
  aggregatable: { unwind: true },
  default: undefined,
};

/**
 * @name areas
 * @description Affected administrative area(s) of an event(or changelog).
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
 * [
 * {
 *   _id: '5de2f17cec283f52aa3cacf7',
 *   strings: { name: { en: 'Ilala' } },
 *   geos: { geometry: { ... } },
 * },
 * {
 *   _id: '5de2f2ec7d0c71547d456b10',
 *   strings: { name: { en: 'Temeke' } },
 *   geos: { geometry: { ... } },
 * },
 * ]
 */
const areas = {
  type: [mongooseCommon.ObjectId],
  ref: predefine.Predefine.MODEL_NAME,
  // required: true,
  index: true,
  exists: true,
  duplicate: deduplicate,
  autopopulate: PREDEFINE_OPTION_AUTOPOPULATE,
  taggable: true,
  exportable: {
    format: (v) => common.join(v, ', ', 'strings.name.en'),
    default: 'NA',
  },
  aggregatable: { unwind: true },
  default: undefined,
};

/**
 * @name location
 * @description A geo-point specifying longitude and latitude pair
 * of the address of an event(or changelog).
 *
 * @type {object}
 * @property {object} type - schema(data) type
 * @property {boolean} index - ensure database index
 * @property {object} fake - fake data generator options
 *
 * @author lally elias <lallyelias87@gmail.com>
 * @since 0.1.0
 * @version 0.1.0
 * @instance
 * @example
 * {
 *   type: 'Point',
 *   coordinates: [39.2155451, -6.7269984],
 * }
 */
const location = mongooseGeojsonSchemas.Point;

/**
 * @name address
 * @description A human readable description of location of an
 * event(or changelog).
 *
 * @property {object} type - schema(data) type
 * @property {boolean} trim - force trimming
 * @property {boolean} index - ensure database index
 * @property {boolean} searchable - allow for searching
 * @property {boolean} taggable - allow field use for tagging
 * @property {boolean} exportable - allow field use for exporting
 * @property {object} fake - fake data generator options
 *
 * @author lally elias <lallyelias87@gmail.com>
 * @since 0.1.0
 * @version 0.1.0
 * @instance
 * @example
 * Tandale
 */
const address = {
  type: String,
  trim: true,
  index: true,
  searchable: true,
  taggable: true,
  exportable: true,
  fake: {
    generator: 'address',
    type: 'county',
  },
};

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
const reporter = postman.Contact; // TODO: index, test

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
const initiator = {
  type: mongooseCommon.ObjectId,
  ref: emisStakeholder.Party.MODEL_NAME,
  // required: true,
  index: true,
  exists: true,
  autopopulate: emisStakeholder.Party.OPTION_AUTOPOPULATE,
  taggable: true,
  exportable: {
    format: (v) => lodash.get(v, 'name'),
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
const verifier = {
  type: mongooseCommon.ObjectId,
  ref: emisStakeholder.Party.MODEL_NAME,
  // required: true,
  index: true,
  exists: true,
  autopopulate: emisStakeholder.Party.OPTION_AUTOPOPULATE,
  taggable: true,
  exportable: {
    format: (v) => lodash.get(v, 'name'),
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
const groups = {
  type: [mongooseCommon.ObjectId],
  ref: predefine.Predefine.MODEL_NAME,
  // required: true,
  index: true,
  exists: true,
  duplicate: deduplicate,
  autopopulate: PREDEFINE_OPTION_AUTOPOPULATE,
  taggable: true,
  exportable: {
    format: (v) => common.join(v, ', ', 'strings.name.en'),
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
const roles = {
  type: [mongooseCommon.ObjectId],
  ref: predefine.Predefine.MODEL_NAME,
  // required: true,
  index: true,
  exists: true,
  duplicate: deduplicate,
  autopopulate: PREDEFINE_OPTION_AUTOPOPULATE,
  taggable: true,
  exportable: {
    format: (v) => common.join(v, ', ', 'strings.name.en'),
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
const agencies = {
  type: [mongooseCommon.ObjectId],
  ref: emisStakeholder.Party.MODEL_NAME,
  // required: true,
  index: true,
  exists: true,
  duplicate: deduplicate,
  autopopulate: emisStakeholder.Party.OPTION_AUTOPOPULATE,
  taggable: true,
  exportable: {
    format: (v) => common.join(v, ', ', 'name'),
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
const focals = {
  type: [mongooseCommon.ObjectId],
  ref: emisStakeholder.Party.MODEL_NAME,
  // required: true,
  index: true,
  exists: true,
  duplicate: deduplicate,
  autopopulate: emisStakeholder.Party.OPTION_AUTOPOPULATE,
  taggable: true,
  exportable: {
    format: (v) => common.join(v, ', ', 'name'),
    default: 'NA',
  },
  aggregatable: { unwind: true },
  default: undefined,
};

/**
 * @name stage
 * @description Human readable evolving step of an event.
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
 * Alert
 */
const stage = {
  type: String,
  trim: true,
  enum: EVENT_STAGES,
  index: true,
  searchable: true,
  taggable: true,
  exportable: true,
  default: EVENT_STAGE_ALERT,
  fake: true,
};

/**
 * @name number
 * @description Human readable, unique identifier of an event.
 *
 * It consist of two letters to identify the event(or disaster) type
 * (e.g. FL - flood); the year of the event; a six-digit, sequential
 * event number; and the three-letter ISO code for country of occurrence
 * e.g FL-2001-000033-TZA.
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
 * FL-2018-000033-TZA
 */
const number = {
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
      const eventTypeCode = lodash.get(this, 'type.string.code', '');
      const year = moment(new Date()).format('YYYY');
      return common.compact([eventTypeCode, year]).join('-');
    },
    suffix: COUNTRY_CODE,
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
 * @name causes
 * @description A brief human readable summary about cause(s) of an event.
 *
 * @type {object}
 * @property {object} type - schema(data) type
 * @property {boolean} trim - force trimming
 * @property {boolean} required - mark required
 * @property {boolean} index - ensure database index
 * @property {boolean} searchable - allow for searching
 * @property {boolean} taggable - allow field use for tagging
 * @property {boolean} exportable - allow field use for exporting
 * @property {object} fake - fake data generator options
 *
 * @author lally elias <lallyelias87@gmail.com>
 * @since 0.1.0
 * @version 0.1.0
 * @instance
 * @example
 * Heavy rainfall
 */
const causes = {
  type: String,
  trim: true,
  // required: true,
  index: true,
  searchable: true,
  taggable: true,
  exportable: true,
  fake: {
    generator: 'lorem',
    type: 'sentence',
  },
};

/**
 * @name description
 * @description A brief summary about an event i.e additional details
 * that clarify more about an event.
 *
 * @type {object}
 * @property {object} type - schema(data) type
 * @property {boolean} trim - force trimming
 * @property {boolean} required - mark required
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
 * Overflowing water from the dam.
 */
const description = {
  type: String,
  trim: true,
  // required: true,
  index: true,
  searchable: true,
  exportable: true,
  fake: {
    generator: 'lorem',
    type: 'sentence',
  },
};

/**
 * @name places
 * @description Human readable text describing the affected area(s)
 * of an event.
 *
 * @type {object}
 * @property {object} type - schema(data) type
 * @property {boolean} trim - force trimming
 * @property {boolean} required - mark required
 * @property {boolean} index - ensure database index
 * @property {boolean} searchable - allow searching
 * @property {boolean} taggable - allow field use for tagging
 * @property {boolean} exportable - allow field use for exporting
 * @property {object} fake - fake data generator options
 *
 * @since 0.1.0
 * @version 0.1.0
 * @instance
 * @example
 * Ilala, Temeke, Dar es Salaam
 */
const places = {
  type: String,
  trim: true,
  // required: true,
  index: true,
  searchable: true,
  taggable: true,
  exportable: true,
  fake: {
    generator: 'address',
    type: 'county',
  },
};

/**
 * @name instructions
 * @description A brief human readable, caution(s) to be taken by
 * responders on an event.
 *
 * @type {object}
 * @property {object} type - schema(data) type
 * @property {boolean} trim - force trimming
 * @property {boolean} index - ensure database index
 * @property {boolean} searchable - allow searching
 * @property {boolean} exportable - allow field use for exporting
 * @property {object} fake - fake data generator options
 *
 * @since 0.1.0
 * @version 0.1.0
 * @instance
 * @example
 * Continue monitor the situation
 */
const instructions = {
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
 * @name interventions
 * @description A brief human readable interventions and directives
 * of an event.
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
 * Affected victims were evacuated and relocated
 */
const interventions = {
  type: [String],
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
 * @name impacts
 * @description A brief human readable effect(s) an event.
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
 * 55 people affected, 72 houses destroyed and 9 schools damaged
 */
const impacts = {
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
 * @name constraints
 * @description A brief human readable gaps and constraints
 * about an event.
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
 * Rehabilitation and reconstruction resources
 */
const constraints = {
  type: [String],
  trim: true,
  index: true,
  searchable: true,
  exportable: true,
  fake: {
    generator: 'lorem',
    type: 'sentences',
  },
};

/**
 * @name remarks
 * @description A brief human readable comments and recommendations
 * about an event.
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
const remarks = {
  type: [String],
  trim: true,
  index: true,
  searchable: true,
  exportable: true,
  fake: {
    generator: 'lorem',
    type: 'sentences',
  },
};

/**
 * @name startedAt
 * @description Date when an event was effective occured(or reported).
 *
 * @type {object}
 * @property {object} type - schema(data) type
 * @property {boolean} index - ensure database index
 * @property {object} fake - fake data generator options
 *
 * @author lally elias <lallyelias87@gmail.com>
 * @since 0.1.0
 * @version 0.1.0
 * @instance
 * @example
 * 2018-10-17T07:53:32.831Z
 */
const startedAt = {
  type: Date,
  index: true,
  exportable: true,
  // before: 'endedAt',
  fake: {
    generator: 'date',
    type: 'past',
  },
};

/**
 * @name endedAt
 * @description Date when an event was declared no longer a threat.
 *
 * @type {object}
 * @property {object} type - schema(data) type
 * @property {boolean} index - ensure database index
 * @property {object} fake - fake data generator options
 *
 * @author lally elias <lallyelias87@gmail.com>
 * @since 0.1.0
 * @version 0.1.0
 * @instance
 * @example
 * 2018-10-19T07:53:32.831Z
 */
const endedAt = {
  type: Date,
  index: true,
  exportable: true,
  // after: 'reportedAt',
  fake: {
    generator: 'date',
    type: 'recent',
  },
};

// TODO: calculate expose(risk) after create
// TODO: send actions after create
// TODO: ensure all fields in changelog schema?
// TODO: ensure administrative hierarchy
// TODO: ensure sources(name, email, link)
// TODO: provide impact summary

const SCHEMA = common.mergeObjects(
  { group, type, level, severity, certainty, status, urgency, response },
  { stage, number },
  { location, address },
  { causes, description, places },
  { areas },
  { reporter, agencies, focals },
  {
    instructions,
    interventions,
    impacts,
    constraints,
    remarks,
    startedAt,
    endedAt,
  }
);

/**
 * @module Event
 * @namespace Event
 * @name Event
 * @description A representation of an entity which define and track an
 * instance(or occurrence) of an emergency(or disaster) event.
 *
 * @see {@link https://en.wikipedia.org/wiki/Disaster}
 *
 * @author lally elias <lallyelias87@gmail.com>
 * @license MIT
 * @since 0.1.0
 * @version 0.1.0
 * @public
 * @example
 * const { Event } = require('@codetanzania/ewea-event');
 * Event.create(event, (error, created) => { ... });
 */
const EventSchema = mongooseCommon.createSchema(
  SCHEMA,
  EVENT_SCHEMA_OPTIONS,
  actions,
  exportable
);

/*
 *------------------------------------------------------------------------------
 *  Hooks
 *------------------------------------------------------------------------------
 */

/**
 * @name validate
 * @function validate
 * @description event schema pre validation hook
 * @param {Function} done callback to invoke on success or error
 * @returns {object|Error} valid instance or error
 *
 * @author lally elias <lallyelias87@gmail.com>
 * @since 0.1.0
 * @version 0.1.0
 * @private
 */
EventSchema.pre('validate', function onPreValidate(done) {
  return this.preValidate(done);
});

/*
 *------------------------------------------------------------------------------
 *  Instance
 *------------------------------------------------------------------------------
 */

/**
 * @name preValidate
 * @function preValidate
 * @description event schema pre validation hook logic
 * @param {Function} done callback to invoke on success or error
 * @returns {object|Error} valid instance or error
 *
 * @author lally elias <lallyelias87@gmail.com>
 * @since 0.1.0
 * @version 0.1.0
 * @instance
 */
EventSchema.methods.preValidate = function preValidate(done) {
  // ensure started(or reported) date
  this.startedAt = this.startedAt || new Date();

  // ensure group from type
  if (this.type) {
    this.group = lodash.get(this, 'type.relations.group', this.group);
  }

  return done(null, this);
};

/*
 *------------------------------------------------------------------------------
 * Statics
 *------------------------------------------------------------------------------
 */

/* static constants */
EventSchema.statics.MODEL_NAME = eweaInternals.MODEL_NAME_EVENT;
EventSchema.statics.COLLECTION_NAME = eweaInternals.COLLECTION_NAME_EVENT;
EventSchema.statics.OPTION_SELECT = EVENT_OPTION_SELECT;
EventSchema.statics.OPTION_AUTOPOPULATE = EVENT_OPTION_AUTOPOPULATE;

EventSchema.statics.STAGE_ALERT = EVENT_STAGE_ALERT;
EventSchema.statics.STAGE_EVENT = EVENT_STAGE_EVENT;
EventSchema.statics.STAGES = EVENT_STAGES;

/**
 * @name prepareSeedCriteria
 * @function prepareSeedCriteria
 * @description define seed data criteria
 * @param {object} seed event to be seeded
 * @returns {object} packed criteria for seeding
 *
 * @author lally elias <lallyelias87@gmail.com>
 * @since 0.2.0
 * @version 0.1.0
 * @static
 */
EventSchema.statics.prepareSeedCriteria = (seed) => {
  const copyOfSeed = mongooseCommon.copyInstance(seed);

  const criteria = common.idOf(copyOfSeed)
    ? lodash.pick(copyOfSeed, '_id')
    : lodash.pick(copyOfSeed, 'group', 'type', 'number');

  return criteria;
};

/**
 * @name preloadRelations
 * @function preloadRelations
 * @description Preload given event relations
 * @param {object} event valid event instance or object
 * @param {Function} done callback to invoke on success or error
 * @returns {object|Error} pre-loaded relations or error
 * @author lally elias <lallyelias87@gmail.com>
 * @since 0.6.0
 * @version 0.1.0
 * @static
 * @example
 *
 * const event = { _id: '...', group: '...', type: '...' };
 * Event.preloadRelations(event, (error, updated) => { ... });
 */
EventSchema.statics.preloadRelations = (event, done) => {
  // prepare relations to preload
  const relations = {};

  // prepare predefines loader
  lodash.forEach(EVENT_RELATION_PREDEFINE_FIELDS, (criteria, relation) => {
    const related = lodash.get(event, relation);
    const relatedId = common.idOf(related) || related;
    // event has relation
    if (relatedId) {
      relations[relation] = (next) =>
        predefine.Predefine.getById({ _id: relatedId }, next);
    }
    // use default criteria
    else if (criteria) {
      relations[relation] = (next) => predefine.Predefine.findOne(criteria, next);
    }
    // continue
    else {
      relations[relation] = (next) => next(null, null);
    }
  });

  // execute loader
  return async.parallel(relations, done);
};

/**
 * @name postWithChanges
 * @function postWithChanges
 * @description Update existing Event with the given changes
 * @param {object} event valid event object to save
 * @param {Function} done callback to invoke on success or error
 * @returns {object|Error} created event or error
 *
 * @author lally elias <lallyelias87@gmail.com>
 * @since 0.6.0
 * @version 0.1.0
 * @static
 * @example
 *
 * const event = { type: '...', description: '...' };
 * Event.postWithChanges(event, (error, created) => { ... });
 *
 */
EventSchema.statics.postWithChanges = (event, done) => {
  // ref
  const Event = mongooseCommon.model(eweaInternals.MODEL_NAME_EVENT);

  // preload event relations
  const preloadRelated = (next) => Event.preloadRelations(event, next);

  // save event
  const saveEvent = (relations, next) => {
    const eventi = common.mergeObjects(event, relations);
    return Event.post(eventi, next);
  };

  // send event notification
  const sendNotification = (eventi, next) => {
    // TODO: check AUTO_EVENT_NOTIFICATION_ENABLED=true
    return sendEventNotification(eventi, (error /* , campaign */) => {
      return next(error, eventi);
    });
  };

  // TODO: ensure level, severity, certainty, status, urgency, response
  // TODO: save initial changelog(reported)

  // save event
  const tasks = [preloadRelated, saveEvent, sendNotification];
  return async.waterfall(tasks, done);
};

/**
 * @name updateWith
 * @function updateWith
 * @description Update existing Event with the given criteria and changes
 * @param {object} criteria valid event query criteria
 * @param {object} changes valid event changes to apply
 * @param {Function} done callback to invoke on success or error
 * @returns {object|Error} updated event or error
 *
 * @author lally elias <lallyelias87@gmail.com>
 * @since 0.6.0
 * @version 0.1.0
 * @static
 * @example
 *
 * const criteria = { _id: '...' };
 * const changes = { remarks: '...' };
 * Event.updateWith(criteria, changes, (error, updated) => { ... });
 *
 */
EventSchema.statics.updateWith = (criteria, changes, done) => {
  // ref
  const Event = mongooseCommon.model(eweaInternals.MODEL_NAME_EVENT);

  // find existing event by given criteria
  const findEvent = (next) => {
    return Event.findOne(criteria).orFail().exec(next);
  };

  // apply changes to found event
  const applyChanges = (event, next) => {
    // compute updates with ignores
    const updates = { updatedAt: new Date() };
    const allowedChanges = lodash.omit(changes, ...EVENT_UPDATE_IGNORED_FIELDS);
    lodash.forEach(allowedChanges, (value, key) => {
      const isArrayField = lodash.includes(EVENT_UPDATE_ARRAY_FIELDS, key);
      // update array fields
      if (isArrayField) {
        const existValue = lodash.get(event, key);
        updates[key] = lodash.union(existValue, [].concat(value));
      }
      // update simple fields
      else {
        updates[key] = value;
      }
    });

    // persist event changes
    event.set(updates);
    return event.save(next);
  };

  // notify event updates
  const sendUpdates = (event, next) => {
    return sendEventUpdates(event, changes, (error /* , campaign */) => {
      return next(error, event);
    });
  };

  // update event
  const tasks = [findEvent, applyChanges, sendUpdates];
  return async.waterfall(tasks, done);
};

/**
 * @name updateWithChanges
 * @function updateWithChanges
 * @description Update existing Event with the given changes
 * @param {object} changes valid event changes to apply
 * @param {Function} done callback to invoke on success or error
 * @returns {object|Error} updated event or error
 *
 * @author lally elias <lallyelias87@gmail.com>
 * @since 0.6.0
 * @version 0.1.0
 * @static
 * @example
 *
 * const changes = { _id: '...', remarks: '...' };
 * Event.updateWithChanges(criteria, changes, (error, updated) => { ... });
 *
 */
EventSchema.statics.updateWithChanges = (changes, done) => {
  // ref
  const Event = mongooseCommon.model(eweaInternals.MODEL_NAME_EVENT);
  const EventChangeLog = mongooseCommon.model(eweaInternals.MODEL_NAME_EVENTCHANGELOG);

  // obtain event id
  const eventId = common.idOf(changes) || changes.id;

  // post changelog
  const postChangeLog = (next) => {
    let changed = lodash.omit(changes, EVENT_UPDATE_IGNORED_FIELDS);
    // TODO ensure event fields(description, instructions etc) in changelog
    const comment =
      changes.causes ||
      changes.impacts ||
      changes.interventions ||
      changes.remarks ||
      changes.places ||
      changes.instructions ||
      changes.description;
    changed = common.mergeObjects(changed, { event: eventId, comment });

    // TODO use EventChangeLog.postWithChanges once
    // all event fields are also in changelog
    return EventChangeLog.post(changed, next);
  };

  // update event with changes
  const updateEvent = (changelog, next) => {
    const criteria = { _id: eventId };
    return Event.updateWith(criteria, changes, next);
  };

  // update event with changes
  const tasks = [postChangeLog, updateEvent];
  return async.waterfall(tasks, done);
};

/**
 * @name updateWithChangeLog
 * @function updateWithChangeLog
 * @description Update existing event with the given changelog instance
 * @param {object} changelog valid event changelog to apply
 * @param {Function} done callback to invoke on success or error
 * @returns {object|Error} updated event or error
 *
 * @author lally elias <lallyelias87@gmail.com>
 * @since 0.6.0
 * @version 0.1.0
 * @static
 * @example
 *
 * const changes = { _id: '...', comment: '...' };
 * Event.updateWithChangeLog(criteria, changes, (error, updated) => { ... });
 *
 */
EventSchema.statics.updateWithChangeLog = (changelog, done) => {
  // ref
  const Event = mongooseCommon.model(eweaInternals.MODEL_NAME_EVENT);

  // return if changelog has no event
  if (!changelog.event) {
    return done(null, changelog);
  }

  // convert changelog to object
  const changes = changelog.toObject();

  // ensure event criteria
  const criteria = { _id: common.idOf(changes.event) || changes.event };

  // update event with changelog
  return Event.updateWith(criteria, changes, done);
};

/* export event model */
const Event = mongooseCommon.model(eweaInternals.MODEL_NAME_EVENT, EventSchema);

/**
 * @name ensureInitiator
 * @description Set changelog initiator on request body
 * @author lally elias <lallyelias87@gmail.com>
 *
 * @param {object} request valid http request
 * @param {object} response valid http response
 * @param {Function} next next middlware to invoke
 * @returns {Function} next middlware to invoke
 *
 * @license MIT
 * @since 0.1.0
 * @version 1.0.0
 * @public
 */
const ensureInitiator = (request, response, next) => {
  if (request.body && request.party) {
    request.body.initiator = request.body.initiator || request.party;
  }
  return next();
};

/**
 * @name ensureReporter
 * @description Set event reporter on request body
 *
 * @param {object} request valid http request
 * @param {object} response valid http response
 * @param {Function} next next middlware to invoke
 * @returns {Function} next middlware to invoke
 *
 * @author lally elias <lallyelias87@gmail.com>
 * @license MIT
 * @since 0.1.0
 * @version 1.0.0
 * @public
 */
const ensureReporter = (request, response, next) => {
  if (request.body && request.party) {
    request.body.reporter = request.body.reporter || request.party.asContact();
  }
  return next();
};

/* constants */
const API_VERSION = env.getString('API_VERSION', '1.0.0');
const PATH_SINGLE = '/events/:id';
const PATH_LIST = '/events';
const PATH_EXPORT = '/events/export';
const PATH_SCHEMA = '/events/schema/';

/**
 * @name EventHttpRouter
 * @namespace EventHttpRouter
 *
 * @description A representation of an entity which define and track an
 * instance(or occurrence) of an emergency(or disaster) event.
 *
 * @see {@link https://en.wikipedia.org/wiki/Disaster}
 *
 * @author lally elias <lallyelias87@gmail.com>
 * @license MIT
 * @since 0.1.0
 * @version 1.0.0
 * @public
 */
const router = new expressRestActions.Router({
  version: API_VERSION,
});

/**
 * @name GetEvents
 * @memberof EventHttpRouter
 * @description Returns a list of events
 */
router.get(
  PATH_LIST,
  expressRestActions.getFor({
    get: (options, done) => Event.get(options, done),
  })
);

/**
 * @name GetEventSchema
 * @memberof EventHttpRouter
 * @description Returns event json schema definition
 */
router.get(
  PATH_SCHEMA,
  expressRestActions.schemaFor({
    getSchema: (query, done) => {
      const jsonSchema = Event.jsonSchema();
      return done(null, jsonSchema);
    },
  })
);

/**
 * @name ExportEvents
 * @memberof EventHttpRouter
 * @description Export events as csv
 */
router.get(
  PATH_EXPORT,
  expressRestActions.downloadFor({
    download: (options, done) => {
      const fileName = `events_exports_${Date.now()}.csv`;
      const readStream = Event.exportCsv(options);
      return done(null, { fileName, readStream });
    },
  })
);

/**
 * @name PostEvent
 * @memberof EventHttpRouter
 * @description Create new event
 */
router.post(
  PATH_LIST,
  ensureReporter,
  expressRestActions.postFor({
    post: (body, done) => Event.postWithChanges(body, done),
  })
);

/**
 * @name GetEvent
 * @memberof EventHttpRouter
 * @description Get existing event
 */
router.get(
  PATH_SINGLE,
  expressRestActions.getByIdFor({
    getById: (options, done) => Event.getById(options, done),
  })
);

/**
 * @name PatchEvent
 * @memberof EventHttpRouter
 * @description Patch existing event
 */
router.patch(
  PATH_SINGLE,
  ensureInitiator,
  expressRestActions.patchFor({
    patch: (options, done) => Event.updateWithChanges(options, done),
  })
);

/**
 * @name PutEvent
 * @memberof EventHttpRouter
 * @description Put existing event
 */
router.put(
  PATH_SINGLE,
  ensureInitiator,
  expressRestActions.putFor({
    put: (options, done) => Event.updateWithChanges(options, done),
  })
);

/**
 * @name DeleteEvent
 * @memberof EventHttpRouter
 * @description Delete existing event
 */
router.delete(
  PATH_SINGLE,
  ensureInitiator,
  expressRestActions.deleteFor({
    del: (options, done) => Event.del(options, done),
    soft: true,
  })
);

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
const event = {
  type: mongooseCommon.ObjectId,
  ref: eweaInternals.MODEL_NAME_EVENT,
  // required: true,
  index: true,
  exists: true,
  autopopulate: EVENT_OPTION_AUTOPOPULATE,
  taggable: true,
  exportable: {
    format: (v) => lodash.get(v, 'type.strings.name.en'),
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
const use = {
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
 * It consist of; 4-digit year of the event; 2-digit month of the event;
 * and a four-digit, sequential reply number e.g 2001-000033.
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
const keyword = {
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
      const year = moment(new Date()).format('YYYYMM');
      return common.compact([year]).join('');
    },
    suffix: '',
    length: 4,
    pad: '0',
    separator: '',
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
const comment = {
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
const value = {
  // TODO: fetch associated unit from question before save
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

/**
 * @name image
 * @description Associated image for an event or changelog.
 *
 * @memberof Event
 * @memberof ChangeLog
 *
 * @type {object}
 *
 * @author lally elias <lallyelias87@gmail.com>
 * @since 0.1.0
 * @version 0.1.0
 * @instance
 */
const image = file.FileTypes.Image;

/**
 * @name audio
 * @description Associated audio for an event or changelog.
 *
 * @memberof Event
 * @memberof ChangeLog
 *
 * @type {object}
 *
 * @author lally elias <lallyelias87@gmail.com>
 * @since 0.1.0
 * @version 0.1.0
 * @instance
 */
const audio = file.FileTypes.Audio;

/**
 * @name video
 * @description Associated video for an event or changelog.
 *
 * @memberof Event
 * @memberof ChangeLog
 *
 * @type {object}
 *
 * @author lally elias <lallyelias87@gmail.com>
 * @since 0.1.0
 * @version 0.1.0
 * @instance
 */
const video = file.FileTypes.Video;

/**
 * @name document
 * @description Associated document for an event or changelog.
 *
 * @memberof Event
 * @memberof ChangeLog
 *
 * @type {object}
 *
 * @author lally elias <lallyelias87@gmail.com>
 * @since 0.1.0
 * @version 0.1.0
 * @instance
 */
const document = file.FileTypes.Document;

const SCHEMA$1 = common.mergeObjects(
  { use, keyword },
  { initiator, verifier },
  { group, type, level, severity, certainty, status, urgency, response },
  { event },
  { function: fanction, action, catalogue },
  { indicator, topic, question, need, effect, value, unit },
  { areas },
  { groups, roles, agencies, focals },
  { image, audio, video, document },
  { location, address },
  { comment }
);

// TODO: all criteria use $in operator
// TODO: update event after post, update, patch and delete
// TODO: send notification after save
// TODO: notify respective parties after save
// TODO: handle endedAt changelog to close event
// TODO: add all event fields to best track changes

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
 * const { ChangeLog } = require('@codetanzania/ewea-event');
 * ChangeLog.create(changelog, (error, created) => { ... });
 */
const ChangeLogSchema = mongooseCommon.createSchema(
  SCHEMA$1,
  CHANGELOG_SCHEMA_OPTIONS,
  actions,
  exportable
);

/*
 *------------------------------------------------------------------------------
 *  Hooks
 *------------------------------------------------------------------------------
 */

/**
 * @name validate
 * @function validate
 * @description event changelog schema pre validation hook
 * @param {Function} done callback to invoke on success or error
 * @returns {object|Error} valid instance or error
 *
 * @author lally elias <lallyelias87@gmail.com>
 * @since 0.1.0
 * @version 0.1.0
 * @private
 */
ChangeLogSchema.pre('validate', function onPreValidate(done) {
  return this.preValidate(done);
});

/*
 *------------------------------------------------------------------------------
 *  Instance
 *------------------------------------------------------------------------------
 */

/**
 * @name preValidate
 * @function preValidate
 * @description event changelog schema pre validation hook logic
 * @param {Function} done callback to invoke on success or error
 * @returns {object|Error} valid instance or error
 *
 * @author lally elias <lallyelias87@gmail.com>
 * @since 0.1.0
 * @version 0.1.0
 * @instance
 */
ChangeLogSchema.methods.preValidate = function preValidate(done) {
  // TODO: ensureRelated or ensureDefaults
  return done(null, this);
};

/**
 * @name updateEvent
 * @function updateEvent
 * @description Update existing event with the changes from this changelog
 * @param {Function} done callback to invoke on success or error
 * @returns {object|Error} valid changelog or error
 *
 * @author lally elias <lallyelias87@gmail.com>
 * @since 0.6.0
 * @version 0.1.0
 * @static
 * @example
 *
 * changelog.updateEvent((error, changelog) => { ... });
 *
 */
ChangeLogSchema.methods.updateEvent = function updateEvent(done) {
  // ref
  const Event = mongooseCommon.model(eweaInternals.MODEL_NAME_EVENT);

  // update event with changes
  const updateRelatedEvent = (next) => Event.updateWithChangeLog(this, next);

  // ensure changelog event fields
  const updateSelfRelated = (eventi, next) => {
    const old = lodash.pick(this, ...EVENT_CHANGELOG_RELATED_FIELDS);
    const now = lodash.pick(eventi, ...EVENT_CHANGELOG_RELATED_FIELDS);
    const updates = common.mergeObjects(now, old);

    // update changelog
    this.set(updates);
    return this.save(next);
  };

  // update event
  const tasks = [updateRelatedEvent, updateSelfRelated];
  return async.waterfall(tasks, done);
};

/*
 *------------------------------------------------------------------------------
 * Statics
 *------------------------------------------------------------------------------
 */

/* static constants */
ChangeLogSchema.statics.MODEL_NAME = eweaInternals.MODEL_NAME_EVENTCHANGELOG;
ChangeLogSchema.statics.COLLECTION_NAME = eweaInternals.COLLECTION_NAME_EVENTCHANGELOG;

ChangeLogSchema.statics.USE_CHANGE = CHANGELOG_USE_CHANGE;
ChangeLogSchema.statics.USE_NOTIFICATION = CHANGELOG_USE_NOTIFICATION;
ChangeLogSchema.statics.USE_NEED = CHANGELOG_USE_NEED;
ChangeLogSchema.statics.USE_EFFECT = CHANGELOG_USE_EFFECT;
ChangeLogSchema.statics.USE_ASSESSMENT = CHANGELOG_USE_ASSESSMENT;
ChangeLogSchema.statics.USE_ACTION = CHANGELOG_USE_ACTION;
ChangeLogSchema.statics.USES = CHANGELOG_USES;

/**
 * @name prepareSeedCriteria
 * @function prepareSeedCriteria
 * @description define seed data criteria
 * @param {object} seed event changelog to be seeded
 * @returns {object} packed criteria for seeding
 *
 * @author lally elias <lallyelias87@gmail.com>
 * @since 0.2.0
 * @version 0.1.0
 * @static
 */
ChangeLogSchema.statics.prepareSeedCriteria = (seed) => {
  const copyOfSeed = mongooseCommon.copyInstance(seed);
  const fields = [
    'use',
    'initiator',
    'verifier',
    'group',
    'type',
    'event',
    'function',
    'action',
    'need',
    'effect',
    'unit',
  ];

  const criteria = common.idOf(copyOfSeed)
    ? lodash.pick(copyOfSeed, '_id')
    : lodash.pick(copyOfSeed, ...fields);

  return criteria;
};

/**
 * @name postWithChanges
 * @function postWithChanges
 * @description Post changelog and update existing event with the given changes
 * @param {object} changes valid event changes to apply
 * @param {Function} done callback to invoke on success or error
 * @returns {object|Error} valid changelog or error
 *
 * @author lally elias <lallyelias87@gmail.com>
 * @since 0.6.0
 * @version 0.1.0
 * @static
 * @example
 *
 * const changes = { comment: '...' };
 * EventChangeLog.postWithChanges(changes, (error, changelog) => { ... });
 *
 */
ChangeLogSchema.statics.postWithChanges = (changes, done) => {
  // ref
  // const Event = model(MODEL_NAME_EVENT);
  const EventChangeLog = mongooseCommon.model(eweaInternals.MODEL_NAME_EVENTCHANGELOG);

  // save changes
  const saveChangeLog = (next) => EventChangeLog.post(changes, next);

  // update event with changes
  const updateEvent = (changelog, next) => changelog.updateEvent(next);

  // post changelog
  const tasks = [saveChangeLog, updateEvent];
  return async.waterfall(tasks, done);
};

/**
 * @name putWithChanges
 * @function putWithChanges
 * @description Put changelog and update existing event with
 * the given changes
 * @param {object} changes valid event changes to apply
 * @param {Function} done callback to invoke on success or error
 * @returns {object|Error} valid changelog or error
 *
 * @author lally elias <lallyelias87@gmail.com>
 * @since 0.6.0
 * @version 0.1.0
 * @static
 * @example
 *
 * const changes = { comment: '...' };
 * EventChangeLog.putWithChanges(changes, (error, changelog) => { ... });
 *
 */
ChangeLogSchema.statics.putWithChanges = (changes, done) => {
  // ref
  const EventChangeLog = mongooseCommon.model(eweaInternals.MODEL_NAME_EVENTCHANGELOG);

  // put existing changelog
  const putChangeLog = (next) => EventChangeLog.put(changes, next);

  // update event with changes
  const updateEvent = (changelog, next) => changelog.updateEvent(next);

  // put changelog
  const tasks = [putChangeLog, updateEvent];
  return async.waterfall(tasks, done);
};

/**
 * @name patchWithChanges
 * @function patchWithChanges
 * @description Patch changelog and update existing event with
 * the given changes
 * @param {object} changes valid event changes to apply
 * @param {Function} done callback to invoke on success or error
 * @returns {object|Error} valid changelog or error
 *
 * @author lally elias <lallyelias87@gmail.com>
 * @since 0.6.0
 * @version 0.1.0
 * @static
 * @example
 *
 * const changes = { comment: '...' };
 * EventChangeLog.patchWithChanges(changes, (error, changelog) => { ... });
 *
 */
ChangeLogSchema.statics.patchWithChanges = (changes, done) => {
  // ref
  const EventChangeLog = mongooseCommon.model(eweaInternals.MODEL_NAME_EVENTCHANGELOG);

  // patch existing changelog
  const patchChangeLog = (next) => EventChangeLog.patch(changes, next);

  // update event with changes
  const updateEvent = (changelog, next) => changelog.updateEvent(next);

  // patch changelog
  const tasks = [patchChangeLog, updateEvent];
  return async.waterfall(tasks, done);
};

/* export changelog model */
const EventChangeLog = mongooseCommon.model(eweaInternals.MODEL_NAME_EVENTCHANGELOG, ChangeLogSchema);

/* constants */
const API_VERSION$1 = env.getString('API_VERSION', '1.0.0');
const PATH_SINGLE$1 = '/changelogs/:id';
const PATH_LIST$1 = '/changelogs';
const PATH_EXPORT$1 = '/changelogs/export';
const PATH_SCHEMA$1 = '/changelogs/schema/';

/**
 * @name EventChangeLogHttpRouter
 * @namespace EventChangeLogHttpRouter
 *
 * @description A record(log) of a changes on an event.
 *
 * It may be need assessment, loss assessment, general notification,
 * action taken, general comments etc.
 *
 * @author lally elias <lallyelias87@gmail.com>
 * @license MIT
 * @since 0.1.0
 * @version 1.0.0
 * @public
 */
const router$1 = new expressRestActions.Router({
  version: API_VERSION$1,
});

/**
 * @name GetEventChangeLogs
 * @memberof EventChangeLogHttpRouter
 * @description Returns a list of changelogs
 */
router$1.get(
  PATH_LIST$1,
  expressRestActions.getFor({
    get: (options, done) => EventChangeLog.get(options, done),
  })
);

/**
 * @name GetEventChangeLogSchema
 * @memberof EventChangeLogHttpRouter
 * @description Returns changelog json schema definition
 */
router$1.get(
  PATH_SCHEMA$1,
  expressRestActions.schemaFor({
    getSchema: (query, done) => {
      const jsonSchema = EventChangeLog.jsonSchema();
      return done(null, jsonSchema);
    },
  })
);

/**
 * @name ExportEventChangeLogs
 * @memberof EventChangeLogHttpRouter
 * @description Export changelogs as csv
 */
router$1.get(
  PATH_EXPORT$1,
  expressRestActions.downloadFor({
    download: (options, done) => {
      const fileName = `changelogs_exports_${Date.now()}.csv`;
      const readStream = EventChangeLog.exportCsv(options);
      return done(null, { fileName, readStream });
    },
  })
);

/**
 * @name PostEventChangeLog
 * @memberof EventChangeLogHttpRouter
 * @description Create new changelog
 */
router$1.post(
  PATH_LIST$1,
  file.uploaderFor(),
  ensureInitiator,
  expressRestActions.postFor({
    post: (body, done) => EventChangeLog.postWithChanges(body, done),
  })
);

/**
 * @name GetEventChangeLog
 * @memberof EventChangeLogHttpRouter
 * @description Get existing changelog
 */
router$1.get(
  PATH_SINGLE$1,
  expressRestActions.getByIdFor({
    getById: (options, done) => EventChangeLog.getById(options, done),
  })
);

/**
 * @name PatchEventChangeLog
 * @memberof EventChangeLogHttpRouter
 * @description Patch existing changelog
 */
router$1.patch(
  PATH_SINGLE$1,
  file.uploaderFor(),
  expressRestActions.patchFor({
    patch: (options, done) => EventChangeLog.patchWithChanges(options, done),
  })
);

/**
 * @name PutEventChangeLog
 * @memberof EventChangeLogHttpRouter
 * @description Put existing changelog
 */
router$1.put(
  PATH_SINGLE$1,
  file.uploaderFor(),
  expressRestActions.putFor({
    put: (options, done) => EventChangeLog.putWithChanges(options, done),
  })
);

/**
 * @name DeleteEventChangeLog
 * @memberof EventChangeLogHttpRouter
 * @description Delete existing changelog
 */
router$1.delete(
  PATH_SINGLE$1,
  expressRestActions.deleteFor({
    del: (options, done) => EventChangeLog.del(options, done),
    soft: true,
  })
);

/**
 * @module Event
 * @name Event
 * @description A representation of an entity which define and track an
 * instance(or occurrence) of an emergency(or disaster) event.
 *
 * @see {@link https://en.wikipedia.org/wiki/Disaster}
 *
 * @author lally elias <lallyelias87@gmail.com>
 * @since 0.1.0
 * @version 0.1.0
 * @license MIT
 * @example
 *
 * const {
 *   Event, EventChangeLog, start
 * } = require('@codetanzania/ewea-event');
 *
 * start(error => { ... });
 *
 */

/**
 * @name info
 * @description package information
 * @type {object}
 *
 * @author lally elias <lallyelias87@gmail.com>
 * @since 1.0.0
 * @version 0.1.0
 */
const info = common.pkg(
  `${__dirname}/package.json`,
  'name',
  'description',
  'version',
  'license',
  'homepage',
  'repository',
  'bugs',
  'sandbox',
  'contributors'
);

/**
 * @name apiVersion
 * @description http router api version
 * @type {string}
 *
 * @author lally elias <lallyelias87@gmail.com>
 * @since 0.1.0
 * @version 0.1.0
 */
const apiVersion = env.apiVersion();

/**
 * @function start
 * @name start
 * @description start http server
 * @param {Function} done callback to invoke on success or error
 * @author lally elias <lallyelias87@gmail.com>
 * @since 0.1.0
 * @version 0.1.0
 */
const start = (done) => {
  // connect mongodb
  mongooseCommon.connect((error) => {
    // back-off on connect error
    if (error) {
      return done(error);
    }

    // ensure file models
    file.createModels();

    // mount event router
    expressCommon.mount(router);

    // mount event changelog router
    expressCommon.mount(router$1);

    // start http server
    return expressRestActions.start(done);
  });
};

exports.Event = Event;
exports.EventChangeLog = EventChangeLog;
exports.apiVersion = apiVersion;
exports.eventChangeLogRouter = router$1;
exports.eventRouter = router;
exports.info = info;
exports.start = start;
