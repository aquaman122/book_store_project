const jwt = require( 'jsonwebtoken');
require("dotenv").config();

const ensureAuthorization = (req, res) => {
  try {
    const receivedJwt = req.headers["authorization"];
    console.log(receivedJwt);
    if (receivedJwt) {
      return jwt.verify(receivedJwt, process.env.PRIVATE_KEY);
    } else {
      throw new ReferenceError("jwt must be provide")
    }
  } catch (err) {
    return err;
  }
}

module.exports = ensureAuthorization