const Users = require('../users/users-model');

const restricted = (req, res, next) => {
  /*
    IMPLEMENT

    1- On valid token in the Authorization header, call next.

    2- On missing token in the Authorization header,
      the response body should include a string exactly as follows: "token required".

    3- On invalid or expired token in the Authorization header,
      the response body should include a string exactly as follows: "token invalid".
  */
 if (req.session.user) {
  next();
 } else if (req.session.user === null || req.session.user === undefined || req.session.user.trim() === '') {
  res.status(400).json({ message: 'token required' });
 } else {
   res.status(401).json({ message: 'token invalid' });
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
    const existingName = Users.findBy({ username });
    const existingPass = Users.findBy({ password });
    if (!existingName || !existingPass) {
      res.status(401).json({ message: 'username and password required' })
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