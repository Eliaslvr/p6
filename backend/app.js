const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path');
const cors = require('cors');
const helmet = require('helmet');


const app = express();
const router = express.Router();
app.use(helmet());
app.use(express.json());
app.use(cors());

const saucesRoutes = require('./routes/sauces')
const userRoutes = require('./routes/user');
const auth = require('./middleware/auth');
const Thing = require('../backend/models/Thing');

// mongoose.connect('mongodb+srv://apiDevi:apiDevi_apiDevi@atlascluster.tlro8d0.mongodb.net/?retryWrites=true&w=majority',
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
  Thing.findOne({ _id: req.params.id })
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