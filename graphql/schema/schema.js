import {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLString
} from 'graphql';

import bcrypt from 'bcryptjs';
import User from '../graphObjects/User/user.js';

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
	  token: { type: GraphQLString },
	  queryType: { type: GraphQLString }
	},
	async resolve(root, params) {
	  if(params.queryType && params.email && params.password) {
	    if(params.queryType === 'login') {
	      return await root.db.collection('users').findOne({ 'profile.email': params.email })
		.then((user) => {
		  if(user) {
		    const hash = user.profile.hash;
		    return bcrypt.compare(params.password, hash)
		      .then((bc_res) => {
			if (bc_res) {
			  return user;
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
	    }
	  } else {
	    return false;
	  }
	}
      }
    })
  })
});

export default schema;
