import { createUserEvent } from './userMutationEvents.js';

import {
  GraphQLString
} from 'graphql';

import User from '../../User/user.js';

exports.createUser = {
  type: User,
  description: 'create user object',
  args: {
    username: { type: GraphQLString },
    email: { type: GraphQLString },
    password: { type: GraphQLString }
  },
  resolve: (root, params) => createUserEvent(root, params)
};
