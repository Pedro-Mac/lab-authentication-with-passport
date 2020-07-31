'use strict';

const { Router } = require('express');
const authenticationRouter = Router();

authenticationRouter.get('/sign-up', (req, res, next) => {
  res.render('authentication/sign-up');
});

authenticationRouter.post('/sign-up', (req, res, next) => {});

module.exports = authenticationRouter;
