const express = require('express');
const app = express();
const MongoClient = require('mongodb').MongoClient;
const bodyParser = require('body-parser');
const router = express.Router();
// --- creating users collection ---
MongoClient.connect('mongodb://firante:rce15their@ds021691.mlab.com:21691/firantebase', (err, db) => {
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

router.get('/', function(req, res) {
  res.header ('Access-Control-Allow-Origin', '*');
  res.header ('Access-Control-Allow-Credentials', true);
  res.header ('Access-Control-Allow-Methods', 'POST, GET, PUT, DELETE, OPTIONS');
  res.header ('Access-Control-Allow-Headers', 'Content-Type');
  res.send('Hello Seattle\n');
});

router.route('/login')
  .post((req, res) => {
    console.log('POST');
    res.send('POST');
  })
  .get((req, res) => {
    console.log('GET');
    res.send('GET');
  });
app.use('/api', router);
app.listen(9999);
