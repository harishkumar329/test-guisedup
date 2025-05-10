import User from '../../../models/user.js';

const findUserByEmail = async (email) => {
  return await User.findOne({ where: { email } });
};

export { findUserByEmail };