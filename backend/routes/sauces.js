const express = require('express');
const router = express.Router();//Le système de routage express est utile pour gérer la structure de votre application, en regroupant différentes routes dans un seul dossier/répertoire

const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config')
const stuffCtrl = require('../controllers/sauces');

router.get('/', auth, stuffCtrl.getAllStuff);
router.post('/', auth, multer, stuffCtrl.createThing);
router.get('/:id', auth, stuffCtrl.getOneThing);
router.put('/:id', auth, multer, stuffCtrl.modifyThing);
router.delete('/:id', auth, stuffCtrl.deleteThing);
router.post('/:id/like', auth, stuffCtrl.likeSauce);

module.exports = router;
