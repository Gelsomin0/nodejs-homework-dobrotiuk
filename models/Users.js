const { Schema, model } = require('mongoose');
const Joi = require('joi');

const { handleSaveError, runValidatorsAtUpdate } = require('./hooks');

const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

const userSchema = new Schema({
  password: {
    type: String,
    required: [true, 'Set password for user'],
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
  },
  subscription: {
    type: String,
    enum: ["starter", "pro", "business"],
    default: "starter"
  },
  avatarURL: String,
  token: String,
  verificationToken: {
    type: String,
    // required: [true, 'Verify token is required'],
    default: '',
  },
  verify: {
    type: Boolean,
    default: false,
  }
}, { versionKey: false, timestamps: true });

userSchema.post('save', handleSaveError);
userSchema.pre('findOneAndUpdate', runValidatorsAtUpdate);

const userSignupSchema = Joi.object({
    email: Joi.string().pattern(emailRegex).required(),
    password: Joi.string().min(6).required(),
});

const userLoginSchema = Joi.object({
    email: Joi.string().pattern(emailRegex).required(),
    password: Joi.string().min(6).required(),
});
const userEmailSchema = Joi.object({
    email: Joi.string().pattern(emailRegex).required(),
}).messages({
  'string.email': 'missing required field email',
});

const User = model('user', userSchema);

module.exports = {
    User,
    userSignupSchema,
  userLoginSchema,
    userEmailSchema,
};