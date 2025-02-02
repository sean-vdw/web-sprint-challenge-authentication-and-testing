const Users = require('../users/users-model');
const jwt = require('jsonwebtoken');
const { TOKEN_SECRET } = require('../../config/index');

  /*
    IMPLEMENT

    1- On valid token in the Authorization header, call next.

    2- On missing token in the Authorization header,
      the response body should include a string exactly as follows: "token required".

    3- On invalid or expired token in the Authorization header,
      the response body should include a string exactly as follows: "token invalid".
  */

const restricted = (req, res, next) => {
  const token = req.headers.authorization;
  if (token) {
    jwt.verify(token, TOKEN_SECRET, (err, decoded) => {
      if (err) {
        res.status(401).json({ message: 'token invalid' });
      } else { 
        req.decodedJwt = decoded;
        next();
      }
    })
  } else {
    res.status(401).json({ message: 'token required' });
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

const checkUsername = (req, res, next) => {
  const { username } = req.body;
  if (username === null || username === undefined || username.trim() === '') {
    res.status(400).json({ message: 'username and password required' });
  } else {
    next();
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
  checkUsername,
  checkCredsExist
}