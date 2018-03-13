require('dotenv').config();
const express = require('express');
const passport = require('passport');

const userRouter = express.Router();

const { jwtStrategy } = require('../strategies/strategies');

const jwtAuth = passport.authenticate('jwt', {session: false} );

passport.use(jwtStrategy);

userRouter.get('/', jwtAuth, (req, res) => {
  console.log(req.headers);
  const { user } = req;
  res.json({user});

});


module.exports = userRouter;
