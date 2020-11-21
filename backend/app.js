const express = require('express');

const app = express();

app.use((req, res) => {
    res.json({ message: 'Votre requête a bien été reçue !' }); 
 });

module.exports = app;

const mongoose = require('mongoose');
mongoose.connect('mongodb+srv://lau:<sc4dXJbm9KgmB2V>@cluster0.mkvl6.mongodb.net/<dbname>?retryWrites=true&w=majority',
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));