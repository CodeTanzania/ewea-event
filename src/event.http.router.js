import { getString } from '@lykmapipo/env';
import {
  getFor,
  schemaFor,
  downloadFor,
  getByIdFor,
  postFor,
  patchFor,
  putFor,
  deleteFor,
  Router,
} from '@lykmapipo/express-rest-actions';
import Event from './event.model';

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

/* expose router */
export default router;
