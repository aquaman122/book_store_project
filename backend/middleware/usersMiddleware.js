const { body, validationResult } = require('express-validator');
const { StatusCodes } = require('http-status-codes');

const isValidate = (req, res, next) => {
  const err = validationResult(req);

  if (err.isEmpty()) {
    return next();
  }

  res.status(StatusCodes.BAD_REQUEST).json(err.array());
};

const emailValidationsRules = [body('email').isEmail().withMessage("이메일로 해"), isValidate]

const validationRules = [
  body('email').isEmail().withMessage("이메일로 해"),
  body('password').isStrongPassword().withMessage('특수문자 하나, 알파벳 소문자하나, 대문자 하나, 숫자하나 필수'),
  isValidate
];

module.exports = { validationRules, emailValidationsRules };
