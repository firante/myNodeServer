import {
  GraphQLObjectType,
} from 'graphql';

  import { user, autoLogin, login, isUsernameOrEmailExist } from './queryFields/queryUserObject.js';


const queryObject = new GraphQLObjectType({
  name: 'Query',
  description: 'query to users',
  fields: () => ({
    user: user(),
    autoLogin: autoLogin(),
    login: login(),
    isUsernameOrEmailExist: isUsernameOrEmailExist()
  })
});

export default queryObject;
