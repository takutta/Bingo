const Cell = require('../models/cell');

const initialCells = [
  {
    name: 'Ensimmäinen solu',
  },
  {
    name: 'Toinen solu',
  },
  {
    name: 'Kolmas solu',
  },
  {
    name: 'Neljäs solu',
  },
];

const cellsInDb = async () => {
  const cells = await Cell.find({});
  return cells.map((cell) => cell.toJSON());
};

module.exports = {
  initialCells,
  cellsInDb,
};
