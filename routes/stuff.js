// Ce fichier est relatif au routeur Express (que nous allons créer ici):
const express = require('express');

// La méthode express.Router()  vous permet de créer des routeurs séparés pour chaque route principale de votre application – vous y enregistrez ensuite les routes individuelles :
const router = express.Router();

const auth = require('../middleware/auth');

const stuffCtrl = require('../controllers/stuff');

router.post('/', auth, stuffCtrl.createThing);
router.get('/:id', auth, stuffCtrl.getOneThing);
router.put('/:id', auth, stuffCtrl.modifyThing);
router.delete('/:id', auth, stuffCtrl.deleteThing);
router.get('/', auth, stuffCtrl.getAllStuff);

module.exports = router;

// Structurer le code de façon modulaire facilite la compréhension de notre fichier de routeur et donc la maintenance... 
// Quelles routes sont disponibles à quels points de terminaison est évident, 
// et les noms descriptifs donnés aux fonctions de notre contrôleur permettent de mieux comprendre la fonction de chaque route.


