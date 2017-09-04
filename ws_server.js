const express = require('express');
const app = express();
const MongoClient = require('mongodb').MongoClient;
const bodyParser = require('body-parser');
const router = express.Router();

const bcrypt = require('bcryptjs');
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
});

router.route('/login')
  .post((req, res) => {
    const { username, password, email } = req.body.body;
    console.log(email);
    res.send('true');
  });

router.route('/register')
  .post((req, res) => {
    const SECRET_HASH = process.env.SECRET_HASH;
    const { username, password, email } = req.body.body;
    MongoClient.connect('mongodb://firante:rce15their@ds021691.mlab.com:21691/firantebase', (err, db) => {
      if(err) {
	console.log(err);
      } else {
	db.findOne({ "profile.email": email }, (err, user) => {
	  if(err) res.status(500).send('Server Error! Registration failed!');
	  if(user) {
	    res.status(200).send({ message: 'Email is excist!' });
	  } else {
	    db.insert({ profile: { username, email, hash: bcrypt.hashSync(password, SECRET_HASH) } });
	  }
	});
      }
    });

    res.send('true');
  });

app.use('/', router);
app.listen(9999);
