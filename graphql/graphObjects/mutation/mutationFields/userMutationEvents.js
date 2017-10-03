import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { ObjectId } from 'mongodb';

const SECRET_HASH = process.env.SECRET_HASH;

exports.createUserEvent = (root, params) => {
  const username = params.username;
  const email = params.email;
  const password = params.password;
  
  const usersCollection = root.db.collection('users');

  return usersCollection.insertOne({ profile: { username, email, hash: bcrypt.hashSync(password, 12) } })
    .then((result) => {
      const token = jwt.sign({ username, email }, SECRET_HASH, { expiresIn: '7d' });
      usersCollection.update({'profile.email': email}, {$set: {'profile.token' : token}});
      const user = usersCollection.findOne({ "_id": new ObjectId(result.insertedId) });
      return user;
    })
    .catch((err) => {
    });

};
