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
	console.log(root)
	return root.profile.username;
      }
    },
    email: {
      type: GraphQLString,
      description: 'username field',
      async resolve(root, params) {
	return root.profile.email;
      }
    },
    token: {
      type: GraphQLString,
      description: 'username field',
      async resolve(root, params) {
	const token = jwt.sign({ username: root.profile.username, email: root.profile.email }, SECRET_HASH, { expiresIn: '7d' });
	return token;
      }
    }
  })
});
export default profileType;
