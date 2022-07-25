// Un fichier de contrôleur exporte des méthodes qui sont ensuite attribuées aux routes pour améliorer la maintenabilité de votre application.
// Un fichier de contrôleur contient la logique métier pour une ou plusieurs routes et sont généralement importés par les routeurs, qui attribuent cette logique aux routes spécifiques.

// pour pouvoir utiliser notre modèle Mongoose dans l'application, nous l'importons ici :
const Thing = require('../models/thing');  // attention Thing?

// Avec ceci, Express prend toutes les requêtes qui ont comme Content-Type  application/json  et met à disposition leur body  directement 
// sur l'objet req, ce qui nous permet d'écrire le middleware POST suivant :
exports.createThing = (req, res, next) => { // Ici, nous exposons la logique de notre route POST en tant que fonction appelée createThing() . 
    // Pour réimplémenter cela dans notre route, nous devons importer notre contrôleur puis enregistrer createThing
    const thing = new Thing({   // on créé une instance du modèle Thing en lui passant un objet JavaScript contenant toutes les informations requises du corps de requête analysé 
        // (en ayant supprimé en amont le faux_id envoyé par le front-end).
        // NB : l'utilisation du mot-clé "new" avec un modèle Mongoose crée par défaut un champ "_id"
        title: req.body.title,
        description: req.body.description,
        imageUrl: req.body.imageUrl,
        price: req.body.price,
        userId: req.body.userId
    });
    thing.save()  // ce modèle comporte une méthode "save() qui enregistre simplement votre "Thing" dans la base de données. La mtéhode "save()" renvoie une promise
        .then(() => res.status(201).json({ message: 'Objet enregistré !' }))
        .catch(error => res.status(400).json({ error }));
};
// Veillez à :
// soit modifier la méthode  use  en  get  pour le middleware des requêtes GET ;
// soit placer la route POST au-dessus du middleware pour les requêtes GET, car la logique GET 
// interceptera actuellement toutes les requêtes envoyées à votre endpoint /api/stuff, 
// étant donné qu'on ne lui a pas indiqué de verbe spécifique. 
// Placer la route POST au-dessus interceptera les requêtes POST, en les empêchant d'atteindre le middleware GET (soit localhost:3000 et localhost:4200)

exports.getOneThing = (req, res, next) => { //nous utilisons la méthode get() pour répondre uniquement aux demandes GET à cet endpoint (la méthode use() a un usage moins spécifique)
    // nous utilisons deux-points : en face du segment dynamique de la route pour la rendre accessible en tant que paramètre 
    Thing.findOne({ _id: req.params.id }) // nous utilisons ensuite la méthode findOne() dans notre modèle Thing pour trouver le Thing unique ayant le même _id que le paramètre de la requête 
        .then(thing => res.status(200).json(thing)) // ce Thing est ensuite retourné dans une Promise et envoyé au front-end 
        .catch(error => res.status(404).json({ error })); // si aucun Thing n'est trouvé ou si une erreur se produit, nous envoyons une erreur 404 au front-end, avec l'erreur générée
};

exports.modifyThing = (req, res, next) => {
    const thing = new Thing({
        _id: req.params.id,
        title: req.body.title,
        description: req.body.description,
        imageUrl: req.body.imageUrl,
        price: req.body.price,
        userId: req.body.userId
    });
    Thing.updateOne({ _id: req.params.id }, thing) //  nous exploitons la méthode updateOne() dans notre modèle Thing . 
        // Cela nous permet de mettre à jour le Thing qui correspond à l'objet que nous passons comme premier argument. 
        // Nous utilisons aussi le paramètre id passé dans la demande, et le remplaçons par le Thing passé comme second argument.
        .then(() => res.status(200).json({ message: 'Objet modifié !' }))
        .catch(error => res.status(400).json({ error }));
};

exports.deleteThing = (req, res, next) => { 
    Thing.deleteOne({ _id: req.params.id }) // La méthode deleteOne() de notre modèle fonctionne comme findOne() et updateOne() 
      .then(() => res.status(200).json({ message: 'Objet supprimé !'}))
      .catch(error => res.status(400).json({ error }));
  };

// on passe en paramètre de la méthode get() un string correspondant à la route pour laquelle nous souhaitons enregistrer cet élément de middleware. 
// Dans ce cas, cette route sera http://localhost:3000/api/stuff , car il s'agit de l'URL demandée par l'application front-end.
exports.getAllStuff = (req, res, next) => {
    Thing.find() // nous utilisons la méthode find() dans notre modèle Mongoose afin de renvoyer un tableau contenant tous les Things dans notre base de données. 
      // À présent, si vous ajoutez un Thing , il doit s'afficher immédiatement sur votre page d'articles en vente.
      .then(things => res.status(200).json(things))   // Nous envoyons ensuite ces articles sous la forme de données JSON, avec un code 200 pour une demande réussie.
      .catch(error => res.status(400).json({ error }));
  };