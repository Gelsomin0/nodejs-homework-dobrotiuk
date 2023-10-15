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
  token: String
}, { versionKey: false, timestamps: true });

userSchema.post('save', handleSaveError);
userSchema.pre('findOneAndUpdate', runValidatorsAtUpdate);
// userSchema.pre('findOneAndUpdate', handleSaveError);

const userSignupSchema = Joi.object({
    email: Joi.string().pattern(emailRegex).required(),
    password: Joi.string().min(6).required(),
});

const userLoginSchema = Joi.object({
    email: Joi.string().pattern(emailRegex).required(),
    password: Joi.string().min(6).required(),
});

const User = model('user', userSchema);

module.exports = {
    User,
    userSignupSchema,
    userLoginSchema,
};