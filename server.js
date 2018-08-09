/**
 * Import des packages
 */
const dbConfig = require('./config/db.conf')();
const serverConfig = require('./config/server.conf');
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

/**
 * Configuration au server mongoDB
 */
mongoose.connect(dbConfig.connectUrl, { useNewUrlParser: true });

/**
 * Ecouteur lié à l'objet mongoose
 */
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'Erreur de connection à la BDD'));
db.once('open', function () {
    console.log(`Connection à la BDD`);
});

/**
 * Instanciation de express pour creer notre application
 */
const app = express();

/**
 * constantes de l'application
 */
const port = process.env.PORT || 3000;

/**
 * Instanciation d'un router express pour la gestion de notre API
 */
const routerAPI = express.Router();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


/**
 * Ajout de route à routerAPI
 */
require("./routes/api/api.route")(routerAPI);
require("./routes/api/items.route")(routerAPI);

/**
 * Liaison de la route api avec le routerAPI
 */
app.use('/api', routerAPI);

/**
 * Ecoute de l'application sur le port défini dans la constante port
 */
app.listen(serverConfig.port, () => {
    console.log(`Ecoute sur le port ${serverConfig.port}`)
})
