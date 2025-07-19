const {MongoClient} = require("mongodb");
const dotenv = require("dotenv").config();

const url = process.env.MONGO_URI;
const client = new MongoClient(url);


let db;

async function connectDB() {
  try {
    await client.connect();
    db = client.db('jobportal');
    console.log('Connected to MongoDB');
    return db; // Return the database instance
  } catch (err) {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  }
}

function getDB() {
  return db;
}

module.exports = {connectDB,getDB}