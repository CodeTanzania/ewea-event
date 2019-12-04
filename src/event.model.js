import { get } from 'lodash';
import { getString } from '@lykmapipo/env';
import { createSchema, model, ObjectId } from '@lykmapipo/mongoose-common';
import actions from 'mongoose-rest-actions';
import exportable from '@lykmapipo/mongoose-exportable';
import { Predefine } from '@lykmapipo/predefine';

// constants
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
  },
  SCHEMA_OPTIONS,
  actions,
  exportable
);

/* export event model */
export default model(MODEL_NAME, EventSchema);
