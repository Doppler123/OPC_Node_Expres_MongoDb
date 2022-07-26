// Ce fichier est relatif à notre application Express :
const express = require('express');

// Une application Express contient des middlewares :
// 1 middleware = 1 fonction dans une application express qui reçoit la requête et la réponse, qui les gère et qui peut ensuite passer l'éxécution à un prochain middleware 

const bodyParser = require('body-parser');

// Le package Mongoose facilite les interactions entre une application Express et une base de données MongoDB
// Il permet d'implémenter des schémas de données stricts qui permettent de rendre notre application plus robutste
// Importation de mongoose dans le fichier stuff.js en ajoutant la constante suivante :
const mongoose = require('mongoose');

// Nous devons désormais enregistrer notre nouveau routeur dans notre fichier app.js . D'abord, nous devons l'importer :
const stuffRoutes = require('./routes/stuff');

// On importe le routeur relatif aux utilisateurs :
const userRoutes = require('./routes/user');

// On réalise une nouvelle importantion pour accéder au path de notre serveur :
const path = require('path');

mongoose.connect('mongodb+srv://Doppler123:pDfisWmfNbGtILXW@cluster0.o9nitgb.mongodb.net/?retryWrites=true&w=majority',
  {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

//app.use(express.json()); // Pour gérer la requête POST venant de l'application front-end, 
//on a besoin d'en extraire le corps JSON avec ce middleware très simple mis à disposition par le framework Express

const app = express();

// Nous ajoutons ci-dessous des headers à notre objet "response" pour permettre aux 2 origines de communiquer entre elles
// Cela permettra d'éviter l'erreur de CORS (« Cross Origin Resource Sharing »), système de sécurité qui bloque par défault
// les appels HTTP entre serveurs différents,  ce qui empêche donc les requêtes malveillantes d'accéder à des ressources sensibles.
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  // On accède à notre API depuis n'importe quelle origine ( '*' ) ;
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  // On ajoute les headers mentionnés aux requêtes envoyées vers notre API (Origin , X-Requested-With , etc.) ;
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  // On envoye des requêtes avec les méthodes mentionnées ( GET ,POST , etc.).
  next();
});

app.use(bodyParser.json());

// On ajoute ce gestionnaire de routage :
app.use('/images', express.static(path.join(__dirname, 'images'))); // On configure serveur pour renvoyer des fichiers statiques pour une route donnée avec  express.static() et  path.join()

// On enregistre notre routeur pour toutes les demandes effectuées vers /api/stuff :
app.use('/api/stuff', stuffRoutes); 

// On enregistre le routeur relatif aux utilisateurs :
app.use('/api/auth', userRoutes);

module.exports = app;