import {
  GraphQLObjectType,
  GraphQLString
} from 'graphql';

import profileType from './profile.js';

const userType = new GraphQLObjectType({
  name: 'user',
  description: 'user object',
  fields: () => ({
    id: {
      type: GraphQLString,
      description: 'user field',
      resolve(root, params) {
	return root._id;
      }
    },
    profile: {
      type: profileType,
      description: 'profile field',
      resolve(root, params) {
	return root.profile;
      }
    }
  })
});
export default userType;
