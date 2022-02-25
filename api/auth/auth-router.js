const router = require('express').Router();
const { addUser, getJokes, findBy, findById } = require('../users/users-model');
const { restricted, checkCredsExist, checkUsernameFree } = require('../middleware/restricted');
const bcrypt = require('bcryptjs');

router.post('/register', checkUsernameFree, async (req, res, next) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      res.status(400).json({ message: 'username and password required' });
    } else {
      const hash = bcrypt.hashSync(password, 8);
      const user = { username, password: hash};
      const newUser = await addUser(user);
      res.status(201).json(newUser);
    }
  } catch(err) {
    next(err);
  };
});

router.post('/login', checkCredsExist, async (req, res, next) => {
  /*
    IMPLEMENT
    You are welcome to build additional middlewares to help with the endpoint's functionality.

    1- In order to log into an existing account the client must provide `username` and `password`:
      {
        "username": "Captain Marvel",
        "password": "foobar"
      }

    2- On SUCCESSFUL login,
      the response body should have `message` and `token`:
      {
        "message": "welcome, Captain Marvel",
        "token": "eyJhbGciOiJIUzI ... ETC ... vUPjZYDSa46Nwz8"
      }

    3- On FAILED login due to `username` or `password` missing from the request body,
      the response body should include a string exactly as follows: "username and password required".

    4- On FAILED login due to `username` not existing in the db, or `password` being incorrect,
      the response body should include a string exactly as follows: "invalid credentials".
  */
  try {
    const { username, password } = req.body;
    const [user] = await findBy({ username });
    if (user && bcrypt.compareSync(password, user.password)) {
      req.session.user = user;
      res.status(200).json({ message: `Welcome back, ${user.username}!` });
    } else {
      res.status(401).json({ message: 'invalid credentials' });
    }
  } catch(err) {
    next(err);
  };
});

module.exports = router;
