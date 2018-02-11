import {
  GraphQLString,
  GraphQLList
} from 'graphql';

import User from '../../User/user.js';

import { resolveUserOrEmailExists, resolveLogin, resolveAutoLogin, resolveUser } from './queryUserEvents.js';

export const user = () => ({
  type: User,
  description: 'get user by id or username or email',
  args: {
    id: { type: GraphQLString },
    username: { type: GraphQLString },
    email: { type: GraphQLString }
  },
  resolve: resolveUser
});

export const autoLogin = () => ({
  type: User,
  description: 'auto login user, get token and username',
  args: {
    token: { type: GraphQLString }
  },
  resolve: resolveAutoLogin
});

export const login = () => ({
  type: User,
  description: 'login user, get token and username',
  args: {
    email: { type: GraphQLString },
    password: { type: GraphQLString }
  },
  resolve: resolveLogin
});

export const isUsernameOrEmailExist = () => ({
  type: new GraphQLList(User),
  description: 'check username email existing',
  args: {
    username: { type: GraphQLString },
    email: { type: GraphQLString }
  },
  resolve: resolveUserOrEmailExists
});
