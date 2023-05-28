const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../app');

const api = supertest(app);

const Cell = require('../models/cell');
const helper = require('./test_helper');

describe('when there is initially some cells saved', () => {
  beforeEach(async () => {
    await Cell.deleteMany({});
    await Cell.insertMany(helper.initialCells);
  });

  test('cells are returned as json', async () => {
    await api
      .get('/api/cells')
      .expect(200)
      .expect('Content-Type', /application\/json/);
  });

  test('all cells are returned', async () => {
    const response = await api.get('/api/cells');

    expect(response.body).toHaveLength(helper.initialCells.length);
  });
  test('a specific cell is within the returned cells', async () => {
    const response = await api.get('/api/cells');

    const name = response.body.map((r) => r.name);
    expect(name).toContain('Kolmas solu');
  });
});

describe('viewing a specific cell', () => {
  test('succeeds with a valid id', async () => {
    const cellsAtStart = await helper.cellsInDb();

    const cellToView = cellsAtStart[0];

    const resultCell = await api
      .get(`/api/cells/${cellToView.id}`)
      .expect(200)
      .expect('Content-Type', /application\/json/);

    expect(resultCell.body).toEqual(cellToView);
  });
  test('returned cells identifier field is id', async () => {
    const response = await api.get('/api/cells');
    const contents = response.body.map((r) => r.id);
    expect(contents).toBeDefined();
  });

  test('fails with statuscode 404 if note does not exist', async () => {
    let randomObjectId;
    let existingCell;

    do {
      randomObjectId = new mongoose.Types.ObjectId();
      existingCell = await Cell.findById(randomObjectId);
    } while (existingCell);
    await api.get(`/api/cells/${randomObjectId}`).expect(404);
  });
});
describe('adding and deleting cells', () => {
  test('a valid cell can be added ', async () => {
    const newCell = {
      name: 'Tällainen bingoruutu tämä.',
    };

    await api
      .post('/api/cells')
      .send(newCell)
      .expect(201)
      .expect('Content-Type', /application\/json/);

    const cellsAtEnd = await helper.cellsInDb();
    expect(cellsAtEnd).toHaveLength(helper.initialCells.length + 1);

    const name = cellsAtEnd.map((n) => n.name);
    expect(name).toContain('Tällainen bingoruutu tämä.');
  });

  test('cell can be deleted', async () => {
    const cellsAtEnd = await helper.cellsInDb();
    const oneCellId = cellsAtEnd[0].id;
    await api.delete(`/api/cells/${oneCellId}`).expect(204);
  });
});

// TODO:
// Add tests for paths
afterAll(async () => {
  await mongoose.connection.close();
});
