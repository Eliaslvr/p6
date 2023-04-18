const express = require('express');
// const bodyParser = require('body-parser');
const mongoose = require('mongoose');
// const cors = require('cors')
const app = express();
app.use(express.json());

// const stuffRoutes = require('./routes/stuff')
const userRoutes = require('./routes/user');
const auth = require('./middleware/auth');

mongoose.connect('mongodb+srv://Elias59:Elias591@cluster0.zhu8ine.mongodb.net/?retryWrites=true&w=majority',
// mongoose.connect('mongodb+srv://Elias59:<password>@cluster0.zhu8ine.mongodb.net/?retryWrites=true&w=majority',
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
// app.use(bodyParser.json());
// app.use(cors())
 
//app.use('/api/stuff', stuffRoutes);
app.use('/api/auth', userRoutes);

module.exports = app;