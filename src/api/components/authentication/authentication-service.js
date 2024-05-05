const authenticationRepository = require('./authentication-repository');
const { generateToken } = require('../../../utils/session-token');
const { passwordMatched } = require('../../../utils/password');

// map untuk menyimpan percobaan login per email
const loginAttempts = new Map();

/**
 * Memeriksa username dan password untuk login.
 * @param {string} email - Email
 * @param {string} password - Password
 * @returns {object} Objek yang berisi, antara lain, token JWT jika email dan password cocok. Jika tidak cocok, mengembalikan null.
 */
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
    throw new Error('Too Many Failed Attemps');
  }

  return null;
}

module.exports = {
  checkLoginCredentials,
};
