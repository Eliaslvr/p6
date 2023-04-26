const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path');
const cors = require('cors');
const helmet = require('helmet')


const app = express();
app.use(helmet());
app.use(express.json());
app.use(cors());

const stuffRoutes = require('./routes/stuff')
const userRoutes = require('./routes/user');
const auth = require('./middleware/auth');

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
// app.use((req, res) => {
//   res.json(auth); 
// });
// app.use((req, res) => {
//   res.json({ message: 'sdlcnodnco'}); 
// });

app.use('/api/sauces', (req, res, next) => {
  let sauces = "./models/Thing.js";
  res.status(200).json(sauces);
});

app.use(bodyParser.json());
// app.use(cors())
 
app.use('/api/sauces', stuffRoutes);
app.use('/api/auth', userRoutes);
app.use('/images', express.static(path.join(__dirname, 'images')));

module.exports = app;