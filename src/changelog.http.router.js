import { getString } from '@lykmapipo/env';
import { uploaderFor } from '@lykmapipo/file';
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

import EventChangeLog from './changelog.model';

import { ensureInitiator } from './http.middlewares';

/* constants */
const API_VERSION = getString('API_VERSION', '1.0.0');
const PATH_SINGLE = '/changelogs/:id';
const PATH_LIST = '/changelogs';
const PATH_EXPORT = '/changelogs/export';
const PATH_SCHEMA = '/changelogs/schema/';

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
const router = new Router({
  version: API_VERSION,
});

/**
 * @name GetEventChangeLogs
 * @memberof EventChangeLogHttpRouter
 * @description Returns a list of changelogs
 */
router.get(
  PATH_LIST,
  getFor({
    get: (options, done) => EventChangeLog.get(options, done),
  })
);

/**
 * @name GetEventChangeLogSchema
 * @memberof EventChangeLogHttpRouter
 * @description Returns changelog json schema definition
 */
router.get(
  PATH_SCHEMA,
  schemaFor({
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
router.get(
  PATH_EXPORT,
  downloadFor({
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
router.post(
  PATH_LIST,
  uploaderFor(),
  ensureInitiator,
  postFor({
    post: (body, done) => EventChangeLog.postWithChanges(body, done),
  })
);

/**
 * @name GetEventChangeLog
 * @memberof EventChangeLogHttpRouter
 * @description Get existing changelog
 */
router.get(
  PATH_SINGLE,
  getByIdFor({
    getById: (options, done) => EventChangeLog.getById(options, done),
  })
);

/**
 * @name PatchEventChangeLog
 * @memberof EventChangeLogHttpRouter
 * @description Patch existing changelog
 */
router.patch(
  PATH_SINGLE,
  uploaderFor(),
  patchFor({
    patch: (options, done) => EventChangeLog.patchWithChanges(options, done),
  })
);

/**
 * @name PutEventChangeLog
 * @memberof EventChangeLogHttpRouter
 * @description Put existing changelog
 */
router.put(
  PATH_SINGLE,
  uploaderFor(),
  putFor({
    put: (options, done) => EventChangeLog.putWithChanges(options, done),
  })
);

/**
 * @name DeleteEventChangeLog
 * @memberof EventChangeLogHttpRouter
 * @description Delete existing changelog
 */
router.delete(
  PATH_SINGLE,
  deleteFor({
    del: (options, done) => EventChangeLog.del(options, done),
    soft: true,
  })
);

/* expose router */
export default router;
