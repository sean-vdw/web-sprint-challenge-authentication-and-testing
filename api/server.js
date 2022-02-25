const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const session = require('express-session');

const restrict = require('./middleware/restricted.js');

const authRouter = require('./auth/auth-router.js');
const jokesRouter = require('./jokes/jokes-router.js');

const server = express();

server.use(helmet());
server.use(cors());
server.use(express.json());
server.use(session({
  name: 'dadjokes',
  secret: 'why did the chicken cross the road',
  cookie: {
    maxAge: 1000 * 60 * 60 * 3,
    secure: false,
    httpOnly: false
  },
  rolling: true,
  resave: false,
  saveUninitialized: false
}));

server.use('/api/auth', authRouter);
server.use('/api/jokes', restrict, jokesRouter); // only logged-in users should have access!

module.exports = server;
