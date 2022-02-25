const router = require('express').Router();
const jwt = require('jsonwebtoken');
const { findBy, addUser } = require('../users/users-model');
const { checkCredsExist, checkUsernameFree } = require('../middleware/restricted');
const bcrypt = require('bcryptjs');
const { TOKEN_SECRET } = require('../../config/index');

const buildToken = (user) => {
  const payload = {
    subject: user.id,
    username: user.username
  }
  const options = {
    expiresIn: '1d',
  }
  return jwt.sign(payload, TOKEN_SECRET, options);
};

router.post('/register', checkUsernameFree, async (req, res, next) => {
  try {
    const { username, password } = req.body;
    if (username === null || username === undefined || username.trim() === '' || password === null || password === undefined || password.trim() === '') {
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

router.post('/login', checkCredsExist, (req, res, next) => {
    const { username, password } = req.body;
    findBy({ username })
      .then(([user]) => {
        if(user && bcrypt.compareSync(password, user.password)) {
          const token = buildToken(user);
          res.status(200).json({
            message: `welcome, ${user.username}`,
            token
          })
        } else {
          res.status(401).json({ message: 'invalid credentials' });
        }
      })
      .catch(next);
});

module.exports = router;
