const Users = require('../users/users-model');
const jwt = require('jsonwebtoken');
const { TOKEN_SECRET } = require('../../config/index');

const restricted = (req, res, next) => {
  /*
    IMPLEMENT

    1- On valid token in the Authorization header, call next.

    2- On missing token in the Authorization header,
      the response body should include a string exactly as follows: "token required".

    3- On invalid or expired token in the Authorization header,
      the response body should include a string exactly as follows: "token invalid".
  */
  const token = req.headers.authorization;
  if (token === null || token === undefined || token === '') {
    res.status(400).json({ message: 'token required' });
  } else {
    jwt.verify(token, TOKEN_SECRET, (err, decoded) => {
      if(err) {
        res.status(401).json({ message: 'token invalid' });
      } else {
        req.decodedJwt = decoded;
        next();
      };
    });
  };
};

const checkUsernameFree = async (req, res, next) => {
  try {
    const { username } = req.body;
    const existing = await Users.findBy({ username });
    if (existing.length) {
      res.status(422).json({ message: 'username taken' });
    } else {
      next();
    }
  } catch(err) {
    next(err);
  };
};

const checkCredsExist = async (req, res, next) => {
  try {
    const { username, password } = req.body;
    if (!username || username.trim() === '' || !password || password.trim() === '') {
      res.status(400).json({ message: 'username and password required' });
    } else {
      next();
    }
  } catch(err) {
    next(err);
  };
};

module.exports = {
  restricted,
  checkUsernameFree,
  checkCredsExist
}