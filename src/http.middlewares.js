/**
 * @name ensureInitiator
 * @description Set changelog initiator on request body
 * @author lally elias <lallyelias87@gmail.com>
 *
 * @param {object} request valid http request
 * @param {object} response valid http response
 * @param {Function} next next middlware to invoke
 * @returns {Function} next middlware to invoke
 *
 * @license MIT
 * @since 0.1.0
 * @version 1.0.0
 * @public
 */
export const ensureInitiator = (request, response, next) => {
  if (request.body && request.party) {
    request.body.initiator = request.body.initiator || request.party;
  }
  return next();
};

/**
 * @name ensureVerifier
 * @description Set changelog verify on request body
 *
 * @param {object} request valid http request
 * @param {object} response valid http response
 * @param {Function} next next middlware to invoke
 * @returns {Function} next middlware to invoke
 *
 * @author lally elias <lallyelias87@gmail.com>
 * @license MIT
 * @since 0.1.0
 * @version 1.0.0
 * @public
 */
export const ensureVerifier = (request, response, next) => {
  if (request.body && request.party) {
    request.body.verifier = request.body.verifier || request.party;
  }
  return next();
};
