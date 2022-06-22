const mongoose = require('mongoose');

const connectDB = () => {
  const mongoUri = process.env.MONGO_URI;

  try {
    mongoose.connect(mongoUri);
  } catch (error) {
    console.error(error);
  }

  mongoose.connection.on('connected', () => {
    console.log('MongoDB connected to', mongoose.connection.db.databaseName);
  });
};

module.exports = connectDB;
