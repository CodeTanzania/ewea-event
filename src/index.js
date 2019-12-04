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
import { pkg } from '@lykmapipo/common';
import { apiVersion as httpApiVersion } from '@lykmapipo/env';
import { connect } from '@lykmapipo/mongoose-common';
import { mount } from '@lykmapipo/express-common';
import { start as startHttp } from '@lykmapipo/express-rest-actions';
import Event from './event.model';
import eventRouter from './event.http.router';

/**
 * @name info
 * @description package information
 * @type {object}
 *
 * @author lally elias <lallyelias87@gmail.com>
 * @since 1.0.0
 * @version 0.1.0
 */
export const info = pkg(
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
 * @name Event
 * @description Event model
 *
 * @author lally elias <lallyelias87@gmail.com>
 * @since 0.1.0
 * @version 0.1.0
 */
export { Event };

/**
 * @name eventRouter
 * @description event http router
 *
 * @author lally elias <lallyelias87@gmail.com>
 * @since 0.1.0
 * @version 0.1.0
 */
export { eventRouter };

/**
 * @name apiVersion
 * @description http router api version
 * @type {string}
 *
 * @author lally elias <lallyelias87@gmail.com>
 * @since 0.1.0
 * @version 0.1.0
 */
export const apiVersion = httpApiVersion();

/**
 * @function start
 * @name start
 * @description start http server
 * @param {Function} done callback to invoke on success or error
 * @author lally elias <lallyelias87@gmail.com>
 * @since 0.1.0
 * @version 0.1.0
 */
export const start = done => {
  // connect mongodb
  connect(error => {
    // back-off on connect error
    if (error) {
      return done(error);
    }

    // mount event router
    mount(eventRouter);

    // start http server
    return startHttp(done);
  });
};
