const express = require('express');
const passport = require('passport');

const questionRouter = express.Router();

const { jwtStrategy } = require('../strategies/strategies');

passport.use(jwtStrategy);

const jwtAuth = passport.authenticate('jwt', {session: false});

questionRouter.get('/', jwtAuth, (req, res) => {


});

questionRouter.post('/', jwtAuth, (req, res) => {


});
module.exports = questionRouter;
