import { expect } from '@lykmapipo/mongoose-test-helpers';
import { ensureInitiator, ensureVerifier } from '../../src/http.middlewares';

describe.only('Http Middlewares', () => {
  it('should ensure initiator if not set', done => {
    const request = { body: {}, party: {} };
    ensureInitiator(request, {}, () => {
      expect(request.body.initiator).to.exist;
      expect(request.body.initiator).to.be.eql(request.party);
      done();
    });
  });

  it('should ignore initiator if set', done => {
    const request = { body: { initiator: {} }, party: {} };
    ensureInitiator(request, {}, () => {
      expect(request.body.initiator).to.exist;
      expect(request.body.initiator).to.be.eql(request.body.initiator);
      done();
    });
  });

  it('should ensure verifier if not set', done => {
    const request = { body: {}, party: {} };
    ensureVerifier(request, {}, () => {
      expect(request.body.verifier).to.exist;
      expect(request.body.verifier).to.be.eql(request.party);
      done();
    });
  });

  it('should ignore verifier if set', done => {
    const request = { body: { verifier: {} }, party: {} };
    ensureVerifier(request, {}, () => {
      expect(request.body.verifier).to.exist;
      expect(request.body.verifier).to.be.eql(request.body.verifier);
      done();
    });
  });
});
