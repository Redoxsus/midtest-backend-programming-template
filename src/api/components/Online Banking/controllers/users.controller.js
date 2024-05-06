const User = require('../models/user.model');

// Membuat User
exports.createUser = async (req, res) => {
  try {
    const user = new User(req.body);
    await user.save();
    res.status(201).json({ message: 'User created successfully', user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Mendapatkan Saldo User
exports.getUserBalance = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json({
      message: 'Saldo User didapatkan',
      balance: user.balance,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Menambahkan Saldo User
exports.updateUserBalance = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { $inc: { balance: req.body.amount } },
      { new: true }
    );
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json({
      message: 'Saldo Telah ditambahkan',
      balance: user.balance,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
