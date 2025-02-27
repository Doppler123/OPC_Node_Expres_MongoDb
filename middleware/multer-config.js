// multer est un package de gestion de fichiers.
// Sa méthode diskStorage()  configure le chemin et le nom de fichier pour les fichiers entrants.
// Sa méthode single()  crée un middleware qui capture les fichiers d'un certain type (passé en argument), et les enregistre au système de fichiers du serveur à l'aide du storage configuré.

const multer = require('multer');

const MIME_TYPES = {
  'image/jpg': 'jpg',
  'image/jpeg': 'jpg',
  'image/png': 'png'
};

const storage = multer.diskStorage({ //Création d'une const storage, à passer à multer comme configuration, qui contient la logique pour indiquer à multer où enregistrer les fichiers entrants
  destination: (req, file, callback) => { // La fonction destination indique à multer d'enregistrer les fichiers dans le dossier images 
    callback(null, 'images');
  },
  filename: (req, file, callback) => { // La fonction filename indique à multer d'utiliser le nom d'origine, de remplacer les espaces par des underscores et d'ajouter un timestamp Date.now() 
                                       // comme nom de fichier. Elle utilise ensuite la constante dictionnaire de type MIME pour résoudre l'extension de fichier appropriée.
    const name = file.originalname.split(' ').join('_');
    const extension = MIME_TYPES[file.mimetype];
    callback(null, name + Date.now() + '.' + extension);
  }
});

module.exports = multer({storage: storage}).single('image');  // Nous exportons ensuite l'élément multer entièrement configuré, lui passons notre constante storage 
                                                             // et lui indiquons que nous gérerons uniquement les téléchargements de fichiers image.