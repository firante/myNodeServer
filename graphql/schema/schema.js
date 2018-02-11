import {
  GraphQLSchema,
} from 'graphql';

import mutationObjType from '../graphObjects/mutation/mutation.js';
import queryObject from '../graphObjects/querys/query.js';


const schema = new GraphQLSchema({
  query: queryObject,
  mutation: mutationObjType
});

export default schema;
