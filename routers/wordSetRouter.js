const express = require('express');
const passport = require('passport');

const wordSetRouter = express.Router();

const { jwtStrategy } = require('../strategies/strategies');

passport.use(jwtStrategy);

const jwtAuth = passport.authenticate('jwt', {session: false});

wordSetRouter.get('/', jwtAuth, (req, res) => {


});

wordSetRouter.post('/', jwtAuth, (req, res) => {


});

module.exports = wordSetRouter;
