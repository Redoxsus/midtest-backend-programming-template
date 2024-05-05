const { User } = require('../../../models');

/**
 * Get a list of users
 * @param {number} search - Search keyword
 * @param {number} sort - Sort
 * @param {string} page_number - Page number
 * @param {string} page_size - page_size
 * @returns {Promise}
 */

// Deklarasi fungsi getUsers
async function getUsers(page_number, page_size, sort, search) {
  let query = User.find({});

  // Pagination untuk melakukan pencarian data pengguna untuk dijalankan sesuai dengan ketantuan dan halaman yang diminta.
  const skip = (page_number - 1) * page_size;
  query = query.skip(skip).limit(page_size);

  // Sorting untuk mengambil data pengguna akan diurutkan sesuai dengan opsi pengurutan yang telah ditentukan.
  if (sort) {
    let sortOption;
    switch (sort) {
      case 'name_asc':
        sortOption = { name: 1 };
        break;
      case 'name_desc':
        sortOption = { name: -1 };
        break;
      case 'email_asc':
        sortOption = { email: 1 };
        break;
      case 'email_desc':
        sortOption = { email: -1 };
        break;
      default:
        sortOption = {};
    }
    query = query.sort(sortOption);
  }

  // Search yang bersifat tidak case sensitive karena terdapat ('i')
  if (search) {
    query = query.where({ name: { $regex: new RegExp(search, 'i') } });
  }

  const users = await query.exec();
  const count = await User.countDocuments();

  return { data: users, count };
}

/**
 * Get user detail
 * @param {string} id - User ID
 * @returns {Promise}
 */
async function getUser(id) {
  return User.findById(id);
}

/**
 * Create new user
 * @param {string} name - Name
 * @param {string} email - Email
 * @param {string} password - Hashed password
 * @returns {Promise}
 */
async function createUser(name, email, password) {
  return User.create({
    name,
    email,
    password,
  });
}

/**
 * Update existing user
 * @param {string} id - User ID
 * @param {string} name - Name
 * @param {string} email - Email
 * @returns {Promise}
 */
async function updateUser(id, name, email) {
  return User.updateOne(
    {
      _id: id,
    },
    {
      $set: {
        name,
        email,
      },
    }
  );
}

/**
 * Delete a user
 * @param {string} id - User ID
 * @returns {Promise}
 */
async function deleteUser(id) {
  return User.deleteOne({ _id: id });
}

/**
 * Get user by email to prevent duplicate email
 * @param {string} email - Email
 * @returns {Promise}
 */
async function getUserByEmail(email) {
  return User.findOne({ email });
}

/**
 * Update user password
 * @param {string} id - User ID
 * @param {string} password - New hashed password
 * @returns {Promise}
 */
async function changePassword(id, password) {
  return User.updateOne({ _id: id }, { $set: { password } });
}

module.exports = {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  getUserByEmail,
  changePassword,
};
