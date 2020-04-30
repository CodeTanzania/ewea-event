import { join } from '@lykmapipo/common';
import { ObjectId } from '@lykmapipo/mongoose-common';
import { Point } from 'mongoose-geojson-schemas';
import { Predefine } from '@lykmapipo/predefine';

import { PREDEFINE_OPTION_AUTOPOPULATE, deduplicate } from '../internals';

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
export const areas = {
  type: [ObjectId],
  ref: Predefine.MODEL_NAME,
  // required: true,
  index: true,
  exists: true,
  duplicate: deduplicate,
  aggregatable: { unwind: true },
  autopopulate: PREDEFINE_OPTION_AUTOPOPULATE,
  taggable: true,
  exportable: {
    format: (v) => join(v, ', ', 'strings.name.en'),
    default: 'NA',
  },
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
export const location = Point;

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
export const address = {
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
