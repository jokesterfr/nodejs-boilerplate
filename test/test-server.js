/**
 * HTTP server API tests
 */
const test = require('ava');
const request = require('supertest');

const config = require('./config.js');
const app = require('../lib/server.js');

test.before(async t => {
  t.context.config = { ...config };
  await app.listen(t.context.config);
});

/*
 * GET /
 */
test('fetch default route', async t => {
  await request(app)
    .get('/')
    .expect('X-Powered-By', 'Express')
    .expect('Content-Type', 'application/json; charset=utf-8')
    .expect(response => {
      t.deepEqual(response.body, { hello: 'world' });
    })
    .expect(200);
});

/*
 * GET /unknown-content
 */
test('fetch non existing content', async t => {
  await request(app)
    .get('/this-does-not-exist')
    .expect('X-Powered-By', 'Express')
    .expect('Content-Type', 'text/html; charset=utf-8')
    .expect(response => {
      t.true(response.text.includes('Cannot GET /this-does-not-exist'));
    })
    .expect(404);
});
