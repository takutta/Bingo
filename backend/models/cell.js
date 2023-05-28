const mongoose = require('mongoose');

const cellSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  path: {
    type: String,
  },
});

cellSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

const Cell = mongoose.model('Cell', cellSchema);

module.exports = Cell;
