import {
  MODEL_NAME_EVENT,
  COLLECTION_NAME_EVENT,
} from '@codetanzania/ewea-internals';
import { pick } from 'lodash';
import { join, idOf } from '@lykmapipo/common';
import {
  copyInstance,
  createSchema,
  model,
  ObjectId,
} from '@lykmapipo/mongoose-common';
import '@lykmapipo/mongoose-sequenceable';
import actions from 'mongoose-rest-actions';
import exportable from '@lykmapipo/mongoose-exportable';
import { Predefine } from '@lykmapipo/predefine';

import {
  EVENT_SCHEMA_OPTIONS,
  EVENT_STAGE_ALERT,
  EVENT_STAGE_EVENT,
  EVENT_STAGES,
  EVENT_OPTION_SELECT,
  EVENT_OPTION_AUTOPOPULATE,
  PREDEFINE_OPTION_AUTOPOPULATE,
} from './internals';

import { group, type, level, severity, certainty } from './schema/base.schema';
import { location, address } from './schema/geos.schema';
import { stage, number } from './schema/event.base.schema';

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
const EventSchema = createSchema(
  {
    group,
    type,
    level,
    severity,
    certainty,
    stage,
    number,
    location,
    address,

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
      type: [ObjectId],
      ref: Predefine.MODEL_NAME,
      // required: true,
      index: true,
      exists: true,
      autopopulate: PREDEFINE_OPTION_AUTOPOPULATE,
      taggable: true,
      exportable: {
        format: v => join(v, ', ', 'strings.name.en'),
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
EventSchema.statics.MODEL_NAME = MODEL_NAME_EVENT;
EventSchema.statics.COLLECTION_NAME = COLLECTION_NAME_EVENT;
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
  const copyOfSeed = copyInstance(seed);

  const criteria = idOf(copyOfSeed)
    ? pick(copyOfSeed, '_id')
    : pick(copyOfSeed, 'group', 'type', 'number');

  return criteria;
};

/* export event model */
export default model(MODEL_NAME_EVENT, EventSchema);
