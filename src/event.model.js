import { get, pick } from 'lodash';
import { idOf } from '@lykmapipo/common';
import { getString } from '@lykmapipo/env';
import {
  copyInstance,
  createSchema,
  model,
  ObjectId,
} from '@lykmapipo/mongoose-common';
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
     * Meteorological
     */
    group: {
      type: ObjectId,
      ref: Predefine.MODEL_NAME,
      // required: true,
      index: true,
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
     * Flood
     */
    type: {
      type: ObjectId,
      ref: Predefine.MODEL_NAME,
      // required: true,
      index: true,
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
      // TODO: use mongoose-sequenceable
      type: String,
      trim: true,
      uppercase: true,
      // required: true,
      index: true,
      // unique: true,
      searchable: true,
      taggable: true,
      exportable: true,
      fake: {
        generator: 'random',
        type: 'uuid',
      },
    },

    /**
     * @name cause
     * @description Human readable, brief summary about cause(s) of an event.
     *
     * @type {object}
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
     * Heavy rainfall
     */
    cause: {
      type: String,
      trim: true,
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
      index: true,
      searchable: true,
      exportable: true,
      fake: {
        generator: 'lorem',
        type: 'sentence',
      },
    },

    /**
     * @name instruction
     * @description Human readable, recommended action to be taken by
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
    instruction: {
      type: String,
      trim: true,
      index: true,
      searchable: true,
      exportable: true,
      fake: {
        generator: 'lorem',
        type: 'paragraph',
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
export default model(MODEL_NAME, EventSchema);
