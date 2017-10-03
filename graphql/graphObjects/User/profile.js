import {
  GraphQLObjectType,
  GraphQLString
} from 'graphql';

import jwt from 'jsonwebtoken';
const SECRET_HASH = process.env.SECRET_HASH;

const profileType = new GraphQLObjectType({
  name: 'profile',
  description: 'user profile object',
  fields: () => ({
    username: {
      type: GraphQLString,
      description: 'username field',
      resolve(root, params) {
	return root.username;
      }
    },
    email: {
      type: GraphQLString,
      description: 'username field',
      async resolve(root, params) {
	return root.email;
      }
    },
    token: {
      type: GraphQLString,
      description: 'username field',
      async resolve(root, params) {
	return root.token;
      }
    }
  })
});
export default profileType;
