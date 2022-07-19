
const express = require('express');

const app = express();

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

module.exports = app;