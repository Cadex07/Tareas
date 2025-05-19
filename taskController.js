const Task = require('../models/Task');

exports.getTasks = async (req, res) => {
  const tasks = await Task.find({ user: req.userId });
  res.json(tasks);
};

exports.createTask = async (req, res) => {
  const task = new Task({ ...req.body, user: req.userId });
  await task.save();
  res.status(201).json(task);
};

exports.deleteTask = async (req, res) => {
  const { id } = req.params;
  try {
    const task = await Task.findOneAndDelete({ _id: id, user: req.userId });
    if (!task) return res.status(404).json({ message: 'Tarea no encontrada' });
    res.json({ message: 'Tarea eliminada correctamente' });
  } catch (err) {
    res.status(500).json({ message: 'Error al eliminar la tarea' });
  }
};

exports.updateTask = async (req, res) => {
  const { id } = req.params;
  try {
    const tareaActualizada = await Task.findOneAndUpdate(
      { _id: id, user: req.userId }, // Solo permite editar tareas del usuario
      req.body,
      { new: true }
    );
    if (!tareaActualizada) return res.status(404).json({ message: 'Tarea no encontrada' });
    res.json(tareaActualizada);
  } catch (err) {
    res.status(500).json({ message: 'Error al editar la tarea' });
  }
};