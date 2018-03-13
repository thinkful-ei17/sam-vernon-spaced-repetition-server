require('dotenv').config();
const express = require('express');
const passport = require('passport');

const userRouter = express.Router();

const { jwtStrategy } = require('../strategies/strategies');

const jwtAuth = passport.authenticate('jwt', {session: false} );

passport.use(jwtStrategy);

//get all data about user! even the password [insert evil laugh]
userRouter.get('/', jwtAuth, (req, res) => {

  console.log(req.headers);
  const { user } = req;
  res.json(user);

});

//when user requests for a new question!
userRouter.get('/question', jwtAuth, (req, res) => {
  res.send('template!');


});

//when user answers back to question
userRouter.post('/response', jwtAuth, (req, res) => {
  res.send('template!');

});

//get specific wordSet to quiz on!
userRouter.get('/wordSet', jwtAuth, (req, res) => {
  res.send('template!');

});

module.exports = userRouter;
