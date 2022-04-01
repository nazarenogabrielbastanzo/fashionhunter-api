const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const { isEmail } = require("validator");

const UserSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  username: {
    type: String,
    required: true,
    unique: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: [isEmail, "Invalid email"]
  },
  password: {
    type: String,
    required: true,
  },
  passwordConfirm: {
    type: String,
    required: true,
    validate: {
      validator: function (value) {
        return value === this.password;
      },
      message: "Password and password confirmation do not match"
    },
    select: false
  },
  passwordChangedAt: Date,
  passwordResetToken: String,
  passwordResetExpires: Date,
  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user"
  },
  active: {
    type: Boolean,
    default: true,
    select: false
  },
  img: {
    type: String
  }
});

// encrypt passwordConfirm
UserSchema.pre("save", function (next) {
  const user = this;

  if (this.isModified("passwordConfirm") || this.isNew) {
    bcrypt.genSalt(10, function (saltError, salt) {
      if (saltError) {
        return next(saltError);
      } else {
        bcrypt.hash(user.passwordConfirm, salt, function (hashError, hash) {
          if (hashError) {
            return next(hashError);
          }

          user.passwordConfirm = hash;
          next();
        });
      }
    });
  } else {
    return next();
  }
});

// encrypt password
UserSchema.pre("save", function (next) {
  const user = this;

  if (this.isModified("password") || this.isNew) {
    bcrypt.genSalt(10, function (saltError, salt) {
      if (saltError) {
        return next(saltError);
      } else {
        bcrypt.hash(user.password, salt, function (hashError, hash) {
          if (hashError) {
            return next(hashError);
          }

          user.password = hash;
          next();
        });
      }
    });
  } else {
    return next();
  }
});

const User = mongoose.model("User", UserSchema);

module.exports = User;
