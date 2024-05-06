const usersRoutes = require('./routes/users.routes');

module.exports = (app) => {
  app.use('/api', usersRoutes);
};
