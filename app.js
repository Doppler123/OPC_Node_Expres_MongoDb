
const express = require('express');

const app = express();

/* 
// Cette application Express contient quatre éléments de middleware :
// 1 middleware = 1 fonction dans une application express qui reçoit la requête et la réponse, qui les gère et qui peut ensuite passer l'éxécution à un prochain middleware 

app.use((req, res, next) => { // le premier enregistre « Requête reçue ! » dans la console et passe l'exécution ;
  console.log('Requête reçue !');
  next(); // sans cette ligne, on ne renvoit pas de réponse et la requête ne se termine pas
});

app.use((req, res, next) => { // le deuxième ajoute un code d'état 201 à la réponse et passe l'exécution ;
  res.status(201);
  next();
});

app.use((req, res, next) => { // le troisième envoie la réponse JSON et passe l'exécution ;
  res.json({ message: 'Votre requête a bien été reçue !' }); 
  next();
});

app.use((req, res, next) => { // le dernier élément de middleware enregistre « Réponse envoyée avec succès ! » dans la console.
  console.log('Réponse envoyée avec succès !');
});

module.exports = app; */


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
// cet élément de middleware. Dans ce cas, cette route serahttp://localhost:3000/api/stuff , 
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