const mongoose = require('mongoose');

const TaskSchema = new mongoose.Schema({
  titulo: String,
  descripcion: String,
  fecha: Date,
  prioridad: String,
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
});

module.exports = mongoose.model('Task', TaskSchema);
