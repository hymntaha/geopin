const User = require('../models/User');
const { OAuth2Client } = require('google-auth-library');
const oathkey = require('../config/keys_dev').OATH_CLIENT_ID;

const client = new OAuth2Client(oathkey);

exports.findOrCreateUser = async token => {
  const googleUser = await verifyAuthToken(token);

  const user = await checkIfUserExists(googleUser.email);

  return user ? user : createNewUser(googleUser);
};

const verifyAuthToken = async token => {
  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: oathkey,
    });
    return ticket.getPayload();
  } catch (err) {
    console.error('Error verifying auth token', err);
  }
};

const checkIfUserExists = async email => await User.findOne({ email }).exec();
const createNewUser = googleUser => {
  const { name, email, picture } = googleUser;
  const user = { name, email, picture };
  return new User(user).save();
};
