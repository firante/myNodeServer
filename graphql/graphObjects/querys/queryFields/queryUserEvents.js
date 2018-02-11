import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { ObjectId } from 'mongodb';

const SECRET_HASH = process.env.SECRET_HASH;

// --- resolver for check user or email existing ---
export const resolveUserOrEmailExists = async (root, params) => {
  if (Object.keys(params).length === 0) return [];
  
  const query = { };
  const qArr = [];
  params.username && qArr.push({ 'profile.username': new RegExp(params.username, 'i')});
  params.email && qArr.push({ 'profile.email': new RegExp(params.email, 'i') });
  
  if(qArr.length === 0) return [];

  query['$or'] = qArr;
  
  return await root.db.collection('users').find(query, { 'profile.username': 1, 'profile.email': 1, _id: 0 })
    .toArray()
    .then(user => user)
    .catch(err => false);
};

// --- resolver for user login ---
export const resolveLogin = async (root, params) => {
  if (Object.keys(params).length !== 2) return false;

  if (!params.email || !params.password) return false;

  return await root.db.collection('users').findOne({ 'profile.email': new RegExp(params.email, 'i') })
    .then((user) => {
      if(!user) return false;
      const hash = user.profile.hash;
      return bcrypt.compare(params.password, hash)
	.then((bc_res) => {
	  if(!bc_res) return false;
	  const token = jwt.sign({ username: user.profile.username, email: user.profile.email }, SECRET_HASH, { expiresIn: '7d' });
	  root.db.collection('users').update({'profile.email': user.profile.email}, {$set: {'profile.token' : token}});
	  const new_user = Object.assign({}, user);
	  new_user.profile.token = token;
	  return new_user;
	})
	.catch(err => false);
    })
    .catch(err => false);
};

// --- resolver for auto login ---

export const resolveAutoLogin = async (root, params) => {
  if(!params.token) return false;
  
  return await root.db.collection('users').findOne({ 'profile.token': params.token })
    .then((user) => {
      const ver = jwt.verify(params.token, SECRET_HASH);
      return ver && user;
    })
    .catch(err => false);
};

// --- resolve one user depends on params ---
// -- first priority id --
// -- second priority usename --
// -- third priority email --
export const resolveUser = async (root, params) => {
  if (Object.keys(params).length === 0) return false;
  const query = {};
  if(params.email) query.profile.email = params.email;
  if(params.username) query.profile.username = params.username;
  if(params.id) query._id = new ObjectId(params.id);
  if (Object.keys(query).length === 0) return false;
  return await root.db.collection('users').findOne(query)
    .then(user => user)
    .catch(err => false);

};
