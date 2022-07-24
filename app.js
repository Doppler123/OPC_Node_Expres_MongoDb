// Ce fichier est relatif à notre application Express (que nous allons créer ici):

const express = require('express');

// Une application Express contient des middlewares :
// 1 middleware = 1 fonction dans une application express qui reçoit la requête et la réponse, qui les gère et qui peut ensuite passer l'éxécution à un prochain middleware 

// Le package Mongoose facilite les interactions entre une application Express et une base de données MongoDB
// Il permet d'implémenter des schémas de données stricts qui permettent de rendre notre application plus robutste
// Importation de mongoose dans le fichier app.js en ajoutant la constante suivante :
const mongoose = require('mongoose');

// pour pouvoir utiliser notre modèle Mongoose dans l'application, nous l'importons ici :
const Thing = require('./models/thing');

const app = express();

mongoose.connect('mongodb+srv://Doppler123:pDfisWmfNbGtILXW@cluster0.o9nitgb.mongodb.net/?retryWrites=true&w=majority',
  {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

app.use(express.json()); // Pour gérer la requête POST venant de l'application front-end, 
//on a besoin d'en extraire le corps JSON avec ce middleware très simple mis à disposition par le framework Express

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

// Avec ceci, Express prend toutes les requêtes qui ont comme Content-Type  application/json  et met à disposition leur body  directement 
// sur l'objet req, ce qui nous permet d'écrire le middleware POST suivant :
app.post('/api/stuff', (req, res, next) => {
  console.log(req.body);
  console.log(req.body._id);
  delete req.body._id;
  const thing = new Thing({   // on créé une instance du modèle Thing en lui passant un objet JavaScript contenant toutes les informations requises du corps de requête analysé 
    // (en ayant supprimé en amont le faux_id envoyé par le front-end).
    // NB : l'utilisation du mot-clé "new" avec un modèle Mongoose crée par défaut un champ "_id"
    ...req.body  // l'opérateur spread "..." est utilisé pour faire une copie de tous les éléments de "req.body"
  });
  thing.save()  // ce modèle comporte une méthode "save() qui enregistre simplement votre "Thing" dans la base de données. La mtéhode "save()" renvoie une promise
    .then(() => res.status(201).json({ message: 'Objet enregistré !' }))
    .catch(error => res.status(400).json({ error }));
});
// Veillez à :
// soit modifier la méthode  use  en  get  pour le middleware des requêtes GET ;
// soit placer la route POST au-dessus du middleware pour les requêtes GET, car la logique GET 
// interceptera actuellement toutes les requêtes envoyées à votre endpoint /api/stuff , 
// étant donné qu'on ne lui a pas indiqué de verbe spécifique. 
// Placer la route POST au-dessus interceptera les requêtes POST, en les empêchant d'atteindre le middleware GET (soit localhost:3000 et localhost:4200)

app.put('/api/stuff/:id', (req, res, next) => {
  Thing.updateOne({ _id: req.params.id }, { ...req.body, _id: req.params.id }) //  nous exploitons la méthode updateOne() dans notre modèle Thing . 
                                      // Cela nous permet de mettre à jour le Thing qui correspond à l'objet que nous passons comme premier argument. 
                                      // Nous utilisons aussi le paramètre id passé dans la demande, et le remplaçons par le Thing passé comme second argument.
    .then(() => res.status(200).json({ message: 'Objet modifié !'}))
    .catch(error => res.status(400).json({ error }));
});

app.delete('/api/stuff/:id', (req, res, next) => { 
  Thing.deleteOne({ _id: req.params.id }) // La méthode deleteOne() de notre modèle fonctionne comme findOne() et updateOne() 
    .then(() => res.status(200).json({ message: 'Objet supprimé !'}))
    .catch(error => res.status(400).json({ error }));
});

app.get('/api/stuff/:id', (req, res, next) => { //nous utilisons la méthode get() pour répondre uniquement aux demandes GET à cet endpoint (la méthode use() a un usage moins spécifique)
  // nous utilisons deux-points : en face du segment dynamique de la route pour la rendre accessible en tant que paramètre 
  Thing.findOne({ _id: req.params.id }) // nous utilisons ensuite la méthode findOne() dans notre modèle Thing pour trouver le Thing unique ayant le même _id que le paramètre de la requête 
    .then(thing => res.status(200).json(thing)) // ce Thing est ensuite retourné dans une Promise et envoyé au front-end 
    .catch(error => res.status(404).json({ error })); // si aucun Thing n'est trouvé ou si une erreur se produit, nous envoyons une erreur 404 au front-end, avec l'erreur générée
});

// on passe en paramètre de la méthode get() un string correspondant à la route pour laquelle nous souhaitons enregistrer cet élément de middleware. 
// Dans ce cas, cette route sera http://localhost:3000/api/stuff , car il s'agit de l'URL demandée par l'application front-end.
app.get('/api/stuff', (req, res, next) => {
  Thing.find() // nous utilisons la méthode find() dans notre modèle Mongoose afin de renvoyer un tableau contenant tous les Things dans notre base de données. 
    // À présent, si vous ajoutez un Thing , il doit s'afficher immédiatement sur votre page d'articles en vente.
    .then(things => res.status(200).json(things))   // Nous envoyons ensuite ces articles sous la forme de données JSON, avec un code 200 pour une demande réussie.
    .catch(error => res.status(400).json({ error }));
});


module.exports = app;

