const Joi = require("joi");

const recordSchema = Joi.object({
  amount: Joi.number().greater(0).required(),
  type: Joi.string().valid("income", "expense").required(),
  category: Joi.string().trim().lowercase().required(),
  date: Joi.date().max("now").required(),
  notes: Joi.string().trim().allow("", null),
});

const updateRecordSchema = Joi.object({
  amount: Joi.number().greater(0),
  type: Joi.string().valid("income", "expense"),
  category: Joi.string().trim(),
  date: Joi.date().max("now"),
  notes: Joi.string().trim().allow("", null),
}).min(1);

module.exports = { recordSchema, updateRecordSchema };
