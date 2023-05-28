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

  Cell.find(query)
    .then((cells) => {
      res.json(cells);
    })
    .catch((error) => {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    });
});

// Solun lisäys
cellsRouter.post('/', (request, response, next) => {
  const body = request.body;

  if (body.path) {
    body.path = body.path.replace(/\//g, '');
  }

  Cell.find({})
    .then((cells) => {
      const nameIsTaken = (name, cells) => {
        return cells.some(
          (cell) => cell.name.toLowerCase() === name.toLowerCase()
        );
      };

      if (nameIsTaken(body.name, cells)) {
        return next(new Error('Samanniminen solu on jo lisätty'));
      }

      const cell = new Cell({
        name: body.name,
        path: body.path,
      });

      cell
        .save()
        .then((savedCell) => {
          response.status(201).json(savedCell);
        })
        .catch((error) => next(error));
    })
    .catch((error) => next(error));
});

// Solun haku
cellsRouter.get('/:id', (request, response, next) => {
  Cell.findById(request.params.id)
    .then((cell) => {
      if (cell) {
        response.json(cell);
      } else {
        response.status(404).end();
      }
    })
    .catch((error) => next(error));
});

// Solun poisto
cellsRouter.delete('/:id', (request, response, next) => {
  Cell.findByIdAndRemove(request.params.id)
    .then(() => {
      response.status(204).end();
    })
    .catch((error) => next(error));
});

module.exports = cellsRouter;
