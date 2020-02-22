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

import {
  getChangeLogJsonSchema,
  exportChangeLogs,
  getChangeLogs,
  getChangeLogById,
  postChangeLogWithChanges,
  putChangeLogWithChanges,
  patchChangeLogWithChanges,
  deleteChangeLogWithChanges,
} from './api';

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
    get: (options, done) => getChangeLogs(options, done),
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
    getSchema: (query, done) => getChangeLogJsonSchema(query, done),
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
    download: (options, done) => exportChangeLogs(options, done),
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
  postFor({
    // TODO: Event.putWithChanges
    post: (body, done) => postChangeLogWithChanges(body, done),
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
    getById: (options, done) => getChangeLogById(options, done),
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
    // TODO: Event.patchWithChanges
    patch: (options, done) => patchChangeLogWithChanges(options, done),
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
    // TODO: Event.putWithChanges
    put: (options, done) => putChangeLogWithChanges(options, done),
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
    // TODO: methodNotAllowed
    del: (options, done) => deleteChangeLogWithChanges(options, done),
    soft: true,
  })
);

/* expose router */
export default router;
