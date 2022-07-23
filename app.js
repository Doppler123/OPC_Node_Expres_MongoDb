// Ce fichier est relatif à notre application Express (que nous allons créer ici):

const express = require('express');

// Importation de mongoose dans le fichier app.js en ajoutant la constante suivante :
const mongoose = require('mongoose');

const app = express();

mongoose.connect('mongodb+srv://Doppler123:pDfisWmfNbGtILXW@cluster0.o9nitgb.mongodb.net/?retryWrites=true&w=majority',
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));


app.use(express.json()); // Pour gérer la requête POST venant de l'application front-end, 
//on a besoin d'en extraire le corps JSON avec ce middleware très simple mis à disposition par le framework Express

// Avec ceci, Express prend toutes les requêtes qui ont comme Content-Type  application/json  et met à disposition leur body  directement 
// sur l'objet req, ce qui nous permet d'écrire le middleware POST suivant :

app.post('/api/stuff', (req, res, next) => {
  console.log(req.body);
  res.status(201).json({
    message: 'Objet créé !'
  });
});

// Veillez à :
// soit modifier la méthode  use  en  get  pour le middleware des requêtes GET ;
// soit placer la route POST au-dessus du middleware pour les requêtes GET, car la logique GET 
// interceptera actuellement toutes les requêtes envoyées à votre endpoint /api/stuff , 
// étant donné qu'on ne lui a pas indiqué de verbe spécifique. 
// Placer la route POST au-dessus interceptera les requêtes POST, en les empêchant d'atteindre le middleware GET.

// Une application Express contient des middlewares :
// 1 middleware = 1 fonction dans une application express qui reçoit la requête et la réponse, qui les gère et qui peut ensuite passer l'éxécution à un prochain middleware 

// Nous ajoutons des headers à notre objet "response" pour permettre permettra aux 2 origine de communiquer entre elles
// (soit localhost:3000 et localhost:4200).
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

app.use('/api/stuff', (req, res, next) => {

// on passe en paramètre de la méthode "use" un string correspondant à la route pour laquelle nous souhaitons enregistrer 
// cet élément de middleware. Dans ce cas, cette route sera http://localhost:3000/api/stuff , 
// car il s'agit de l'URL demandée par l'application front-end.
  
const stuff = [ // Dans ce middleware, nous créons un groupe d'articles avec le schéma de données spécifique requis par le front-end.
    {
      _id: 'oeihfzeoi',
      title: 'Mon premier objet',
      description: 'Les infos de mon premier objet',
      imageUrl: 'https://cdn.pixabay.com/photo/2019/06/11/18/56/camera-4267692_1280.jpg',
      price: 4900,
      userId: 'qsomihvqios',
    },
    {
      _id: 'oeihfzeomoihi',
      title: 'Mon deuxième objet',
      description: 'Les infos de mon deuxième objet',
      imageUrl: 'https://cdn.pixabay.com/photo/2019/06/11/18/56/camera-4267692_1280.jpg',
      price: 2900,
      userId: 'qsomihvqios',
    },
  ];
  res.status(200).json(stuff); // Nous envoyons ensuite ces articles sous la forme de données JSON, avec un code 200 pour une demande réussie.
});

module.exports = app;

