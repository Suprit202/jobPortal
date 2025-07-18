const mongodb = require("mongodb").MongoClient;
const dotenv = require("dotenv").config();

const url = process.env.MONGO_URI;

let database;

async function connectDb() {
  mongodb.connect(url).then(clientObj => {
    const database = clientObj.db('jobPortal');
    console.log(`Database connected!!!`);
    return database;
  })
  .catch(err=>{
  console.log(err);
  })

}

function getDB() {
  return database;
}

module.exports = {connectDb,getDB}