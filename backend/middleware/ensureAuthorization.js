const jwt = require('jsonwebtoken');
const { StatusCodes } = require('http-status-codes');
require('dotenv').config();

const verifyTokenOptional = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    next();
    return;
  }

  try {
    const decodedJwt = jwt.verify(token, process.env.PRIVATE_KEY);
    req.user_id = decodedJwt.id;
    next();
  } catch (err) {
    if (err instanceof jwt.TokenExpiredError) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
          message: '로그인 세션이 만료되었습니다. 다시 로그인해주세요.',
      });
    } else if (err instanceof jwt.JsonWebTokenError) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
          message: '유효하지 않은 토큰입니다.',
      });
    } else {
      console.log(err);
      return res.status(StatusCodes.UNAUTHORIZED).json({
          message: '로그인이 필요합니다.',
      });
    }
  }
};

const verifyToken = (req, res, next) => {
  const token = req.cookies.token;
  
  if (!token) {
    return res.status(StatusCodes.UNAUTHORIZED).json({
      message: '토큰이 없어.',
    });
  }

  try {
    const decodedJwt = jwt.verify(token, process.env.PRIVATE_KEY);
    req.user_id = decodedJwt.id; // 사용자 ID를 요청 객체에 할당
    next(); // 다음 미들웨어로 제어를 전달
  } catch (err) {
    if (err instanceof jwt.TokenExpiredError) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        message: '로그인 세션이 만료되었습니다. 다시 로그인해주세요.',
      });
    } else if (err instanceof jwt.JsonWebTokenError) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        message: '유효하지 않은 토큰입니다.',
      });
    } else {
      console.log(err);
      return res.status(StatusCodes.UNAUTHORIZED).json({
        message: '로그인이 필요합니다.',
      });
    }
  }
};

module.exports = {
    verifyToken,
    verifyTokenOptional,
};