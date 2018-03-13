const express = require('express');
const passport = require('passport');

const userRouter = express.Router();

const { jwtStrategy } = require('../strategies/strategies');

passport.use(jwtStrategy);

const jwtAuth = passport.authenticate('jwt', {session: false});

userRouter.get('/', jwtAuth, (req, res) => {


});


module.exports = userRouter;
