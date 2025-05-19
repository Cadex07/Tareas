require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const taskRoutes = require('./routes/taskRoutes');
const mongoose = require('mongoose');
const { MongoClient } = require('mongodb'); 

const app = express();
app.use(cors());
app.use(express.json());

// Sirve archivos estáticos del frontend
const path = require('path');
app.use(express.static(path.join(__dirname, '../frontend/public')));

app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);

connectDB().then(() => {
  app.listen(process.env.PORT, () =>
    console.log(`Servidor en puerto ${process.env.PORT}`)
  );
});