const Joi = require("joi");

const userSchema = Joi.object({
  name: Joi.string().trim().required(),
  email: Joi.string().email().trim().lowercase().required(),
  password: Joi.string()
    .min(8)
    .pattern(/^(?=.*[A-Za-z])(?=.*\d)\S+$/)
    .required()
    .messages({
      "string.pattern.base":
        "Password must contain at least one letter, one number and should contain no spaces",
    }),
  role: Joi.string().valid("viewer", "analyst", "admin"),
  isActive: Joi.boolean(),
});

module.exports = { userSchema };
