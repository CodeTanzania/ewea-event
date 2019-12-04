import { idOf, pkg } from '@lykmapipo/common';
import { getString, apiVersion as apiVersion$1 } from '@lykmapipo/env';
import { model, createSchema, ObjectId, copyInstance, connect } from '@lykmapipo/mongoose-common';
import { mount } from '@lykmapipo/express-common';
import { Router, getFor, schemaFor, downloadFor, postFor, getByIdFor, patchFor, putFor, deleteFor, start as start$1 } from '@lykmapipo/express-rest-actions';
import { get, pick } from 'lodash';
import actions from 'mongoose-rest-actions';
import exportable from '@lykmapipo/mongoose-exportable';
import { Predefine } from '@lykmapipo/predefine';

// constants
// TODO COUNTRY_CODE
const MODEL_NAME = getString('EVENT_MODEL_NAME', 'Event');
const COLLECTION_NAME = getString('EVENT_COLLECTION_NAME', 'events');
const SCHEMA_OPTIONS = { collection: COLLECTION_NAME };
const POPULATION_MAX_DEPTH = 1;
const OPTION_AUTOPOPULATE_GROUP = {
  select: {
    'strings.name': 1,
    'strings.color': 1,
    'strings.code': 1,
  },
  maxDepth: POPULATION_MAX_DEPTH,
};
const OPTION_SELECT = {
  group: 1,
  type: 1,
  number: 1,
};
const OPTION_AUTOPOPULATE = {
  select: OPTION_SELECT,
  maxDepth: POPULATION_MAX_DEPTH,
};

/**
 * @module Event
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
 *
 * const { Event } = require('@codetanzania/ewea-event');
 *
 * Event.create(event, (error, created) => { ... });
 *
 */
const EventSchema = createSchema(
  {
    /**
     * @name group
     * @description Human readable group of an event.
     *
     * @type {object}
     * @property {object} type - schema(data) type
     * @property {boolean} trim - force trimming
     * @property {boolean} index - ensure database index
     * @property {boolean} taggable - allow field use for tagging
     * @property {boolean} default - default value set when none provided
     * @property {object} fake - fake data generator options
     *
     * @author lally elias <lallyelias87@gmail.com>
     * @since 0.1.0
     * @version 0.1.0
     * @instance
     * @example
     * Meteorological
     */
    group: {
      type: ObjectId,
      ref: Predefine.MODEL_NAME,
      index: true,
      // required: true,
      exists: true,
      autopopulate: OPTION_AUTOPOPULATE_GROUP,
      taggable: true,
      exportable: {
        format: v => get(v, 'strings.name.en'),
        default: 'NA',
      },
      // aggregatable: true,
      default: undefined,
    },

    /**
     * @name type
     * @description Human readable type of an event.
     *
     * @type {object}
     * @property {object} type - schema(data) type
     * @property {boolean} trim - force trimming
     * @property {boolean} index - ensure database index
     * @property {boolean} taggable - allow field use for tagging
     * @property {boolean} default - default value set when none provided
     * @property {object} fake - fake data generator options
     *
     * @author lally elias <lallyelias87@gmail.com>
     * @since 0.1.0
     * @version 0.1.0
     * @instance
     * @example
     * Flood
     */
    type: {
      type: ObjectId,
      ref: Predefine.MODEL_NAME,
      index: true,
      // required: true,
      exists: true,
      autopopulate: OPTION_AUTOPOPULATE_GROUP,
      taggable: true,
      exportable: {
        format: v => get(v, 'strings.name.en'),
        default: 'NA',
      },
      // aggregatable: true,
      default: undefined,
    },

    /**
     * @name number
     * @description Human readable, unique identifier of an event.
     *
     * It consist of two letters to identify the event(or disaster) type
     * (e.g. EQ - earthquake); the year of the event; a six-digit, sequential
     * event number; and the three-letter ISO code for country of occurrence
     * e.g EQ-2001-000033-TZA.
     *
     * @type {object}
     * @property {object} type - schema(data) type
     * @property {boolean} trim - force trimming
     * @property {boolean} uppercase - force value to uppercase
     * @property {boolean} index - ensure database index
     * @property {boolean} unique - ensure unique database index
     * @property {boolean} required - mark required
     * @property {boolean} searchable - allow searching
     * @property {boolean} taggable - allow field use for tagging
     * @property {object} fake - fake data generator options
     *
     * @author lally elias <lallyelias87@gmail.com>
     * @since 0.1.0
     * @version 0.1.0
     * @instance
     * @example
     * EQ-2018-000033-TZA
     */
    number: {
      // TODO: use mongoose-sequenceable
      type: String,
      trim: true,
      uppercase: true,
      index: true,
      // unique: true,
      // required: true,
      searchable: true,
      taggable: true,
      exportable: true,
      fake: {
        generator: 'random',
        type: 'uuid',
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
     * @property {boolean} index - ensure database index
     * @property {boolean} searchable - allow for searching
     * @property {object} fake - fake data generator options
     *
     * @author lally elias <lallyelias87@gmail.com>
     * @since 0.1.0
     * @version 0.1.0
     * @instance
     * @example
     * Roads, farms and crops were damaged.
     */
    description: {
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
      // TODO: ensure after startedAt
      type: Date,
      index: true,
      exportable: true,
      fake: {
        generator: 'date',
        type: 'recent',
      },
    },
  },
  SCHEMA_OPTIONS,
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
EventSchema.statics.MODEL_NAME = MODEL_NAME;
EventSchema.statics.COLLECTION_NAME = COLLECTION_NAME;
EventSchema.statics.OPTION_SELECT = OPTION_SELECT;
EventSchema.statics.OPTION_AUTOPOPULATE = OPTION_AUTOPOPULATE;

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
  const copyOfSeed = copyInstance(seed);

  const criteria = idOf(copyOfSeed)
    ? pick(copyOfSeed, '_id')
    : pick(copyOfSeed, 'group', 'type', 'number');

  return criteria;
};

/* export event model */
var Event = model(MODEL_NAME, EventSchema);

/* constants */
const API_VERSION = getString('API_VERSION', '1.0.0');
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
const router = new Router({
  version: API_VERSION,
});

/**
 * @name GetEvents
 * @memberof EventHttpRouter
 * @description Returns a list of events
 */
router.get(
  PATH_LIST,
  getFor({
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
  schemaFor({
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
  downloadFor({
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
  postFor({
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
  getByIdFor({
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
  patchFor({
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
  putFor({
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
  deleteFor({
    del: (options, done) => Event.del(options, done),
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
 * const { Event, start } = require('@codetanzania/ewea-event');
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
const info = pkg(
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
const apiVersion = apiVersion$1();

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
  connect(error => {
    // back-off on connect error
    if (error) {
      return done(error);
    }

    // mount event router
    mount(router);

    // start http server
    return start$1(done);
  });
};

export { Event, apiVersion, router as eventRouter, info, start };
