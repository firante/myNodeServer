import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { ObjectId } from 'mongodb';

const SECRET_HASH = process.env.SECRET_HASH;

export const createUserEvent = (root, params) => {
  const username = params.username;
  const email = params.email;
  const password = params.password;
  
  const usersCollection = root.db.collection('users');
  const token = jwt.sign({ username, email }, SECRET_HASH, { expiresIn: '7d' });
  return usersCollection.findOne({ 'profile.email': email })
	.then(user => {
	  if(user) {
	    return { status: 'User with this email is exist!' };
	  } else {
	    return usersCollection.insertOne({ profile: { username, email, hash: bcrypt.hashSync(password, 12), token } })
	      .then((result) => {
		const user = usersCollection.findOne({ "_id": new ObjectId(result.insertedId) });
		return user;
	      })
	      .catch((err) => {
		console.log(err);
	      });
	    
	  }
	})
	.catch(err => console.log(err));
};
