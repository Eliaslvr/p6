const express = require('express');
// const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path');//Le module Path permet de travailler avec des répertoires et des chemins de fichiers.
const cors = require('cors'); 
const helmet = require('helmet');//bibliothèque JavaScript qui aide à sécuriser Node.js en définissant plusieurs en-têtes HTTP. Il agit comme un middleware pour Express et les technologies similaires, ajoutant ou supprimant automatiquement des en-têtes HTTP pour se conformer aux normes de sécurité Web

const app = express();//app qui sera notre application; ça permet de créer une application express
// const router = express.Router();
app.use(helmet());
app.use(express.json());
app.use(cors());

const saucesRoutes = require('./routes/sauces')
const userRoutes = require('./routes/user');
// const auth = require('./middleware/auth');
const Thing = require('../backend/models/Thing');

mongoose.connect('mongodb+srv://eliaslelievre792:9mITmulNRtSpKpHc@cluster0.w8ntftc.mongodb.net/?retryWrites=true&w=majority',
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));


app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
  });

app.get('/api/sauces/:id', (req, res, next) => {
  Thing.findOne({ _id: req.params.id })//findOne() retourne un seul Thing basé sur la fonction de comparaison qu'on lui passe
    .then(thing => res.status(200).json(thing))
    .catch(error => res.status(404).json({ error }));
});

app.get('/api/sauces', (req, res, next) => {
  Thing.find()
    .then(things => res.status(200).json(things))
    .catch(error => res.status(400).json({ error }));
});


// app.use(bodyParser.json());
app.use(cors())

app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use('/api/sauces', saucesRoutes);
app.use('/api/auth', userRoutes);
app.use('/images', express.static(path.join(__dirname, "images")));

module.exports = app;