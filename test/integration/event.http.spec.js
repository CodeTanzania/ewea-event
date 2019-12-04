import {
  clear as clearHttp,
  testRouter,
} from '@lykmapipo/express-test-helpers';
import { clear as clearDb, expect } from '@lykmapipo/mongoose-test-helpers';
import { Event, eventRouter } from '../../src';

describe('Event Rest API', () => {
  const event = Event.fake();

  const options = {
    pathSingle: '/events/:id',
    pathList: '/events',
    pathSchema: '/events/schema/',
    pathExport: '/events/export/',
  };

  before(done => clearDb(Event, done));

  before(() => clearHttp());

  it('should handle HTTP POST on /events', done => {
    const { testPost } = testRouter(options, eventRouter);
    testPost({ ...event.toObject() })
      .expect(201)
      .expect('Content-Type', /json/)
      .end((error, { body }) => {
        expect(error).to.not.exist;
        expect(body).to.exist;
        const created = new Event(body);
        expect(created._id).to.exist.and.be.eql(event._id);
        expect(created.number).to.exist.and.be.eql(event.number);
        done(error, body);
      });
  });

  it('should handle HTTP GET on /events', done => {
    const { testGet } = testRouter(options, eventRouter);
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

  it('should handle GET /events/schema', done => {
    const { testGetSchema } = testRouter(options, eventRouter);
    testGetSchema().expect(200, done);
  });

  it('should handle GET /events/export', done => {
    const { testGetExport } = testRouter(options, eventRouter);
    testGetExport()
      .expect('Content-Type', 'text/csv; charset=utf-8')
      .expect(({ headers }) => {
        expect(headers['content-disposition']).to.exist;
      })
      .expect(200, done);
  });

  it('should handle HTTP GET on /events/:id', done => {
    const { testGet } = testRouter(options, eventRouter);
    const params = { id: event._id.toString() };
    testGet(params)
      .expect(200)
      .expect('Content-Type', /json/)
      .end((error, { body }) => {
        expect(error).to.not.exist;
        expect(body).to.exist;
        const found = new Event(body);
        expect(found._id).to.exist.and.be.eql(event._id);
        expect(found.number).to.exist.and.be.eql(event.number);
        done(error, body);
      });
  });

  it('should handle HTTP PATCH on /events/:id', done => {
    const { testPatch } = testRouter(options, eventRouter);
    const { description } = event.fakeOnly('description');
    const params = { id: event._id.toString() };
    testPatch(params, { description })
      .expect(200)
      .expect('Content-Type', /json/)
      .end((error, { body }) => {
        expect(error).to.not.exist;
        expect(body).to.exist;
        const patched = new Event(body);
        expect(patched._id).to.exist.and.be.eql(event._id);
        expect(patched.number).to.exist.and.be.eql(event.number);
        done(error, body);
      });
  });

  it('should handle HTTP PUT on /events/:id', done => {
    const { testPut } = testRouter(options, eventRouter);
    const { description } = event.fakeOnly('description');
    const params = { id: event._id.toString() };
    testPut(params, { description })
      .expect(200)
      .expect('Content-Type', /json/)
      .end((error, { body }) => {
        expect(error).to.not.exist;
        expect(body).to.exist;
        const patched = new Event(body);
        expect(patched._id).to.exist.and.be.eql(event._id);
        expect(patched.number).to.exist.and.be.eql(event.number);
        done(error, body);
      });
  });

  it('should handle HTTP DELETE on /events/:id', done => {
    const { testDelete } = testRouter(options, eventRouter);
    const params = { id: event._id.toString() };
    testDelete(params)
      .expect(200)
      .expect('Content-Type', /json/)
      .end((error, { body }) => {
        expect(error).to.not.exist;
        expect(body).to.exist;
        const patched = new Event(body);
        expect(patched._id).to.exist.and.be.eql(event._id);
        expect(patched.number).to.exist.and.be.eql(event.number);
        done(error, body);
      });
  });

  after(() => clearHttp());

  after(done => clearDb(Event, done));
});