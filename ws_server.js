const auth_routes = require('./routes/authRoutes.js');
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;

const MONGO_URL = process.env.MONGO_URL;
// --- creating users collection ---
MongoClient.connect(MONGO_URL, (err, db) => {
  if(err) {
    console.log(err);
  } else {
    db.createCollection('users', { strict: true }, (err, collection) => {
      if(err) {
	console.log(err.message);
      } else {
	console.log('Users collection is created!');
      }
    });
  }
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(function (req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:8080');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With, content-type');
  res.setHeader('Access-Control-Allow-Credentials', true);
  next();
});

app.use('/', auth_routes);
app.listen(9999);
