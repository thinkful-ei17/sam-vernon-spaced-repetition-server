const express = require('express');

const loginRouter = express.Router();

loginRouter.post('/signIn', (req, res) => {

    const { username, password } = req.body;

});

module.exports = loginRouter;
