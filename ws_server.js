import Promise from 'bluebird';
import express from 'express';
import graphql from 'express-graphql';
import bodyParser from 'body-parser';
import mongodb from 'mongodb';
import cors from 'cors';

import auth_routes from './routes/authRoutes.js';
import schema from './graphql/schema/schema.js';

const MONGO_URL = process.env.MONGO_URL;

const MongoClient = mongodb.MongoClient;
const app = express();
app.use(cors());

//app.use(bodyParser.urlencoded({ extended: true }));
//app.use(bodyParser.json());


// --- creating users collection ---
MongoClient.connect(MONGO_URL, {promiseLibrary: Promise})
  .catch(err => console.log(err.stack))
  .then((db) => {
    app.locals.db = db;
    db.createCollection('users', { strict: true }, (err, collection) => {
      if(err) {
	console.log(err.message);
      } else {
	console.log('Users collection is created!');
      }
    });

  });


app.use('/', auth_routes);
app.use('/graphql', graphql((req) => {
  return { schema,
	   graphiql: true,
	   pretty: true,
	   rootValue: { db: req.app.locals.db }
	 };
}));

app.listen(9999);
