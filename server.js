/**
 * Import des packages
 */
const dbConfig = require('./config/db.conf');
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

/**
 * Import des modeles de données
 */
const Item = require('./models/item');

/**
 * Configuration au server mongoDB
 */
const connectUrlMongoose = `${dbConfig.protocol}://${dbConfig.login}:${dbConfig.mdp}@${dbConfig.url}/demo`;
mongoose.connect("mongodb://admin:dbpassword2010@ds217092.mlab.com:17092/demo", { useNewUrlParser: true });

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

routerAPI.get('/', (req, res) => {
    res.json({ message: 'Ceci ne fait pas partie de l\'API' });
});

/**
 * Ajout de route à routerAPI
 */

routerAPI.route('/items')
    .post((req, res) => {
        var item = new Item();
        item.type = req.body.type;
        item.save((err) => {
            if (err) {
                res.send(err);
            }
            res.json({ message: `Item ajoutée ! ${item}` });
        })
    })
    .get(function (req, res) {
        Item.find(function (err, item) {
            if (err) {
                res.send(err);
            }
            res.json(item);
        });
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
