/**
 * Import des packages
 */

const dbConfig = require('./config/dbConfig');
const express = require('express');
const bodyParser = require('body-parser');
const mongoose   = require('mongoose');

/**
 * Configuration au server mongoDB
 */
mongoose.connect(`${dbConfig.protocol}://${dbConfig.login}:${dbConfig.mdp}@${dbConfig.url}/demo`);
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

routerAPI.get('/', (req, res) => {
    res.json({ message: 'Ma premiere page' });
});


/**
 * Liaison de la route api avec le routerAPI
 */
app.use('/api', routerAPI);

/**
 * Ecoute de l'application sur le port défini dans la constante port
 */
app.listen(port, () => {
    console.log(`Ecoute sur le port ${port}`)
})
