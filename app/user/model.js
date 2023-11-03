import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import validator from 'validator';

const userSchema = new mongoose.Schema(
  {
    name: { type: String, require: [true, 'Please pass user name'] },
    profilePic: { type: String },
    email: {
      type: String,
      unique: true,
      lowercase: true,
      validate: [validator.isEmail, 'Email must be valid'],
    },
    password: { type: String, require: [true, 'Please pass password'] },
    confirmPassword: { type: String },
    defaultAccount:{type:mongoose.Schema.Types.ObjectId,ref:'Account'}
  },
  {
    timestamps: true,
  }
);

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  this.password = await bcrypt.hash(this.password, 12);

  this.confirmPassword = undefined;
  next();
});
userSchema.methods.correctPassword = async function (candidatePassword, userPassword) {
  const isCorrect = await bcrypt.compare(candidatePassword, userPassword);
  return isCorrect;
};

const User = mongoose.model('User', userSchema);

export default User;
