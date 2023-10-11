const Joi = require('joi');
const messagesError = {
  "any.required": "missing required (#label) field.",
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