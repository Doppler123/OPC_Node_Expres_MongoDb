// Un fichier de contrôleur exporte des méthodes qui sont ensuite attribuées aux routes pour améliorer la maintenabilité de votre application.
// Un fichier de contrôleur contient la logique métier pour une ou plusieurs routes et sont généralement importés par les routeurs, qui attribuent cette logique aux routes spécifiques.

const bcrypt = require('bcrypt');

const User = require('../models/user');

const jwt = require('jsonwebtoken');

exports.signup = (req, res, next) => {
  bcrypt.hash(req.body.password, 10) // nous appelons la fonction de hachage de bcrypt dans notre mot de passe et lui demandons de « saler » le mot de passe 10 fois. 
    // Plus la valeur est élevée, plus l'exécution de la fonction sera longue, et plus le hachage sera sécurisé. 
    .then(hash => {                  // Il s'agit d'une fonction asynchrone qui renvoie une Promise dans laquelle nous recevons le hash généré.
      const user = new User({
        email: req.body.email,
        password: hash
      });
      user.save()
        .then(() => res.status(201).json({ message: 'Utilisateur créé !' }))
        .catch(error => res.status(400).json({ error }));
    })
    .catch(error => res.status(500).json({ error }));
};

// Maintenant que nous pouvons créer des utilisateurs dans la base de données, 
// il nous faut une méthode permettant de vérifier si un utilisateur qui tente de se connecter dispose d'identifiants valides. Implémentons donc notre fonction login :

exports.login = (req, res, next) => {
  User.findOne({ email: req.body.email }) // Nous utilisons notre modèle Mongoose pour vérifier que l'e-mail entré par l'utilisateur correspond à un utilisateur existant de la BDD 
    .then(user => {
      if (!user) {                                                           // Si l'e-mail correspond à un utilisateur existant, nous continuons
        return res.status(401).json({ error: 'Utilisateur non trouvé !' }); // Dans le cas contraire, nous renvoyons une erreur401 Unauthorized
      }
      bcrypt.compare(req.body.password, user.password) // Nous utilisons la fonction compare de bcrypt pour comparer le mdp entré par l'utilisateur avec le hash enregistré dans la BDD
        .then(valid => {
          if (!valid) {
            return res.status(401).json({ error: 'Mot de passe incorrect !' }); // S'ils ne correspondent pas, nous renvoyons une erreur401 Unauthorized 
          }
          res.status(200).json({
            userId: user._id,
            token: jwt.sign( // Nous utilisons la fonction sign de jsonwebtoken pour chiffrer un nouveau token. 
            // Ce token contient l'ID de l'utilisateur en tant que payload (les données encodées dans le token).
              { userId: user._id },
              'RANDOM_TOKEN_SECRET', // Nous utilisons une chaîne secrète de développement temporaire RANDOM_SECRET_KEY pour crypter notre token 
              // (à remplacer par une chaîne aléatoire beaucoup plus longue pour la production). 
              // Puisque cette chaîne sert de clé pour le chiffrement et le déchiffrement du token, 
              // elle doit être difficile à deviner, sinon n’importe qui pourrait générer un token en se faisant passer pour notre serveur.
              { expiresIn: '24h' } // Nous définissons la durée de validité du token à 24 heures. L'utilisateur devra donc se reconnecter au bout de 24 heures.
            )
          });
          // S'ils correspondent, les informations d'identification de notre utilisateur sont valides. Dans ce cas, nous renvoyons une réponse 200 contenant l'ID utilisateur et un token. 
          // Ce token est une chaîne générique pour l'instant, mais nous allons le modifier et le crypter dans le prochain chapitre.
        })
        .catch(error => res.status(500).json({ error }));
    })
    .catch(error => res.status(500).json({ error }));
};