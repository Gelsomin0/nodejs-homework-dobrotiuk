const Joi = require('joi');

const bodyContactSchema = Joi.object({
  name: Joi.string().min(3).max(50).required().messages({
    "any.required": "missing required name field"
  }),
  email: Joi.string().min(5).max(255).required().email().messages({
    "any.required": "missing required email field"
  }),
  phone: Joi.string().regex(/^[0-9\-\+]{9,15}$/).required().messages({
    "any.required": "missing required phone field",
  }),
});

module.exports = bodyContactSchema;