const { body, validationResult } = require('express-validator');
const { StatusCodes } = require('http-status-codes');

const isValidate = (req, res, next) => {
  const err = validationResult(req);

  if (err.isEmpty()) {
    return next();
  }

  res.status(StatusCodes.BAD_REQUEST).json(err.array());
};
