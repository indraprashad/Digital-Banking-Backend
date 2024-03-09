const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  username: {
    type: String,
    unique: false,
    required: true,
  },
  email: {
    type: String,
    unique: true,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  confirmPassword: {
    type: String,
    required: true,
  },
});

userSchema.pre("save", function (next) {
  const user = this;

  // Check if password or confirmPassword is modified
  if (!user.isModified("password") && !user.isModified("confirmPassword")) {
    return next();
  }

  // Generate salt
  bcrypt.genSalt(10, (err, salt) => {
    if (err) {
      return next(err);
    }

    // Hash password
    bcrypt.hash(user.password, salt, (err, hash) => {
      if (err) {
        return next(err);
      }
      user.password = hash;

      // Hash confirmPassword
      bcrypt.hash(user.confirmPassword, salt, (err, hash) => {
        if (err) {
          return next(err);
        }
        user.confirmPassword = hash;
        next();
      });
    });
  });
});

userSchema.methods.comparePassword = function (candidatePassword) {
  const user = this;
  return new Promise((resolve, reject) => {
    bcrypt.compare(candidatePassword, user.password, (err, isMatch) => {
      if (err) {
        return reject(err);
      }
      if (!isMatch) {
        return reject(err);
      }
      resolve(true);
    });
  });
};

mongoose.model("User", userSchema);

module.exports = mongoose.model('User');
