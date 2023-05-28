const config = require('./utils/config');

const express = require('express');
const app = express();
const cors = require('cors');
const cellsRouter = require('./controllers/cells');
const Cell = require('./models/cell');
const path = require('path');
const morgan = require('morgan');
const mongoose = require('mongoose');

mongoose.set('strictQuery', false);

mongoose
  .connect(config.mongoUrl)
  .then(() => {
    console.log('connected to MongoDB');
  })
  .catch((error) => {
    console.log('error connecting to MongoDB:', error.message);
  });

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'info', 'index.html'));
});

app.use(express.static(path.join(__dirname, 'build')));

app.use(cors());
app.use(express.json());

app.use('/api/cells', cellsRouter);

// Lokitus
morgan.token('body', (req) => JSON.stringify(req.body));
app.use(
  morgan(':method :url :status :res[content-length] - :response-time ms :body')
);

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

module.exports = app;
