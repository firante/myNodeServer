const express = require('express');
const app = express();
const MongoClient = require('mongodb').MongoClient;
const bodyParser = require('body-parser');
const router = express.Router();

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');


const SECRET_HASH = process.env.SECRET_HASH;
const MONGO_URL = process.env.MONGO_URL;
router.get('/', function(req, res) {
});

router.route('/register')
  .post((req, res) => {
    const { username, password, email } = req.body.body;
    try {
      MongoClient.connect(MONGO_URL, (err, db) => {
	if(err) {
	  console.log(err);
	} else {
	  db.collection('users').findOne({ "profile.email": email }, (err, user) => {
	    if(err) res.status(400).send({ login_status: false, message: 'Server Error! Registration failed!' });
	    if(user) {
	      res.status(200).send({ login_status: false, message: 'Email is excist!' });
	    } else {
	      db.collection('users').insertOne({ profile: { username, email, hash: bcrypt.hashSync(password, 12) } })
		.then((result) => {
		  const token = jwt.sign({ username, email }, SECRET_HASH, { expiresIn: '7d' });
		  db.collection('users').update({'profile.email': email}, {$set: {'profile.token' : token}});
		  res.status(200).send({ login_status: true, message: 'logged In', username, token });
		}, ()=>{})
		.catch((err) => {
		  res.status(500).send({login_status: false, message: 'Account was not created!'});
		});
	    }
	  });
	}
      });
    } catch(err) { console.log(err); }
  });

router.route('/autologin')
  .post((req, res) => {
    try {
      const token = req.body.token;
      if (!token) res.status(200).send({login_status: false,  message: 'There is no token!' });
      MongoClient.connect(MONGO_URL, (err, db) => {
      	if(err) {
	  console.log(err);
	} else {
	  db.collection('users').findOne({ 'profile.token': token }, (err, user) => {
	    if(err) res.status(400).send({login_status: false, message: 'Server Error! Registration failed!'});
	    if(!user) {
	      res.status(200).send({login_status: false, message: 'Token does not exist!' });
	    } else {
	      jwt.verify(token, SECRET_HASH, (err, payload) => {
		if(err) res.status(200).send({login_status: false, message: 'Server Error! Token is wrong or expired!' });
		res.status(200).send({login_status: true, message: 'logged In', username: payload.username });
	      });
	    }
	  });
	}
      });
    } catch(err) {
      console.log(err);
      res.status(200).send({ login_status: false, message: 'Not valid request data!' });
    }
  });

router.route('/login')
  .post((req, res) => {
    try {
      const { email, password } = req.body.body;
      MongoClient.connect(MONGO_URL, (err, db) => {
	db.collection('users').findOne({ 'profile.email': email })
	  .then((user) => {
	    !user && res.status(200).send({ login_status: false, message: 'There is no registered user with this email!' });
	    const hash = user.profile.hash;
	    bcrypt.compare(password, hash)
	      .then((bc_res) => {
		if (bc_res) {
		  const token = jwt.sign({ username: user.profile.username, email }, SECRET_HASH, { expiresIn: '7d' });
		  db.collection('users').update({ 'profile.email': email }, { $set: { 'profile.token' : token } });
		  res.status(200).send({ login_status: true, message: 'logged In', username: user.profile.username, token });
		} else {
		  !bc_res && res.status(200).send({ login_status: false, message: 'Password incorrect!' });
		}
	      })
	      .catch((err) => {
		console.log(err);
		res.status(400).send({login_status: false, message: 'Password compare error!'});
	      });
	  })
	  .catch((err) => {
	    console.log(err);
	    res.status(400).send({login_status: false, message: 'DataBase Error!'});
	  });
	
      });
    } catch(err) {
      console.log(err);
      res.status(200).send({ login_status: false, message: 'Not valid request data!' });
    }
  });

module.exports = router;
