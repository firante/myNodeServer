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

// ---- Cross origin access configuration ----
app.use(function (req, res, next) {
  // Website you wish to allow to connect
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:8080');
  // Request methods you wish to allow
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  // Request headers you wish to allow
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With, content-type');
  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  res.setHeader('Access-Control-Allow-Credentials', true);
  // Pass to next layer of middleware
  next();
});

router.get('/', function(req, res) {
  res.send('Hello Seattle\n');
});

router.route('/login')
  .post((req, res) => {
    const { username, password, email } = req.body.body;
    console.log(email);
    res.send('true');
  });

app.use('/api', router);
app.listen(9999);
