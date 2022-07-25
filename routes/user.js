// On créé des routes telles qu'elles sont prévues par l'application front-end :
const express = require('express');
const router = express.Router();

const userCtrl = require('../controllers/user');

router.post('/signup', userCtrl.signup);
router.post('/login', userCtrl.login);

module.exports = router;

// N'oubliez pas que le segment de route indiqué ici est uniquement le segment final, car le reste de l'adresse de la route sera déclaré dans notre application Express.