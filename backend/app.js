const express = require('express');
const bodyParser = require('body-parser');

const app = express();

const sauceRoutes = require('./routes/sauces')

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});

const mongoose = require('mongoose');
mongoose.connect('mongodb+srv://lau:sc4dXJbm9KgmB2V@cluster0.mkvl6.mongodb.net/<dbname>?retryWrites=true&w=majority',
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

app.use(bodyParser.json());


app.use('/api/sauces', sauceRoutes);


module.exports = app;



