import {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLString
} from 'graphql';
import { ObjectId } from 'mongodb';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../graphObjects/User/user.js';
import mutationObjType from '../graphObjects/mutation/mutation.js';


const SECRET_HASH = process.env.SECRET_HASH;
const schema = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: 'Query',
    description: 'query to users',
    fields: () =>({
      user: {
	type: User,
	description: 'user type',
	args: {
	  id: { type: GraphQLString },
	  username: { type: GraphQLString },
	  email: { type: GraphQLString },
	  password: { type: GraphQLString },
	  token: { type: GraphQLString }
	},
	async resolve(root, params) {
	  if(params.email && params.password) {
	    return await root.db.collection('users').findOne({ 'profile.email': params.email })
	      .then((user) => {
		if(user) {
		  const hash = user.profile.hash;
		  return bcrypt.compare(params.password, hash)
		    .then((bc_res) => {
		      if (bc_res) {
			
			const token = jwt.sign({ username: user.profile.username, email: user.profile.email }, SECRET_HASH, { expiresIn: '7d' });
			root.db.collection('users').update({'profile.email': user.profile.email}, {$set: {'profile.token' : token}});
			
			const new_user = Object.assign({}, user);
			new_user.profile.token = token;
			
			return new_user;
		      } else {
			return false;
		      }
		    })
		    .catch((err) => {
		      console.log(err);
		      return false;
		    });
		} else {
		  return false;
		}
	      })
	      .catch(err => false);
	  } else if(params.token) {
	    return await root.db.collection('users').findOne({ 'profile.token': params.token })
	      .then((user) => {
		const ver = jwt.verify(params.token, SECRET_HASH);
		return ver && user;
	      })
	      .catch(err => false);
	  } else {
	    return params.id && await root.db.collection('users').findOne({ "_id": new ObjectId(params.id) })
	      .then(user => user)
	      .catch(err => false);
	  }
	}
      }
    })
  }),
  mutation: mutationObjType
});

export default schema;
