const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const UserManagementSchema = new mongoose.Schema({
  userId: { type: String, required: true, unique: true },
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['Admin', 'Manager', 'Driver'], required: true }, // User role
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

// Hash password before saving the user
UserManagementSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next(); // Only hash if password is modified
  try {
    this.password = await bcrypt.hash(this.password, 10); // Hash password with bcrypt
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare passwords
UserManagementSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('UserManagement', UserManagementSchema);
