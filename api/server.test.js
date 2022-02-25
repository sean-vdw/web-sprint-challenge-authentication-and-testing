const server = require('./server');
const db = require('../data/dbConfig');
const request = require('supertest');

beforeAll(async () => {
  await db.migrate.rollback();
  await db.migrate.latest();
});

afterAll(async () => {
  await db.destroy();
});

// Sanity Check
test('sanity', () => {
  expect(true).toBe(true);
});

// Endpoint Tests
describe('[GET] /jokes', () => {
  it('should return token required if attempted to access', async () => {
    const res = await request(server).get('/api/jokes');
    expect(res.body.message).toBe('token required');
  });
  it('should return a status of 401', async () => {
    const res = await request(server).get('/api/jokes');
    expect(res.status).toBe(401);
  });
});

describe('[POST] /register', () => {
  it('should return object of new user added', async () => {
    const res = await request(server).post('/api/auth/register').send({ username: 'Sean', password: '1234' });
    expect(res.body).toBeTruthy();
  });
  it('should return a status of 201', async () => {
    const res = await request(server).post('/api/auth/register').send({ username: 'Kyle', password: '1234' });
    expect(res.status).toBe(201);
  });
});

describe('[POST] /login', () => {
  it('should return message of invalid credentials if user does not exist', async () => {
    const res = await request(server).post('/api/auth/login').send({ username: 'Jolene', password: '1234' });
    expect(res.body.message).toBe('invalid credentials');
  });
  it('should return a status of 401 with invalid credentials', async () => {
    const res = await request(server).post('/api/auth/login').send({ username: 'Jolene', password: '1234' });
    expect(res.status).toBe(401);
  });
});