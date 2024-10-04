import Joi from "joi";

const getlistbs = Joi.string().max(191).required();
