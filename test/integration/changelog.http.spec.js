import path from 'path';
import _ from 'lodash';
import {
  clear as clearHttp,
  testRouter,
} from '@lykmapipo/express-test-helpers';
import { clear as clearDb, expect } from '@lykmapipo/mongoose-test-helpers';
import { createModels } from '@lykmapipo/file';
import { Event, EventChangeLog, eventChangeLogRouter } from '../../src';

describe.only('Event ChangeLog Rest API', () => {
  const { SEED_PATH } = process.env;
  let event;
  const changelog = EventChangeLog.fakeOnly('comment');

  const options = {
    pathSingle: '/changelogs/:id',
    pathList: '/changelogs',
    pathSchema: '/changelogs/schema/',
    pathExport: '/changelogs/export/',
  };

  before(done => clearDb(done));

  before(() => clearHttp());

  before(() => {
    process.env.SEED_PATH = path.join(__dirname, '..', 'fixtures');
  });

  before(done =>
    // TODO: use fake
    Event.seed((error, seeded) => {
      event = _.first([].concat(seeded));
      changelog.set({ event });
      return done(error, seeded);
    })
  );

  beforeEach(() => createModels());

  it('should handle HTTP POST on /changelogs', done => {
    const { testPost } = testRouter(options, eventChangeLogRouter);
    testPost({ ...changelog.toObject() })
      .expect(201)
      .expect('Content-Type', /json/)
      .end((error, { body }) => {
        console.log('reply', body);
        expect(error).to.not.exist;
        expect(body).to.exist;
        const created = new EventChangeLog(body);
        expect(created._id).to.exist.and.be.eql(changelog._id);
        expect(created.use).to.exist.and.be.eql(changelog.use);
        done(error, body);
      });
  });

  it('should handle HTTP GET on /changelogs', done => {
    const { testGet } = testRouter(options, eventChangeLogRouter);
    testGet()
      .expect(200)
      .expect('Content-Type', /json/)
      .end((error, { body }) => {
        expect(error).to.not.exist;
        expect(body).to.exist;
        expect(body.data).to.exist;
        expect(body.total).to.exist;
        expect(body.limit).to.exist;
        expect(body.skip).to.exist;
        expect(body.page).to.exist;
        expect(body.pages).to.exist;
        expect(body.lastModified).to.exist;
        done(error, body);
      });
  });

  it('should handle GET /changelogs/schema', done => {
    const { testGetSchema } = testRouter(options, eventChangeLogRouter);
    testGetSchema().expect(200, done);
  });

  it('should handle GET /changelogs/export', done => {
    const { testGetExport } = testRouter(options, eventChangeLogRouter);
    testGetExport()
      .expect('Content-Type', 'text/csv; charset=utf-8')
      .expect(({ headers }) => {
        expect(headers['content-disposition']).to.exist;
      })
      .expect(200, done);
  });

  it('should handle HTTP GET on /changelogs/:id', done => {
    const { testGet } = testRouter(options, eventChangeLogRouter);
    const params = { id: changelog._id.toString() };
    testGet(params)
      .expect(200)
      .expect('Content-Type', /json/)
      .end((error, { body }) => {
        expect(error).to.not.exist;
        expect(body).to.exist;
        const found = new EventChangeLog(body);
        expect(found._id).to.exist.and.be.eql(changelog._id);
        expect(found.use).to.exist.and.be.eql(changelog.use);
        done(error, body);
      });
  });

  it('should handle HTTP PATCH on /changelogs/:id', done => {
    const { testPatch } = testRouter(options, eventChangeLogRouter);
    const { description } = changelog.fakeOnly('comment');
    const params = { id: changelog._id.toString() };
    testPatch(params, { description })
      .expect(200)
      .expect('Content-Type', /json/)
      .end((error, { body }) => {
        expect(error).to.not.exist;
        expect(body).to.exist;
        const patched = new EventChangeLog(body);
        expect(patched._id).to.exist.and.be.eql(changelog._id);
        expect(patched.use).to.exist.and.be.eql(changelog.use);
        done(error, body);
      });
  });

  it('should handle HTTP PUT on /changelogs/:id', done => {
    const { testPut } = testRouter(options, eventChangeLogRouter);
    const { description } = changelog.fakeOnly('comment');
    const params = { id: changelog._id.toString() };
    testPut(params, { description })
      .expect(200)
      .expect('Content-Type', /json/)
      .end((error, { body }) => {
        expect(error).to.not.exist;
        expect(body).to.exist;
        const patched = new EventChangeLog(body);
        expect(patched._id).to.exist.and.be.eql(changelog._id);
        expect(patched.use).to.exist.and.be.eql(changelog.use);
        done(error, body);
      });
  });

  it('should handle HTTP DELETE on /changelogs/:id', done => {
    const { testDelete } = testRouter(options, eventChangeLogRouter);
    const params = { id: changelog._id.toString() };
    testDelete(params)
      .expect(200)
      .expect('Content-Type', /json/)
      .end((error, { body }) => {
        expect(error).to.not.exist;
        expect(body).to.exist;
        const patched = new EventChangeLog(body);
        expect(patched._id).to.exist.and.be.eql(changelog._id);
        expect(patched.use).to.exist.and.be.eql(changelog.use);
        done(error, body);
      });
  });

  after(() => clearHttp());

  after(done => clearDb(done));

  after(() => {
    process.env.SEED_PATH = SEED_PATH;
  });
});
