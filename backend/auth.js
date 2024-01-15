const jwt = require( 'jsonwebtoken');
require("dotenv").config();

const ensureAuthorization = (req, res) => {
  try {
    const receivedJwt = req.headers["authorization"];
    return jwt.verify(receivedJwt, process.env.PRIVATE_KEY);
  } catch (err) {
    return err;
  }
}

module.exports = ensureAuthorization