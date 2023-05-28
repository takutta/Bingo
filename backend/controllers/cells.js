const cellsRouter = require('express').Router();
const Cell = require('../models/cell');
const path = require('path');

// Kaikki solut
cellsRouter.get('/', async (req, res) => {
  let path = req.query.path;

  if (path) {
    path = path.replace(/\//g, '');
  }

  const query = path ? { path: path } : {};

  const cells = await Cell.find(query);
  res.json(cells);
});

// Solun lisäys
cellsRouter.post('/', async (request, response) => {
  const body = request.body;

  if (body.path) {
    body.path = body.path.replace(/\//g, '');
  }

  cells = await Cell.find({});
  const nameIsTaken = (name, cells) => {
    return cells.some((cell) => cell.name.toLowerCase() === name.toLowerCase());
  };

  if (nameIsTaken(body.name, cells)) {
    return next(new Error('Samanniminen solu on jo lisätty'));
  }

  const cell = await new Cell({
    name: body.name,
    path: body.path,
  });

  cell.save().then((savedCell) => {
    response.status(201).json(savedCell);
  });
});

// Solun haku
cellsRouter.get('/:id', async (request, response) => {
  oneCell = await Cell.findById(request.params.id);
  if (cell) {
    response.json(cell);
  } else {
    response.status(404).end();
  }
});

// Solun poisto
cellsRouter.delete('/:id', async (request, response) => {
  foundId = await Cell.findByIdAndRemove(request.params.id);
  response.status(204).end();
});

module.exports = cellsRouter;
