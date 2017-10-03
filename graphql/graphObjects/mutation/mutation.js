import {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLString
} from 'graphql';

import { createUser } from './mutationFields/userMutationObjects.js';

const mutationType = new GraphQLObjectType({
  name: 'Mutation',
  description: 'general mutation object',
  fields: () => ({
    createUser: createUser
  })
});

export default mutationType;
