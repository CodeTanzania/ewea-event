'use strict';

const eweaInternals = require('@codetanzania/ewea-internals');
const common = require('@lykmapipo/common');
const env = require('@lykmapipo/env');
const mongooseCommon = require('@lykmapipo/mongoose-common');
const expressCommon = require('@lykmapipo/express-common');
const expressRestActions = require('@lykmapipo/express-rest-actions');
const file = require('@lykmapipo/file');
const lodash = require('lodash');
const moment = require('moment');
require('@lykmapipo/mongoose-sequenceable');
const actions = require('mongoose-rest-actions');
const exportable = require('@lykmapipo/mongoose-exportable');
const mongooseGeojsonSchemas = require('mongoose-geojson-schemas');
const predefine = require('@lykmapipo/predefine');
const emisStakeholder = require('@codetanzania/emis-stakeholder');

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

// TODO: send notification after create
// TODO: calculate expose(risk) after create
// TODO: send actions after create

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
  {
    /**
     * @name group
     * @description Event group underwhich an event belongs to.
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
    group: {
      type: mongooseCommon.ObjectId,
      ref: predefine.Predefine.MODEL_NAME,
      // required: true,
      index: true,
      exists: true,
      autopopulate: PREDEFINE_OPTION_AUTOPOPULATE,
      taggable: true,
      exportable: {
        format: v => lodash.get(v, 'strings.name.en'),
        default: 'NA',
      },
      aggregatable: { unwind: true },
      default: undefined,
    },

    /**
     * @name type
     * @description Event type underwhich an event belongs to.
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
    type: {
      type: mongooseCommon.ObjectId,
      ref: predefine.Predefine.MODEL_NAME,
      // required: true,
      index: true,
      exists: true,
      autopopulate: PREDEFINE_OPTION_AUTOPOPULATE,
      taggable: true,
      exportable: {
        format: v => lodash.get(v, 'strings.name.en'),
        default: 'NA',
      },
      aggregatable: { unwind: true },
      default: undefined,
    },

    /**
     * @name certainty
     * @description Currently assigned certainty of an event.
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
    certainty: {
      type: mongooseCommon.ObjectId,
      ref: predefine.Predefine.MODEL_NAME,
      // required: true,
      index: true,
      exists: true,
      autopopulate: PREDEFINE_OPTION_AUTOPOPULATE,
      taggable: true,
      exportable: {
        format: v => lodash.get(v, 'strings.name.en'),
        default: 'NA',
      },
      aggregatable: { unwind: true },
      default: undefined,
    },

    /**
     * @name severity
     * @description Currently assigned severity of an event.
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
    severity: {
      type: mongooseCommon.ObjectId,
      ref: predefine.Predefine.MODEL_NAME,
      // required: true,
      index: true,
      exists: true,
      autopopulate: PREDEFINE_OPTION_AUTOPOPULATE,
      taggable: true,
      exportable: {
        format: v => lodash.get(v, 'strings.name.en'),
        default: 'NA',
      },
      aggregatable: { unwind: true },
      default: undefined,
    },

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
    stage: {
      type: String,
      trim: true,
      enum: EVENT_STAGES,
      index: true,
      searchable: true,
      taggable: true,
      exportable: true,
      default: EVENT_STAGE_ALERT,
      fake: true,
    },

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
    number: {
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
          const type = lodash.get(this, 'type.string.code', '');
          const year = moment(new Date()).format('YYYY');
          return common.compact([type, year]).join('-');
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
    },

    /**
     * @name address
     * @description A human readable description of location where an
     * event happened.
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
    address: {
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
    },

    /**
     * @name location
     * @description A geo-point specifying longitude and latitude pair
     * of the address of an event.
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
    location: mongooseGeojsonSchemas.Point,

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
    causes: {
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
    },

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
    description: {
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
    },

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
    places: {
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
    },

    /**
     * @name areas
     * @description Affected administrative area(s) of an event.
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
    areas: {
      type: [mongooseCommon.ObjectId],
      ref: predefine.Predefine.MODEL_NAME,
      // required: true,
      index: true,
      exists: true,
      autopopulate: PREDEFINE_OPTION_AUTOPOPULATE,
      taggable: true,
      exportable: {
        format: v => common.join(v, ', ', 'strings.name.en'),
        default: 'NA',
      },
      aggregatable: { unwind: true },
      default: undefined,
    },

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
    instructions: {
      type: String,
      trim: true,
      index: true,
      searchable: true,
      exportable: true,
      fake: {
        generator: 'lorem',
        type: 'sentence',
      },
    },

    /**
     * @name interventions
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
     * Affected victims were evacuated and relocated
     */
    interventions: {
      type: String,
      trim: true,
      index: true,
      searchable: true,
      exportable: true,
      fake: {
        generator: 'lorem',
        type: 'sentence',
      },
    },

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
    impacts: {
      type: String,
      trim: true,
      index: true,
      searchable: true,
      exportable: true,
      fake: {
        generator: 'lorem',
        type: 'sentence',
      },
    },

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
    remarks: {
      type: String,
      trim: true,
      index: true,
      searchable: true,
      exportable: true,
      fake: {
        generator: 'lorem',
        type: 'sentence',
      },
    },

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
    startedAt: {
      type: Date,
      index: true,
      exportable: true,
      // before: 'endedAt',
      fake: {
        generator: 'date',
        type: 'past',
      },
    },

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
    endedAt: {
      type: Date,
      index: true,
      exportable: true,
      // after: 'reportedAt',
      fake: {
        generator: 'date',
        type: 'recent',
      },
    },
  },
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
EventSchema.statics.prepareSeedCriteria = seed => {
  const copyOfSeed = mongooseCommon.copyInstance(seed);

  const criteria = common.idOf(copyOfSeed)
    ? lodash.pick(copyOfSeed, '_id')
    : lodash.pick(copyOfSeed, 'group', 'type', 'number');

  return criteria;
};

/* export event model */
const Event = mongooseCommon.model(eweaInternals.MODEL_NAME_EVENT, EventSchema);

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
  expressRestActions.postFor({
    post: (body, done) => Event.post(body, done),
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
  expressRestActions.patchFor({
    patch: (options, done) => Event.patch(options, done),
  })
);

/**
 * @name PutEvent
 * @memberof EventHttpRouter
 * @description Put existing event
 */
router.put(
  PATH_SINGLE,
  expressRestActions.putFor({
    put: (options, done) => Event.put(options, done),
  })
);

/**
 * @name DeleteEvent
 * @memberof EventHttpRouter
 * @description Delete existing event
 */
router.delete(
  PATH_SINGLE,
  expressRestActions.deleteFor({
    del: (options, done) => Event.del(options, done),
    soft: true,
  })
);

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
    format: v => lodash.get(v, 'name'),
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
    format: v => lodash.get(v, 'name'),
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
  autopopulate: PREDEFINE_OPTION_AUTOPOPULATE,
  taggable: true,
  exportable: {
    format: v => common.join(v, ', ', 'strings.name.en'),
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
  autopopulate: PREDEFINE_OPTION_AUTOPOPULATE,
  taggable: true,
  exportable: {
    format: v => common.join(v, ', ', 'strings.name.en'),
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
  autopopulate: emisStakeholder.Party.OPTION_AUTOPOPULATE,
  taggable: true,
  exportable: {
    format: v => common.join(v, ', ', 'name'),
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
  autopopulate: emisStakeholder.Party.OPTION_AUTOPOPULATE,
  taggable: true,
  exportable: {
    format: v => common.join(v, ', ', 'name'),
    default: 'NA',
  },
  aggregatable: { unwind: true },
  default: undefined,
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
    format: v => lodash.get(v, 'strings.name.en'),
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
    format: v => lodash.get(v, 'strings.name.en'),
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
    format: v => lodash.get(v, 'strings.name.en'),
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
    format: v => lodash.get(v, 'strings.name.en'),
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
const indicator = {
  type: mongooseCommon.ObjectId,
  ref: predefine.Predefine.MODEL_NAME,
  // required: true,
  index: true,
  exists: true,
  autopopulate: PREDEFINE_OPTION_AUTOPOPULATE,
  taggable: true,
  exportable: {
    format: v => lodash.get(v, 'strings.name.en'),
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
    format: v => lodash.get(v, 'strings.name.en'),
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
    format: v => lodash.get(v, 'strings.name.en'),
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
    format: v => lodash.get(v, 'strings.name.en'),
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
  autopopulate: PREDEFINE_OPTION_AUTOPOPULATE,
  taggable: true,
  exportable: {
    format: v => common.join(v, ', ', 'strings.name.en'),
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
    format: v => lodash.get(v, 'type.strings.name.en'),
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

const SCHEMA = common.mergeObjects(
  { use },
  { initiator, verifier },
  { group, type },
  { event },
  { function: fanction, action },
  { indicator, need, effect, value, unit },
  { areas },
  { groups, roles, agencies, focals },
  { image, audio, video, document },
  { location, address },
  { comment }
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
 * const { ChangeLog } = require('@codetanzania/ewea-event');
 * ChangeLog.create(changelog, (error, created) => { ... });
 */
const ChangeLogSchema = mongooseCommon.createSchema(
  SCHEMA,
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
  return done(null, this);
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
ChangeLogSchema.statics.prepareSeedCriteria = seed => {
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
  expressRestActions.postFor({
    post: (body, done) => EventChangeLog.post(body, done),
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
  expressRestActions.patchFor({
    patch: (options, done) => EventChangeLog.patch(options, done),
  })
);

/**
 * @name PutEventChangeLog
 * @memberof EventChangeLogHttpRouter
 * @description Put existing changelog
 */
router$1.put(
  PATH_SINGLE$1,
  expressRestActions.putFor({
    put: (options, done) => EventChangeLog.put(options, done),
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
const start = done => {
  // connect mongodb
  mongooseCommon.connect(error => {
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
