const authenticationRepository = require('./authentication-repository');
const { generateToken } = require('../../../utils/session-token');
const { passwordMatched } = require('../../../utils/password');

const loginAttempts = new Map();

async function checkLoginCredentials(email, password) {
  const user = await authenticationRepository.getUserByEmail(email);

  const attempts = loginAttempts.get(email) || 0;

  if (user) {
    const userPassword = user.password;
    const passwordChecked = await passwordMatched(password, userPassword);

    if (passwordChecked) {
      loginAttempts.delete(email);
      return {
        email: user.email,
        name: user.name,
        user_id: user.id,
        token: generateToken(user.email, user.id),
      };
    } else {
      loginAttempts.set(email, attempts + 1);
    }
  }

  if (attempts >= 5) {
    const error = new Error('Too Many Failed Attempts');
    error.status = 403;
    error.description = 'FORBIDDEN';
    error.error = 'FORBIDDEN';
    throw error;
  }

  return null;
}

module.exports = {
  checkLoginCredentials,
};
