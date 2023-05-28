require('dotenv').config();
const express = require('express');
const app = express();
const morgan = require('morgan');
const cors = require('cors');
const path = require('path');

const Cell = require('./models/cell');

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'info', 'index.html'));
});

app.use(express.static(path.join(__dirname, 'build')));

app.use(express.json());

app.use(cors());

// Lokitus
morgan.token('body', (req) => JSON.stringify(req.body));
app.use(
  morgan(':method :url :status :res[content-length] - :response-time ms :body')
);

// Kaikki solut
app.get('/api/cells', (req, res) => {
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
app.post('/api/cells', (request, response, next) => {
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
          response.json(savedCell);
        })
        .catch((error) => next(error));
    })
    .catch((error) => next(error));
});

// Solun haku
app.get('/api/cells/:id', (request, response, next) => {
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
app.delete('/api/cells/:id', (request, response, next) => {
  Cell.findByIdAndRemove(request.params.id)
    .then(() => {
      response.status(204).end();
    })
    .catch((error) => next(error));
});

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname + '/build/index.html'));
});

const unknownEndpoint = (request, response, next) => {
  return next(new Error('unknown endpoint'));
};

// Olemattomien osoitteiden käsittely
app.use(unknownEndpoint);

// Virheiden käsittely
const errorHandler = (error, request, response, next) => {
  console.error(error.message);
  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' });
  }

  if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message });
  }

  if (error.message === 'unknown endpoint') {
    return response.status(500).json({ error: error.message });
  }

  next(error);
};

app.use(errorHandler);
