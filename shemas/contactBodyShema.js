const Joi = require('joi');
const messagesError = {
  "any.required": "missing required (#label) field.",
  "string.pattern.base": "Field (#phone) must have format like this (XXX) XXX-XXXX.",
  "string.email": "Field (#email) must be a valid email address.",
}

const bodyContactSchema = Joi.object({
  name: Joi.string().min(3).max(50).required(),
  email: Joi.string().min(5).max(255).required().email(),
  phone: Joi.string().pattern(/^\(\d{3}\) \d{3}-\d{4}$/).required(),
}).messages(messagesError);

const contactFavoriteSchema = Joi.object({
  favorite: Joi.boolean().required(),
}).messages({ "any.required": "missing field favorite." });

module.exports = {
  bodyContactSchema,
  contactFavoriteSchema,
}