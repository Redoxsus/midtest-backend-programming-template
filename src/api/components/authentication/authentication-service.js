const authenticationRepository = require('./authentication-repository');
const { generateToken } = require('../../../utils/session-token');
const { passwordMatched } = require('../../../utils/password');

// untuk menyimpan data percobaan login
const loginAttempts = new Map();

async function checkLoginCredentials(email, password) {
  const user = await authenticationRepository.getUserByEmail(email);

  // banyaknya percobaan login dimulai dari 0
  const attempts = loginAttempts.get(email) || 0;

  if (user) {
    const userPassword = user.password;
    const passwordChecked = await passwordMatched(password, userPassword);

    // Mengecek kesamaan password
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

  // Jika gagal login setelah 5 kali akan mengeluarkan error 403
  if (attempts >= 5) {
    const error = new Error('Too Many Failed Attempts');
    error.status = 403;
    error.description = 'FORBIDDEN_ERROR';
    error.error = 'Access Forbidden';
    throw error;
  }

  return null;
}

module.exports = {
  checkLoginCredentials,
};
