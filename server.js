/**
 * Import des packages
 */
const dbConfig = require('./config/db.conf');
const serverConfig = require('./config/server.conf');
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
var morgan = require('morgan');
var jwt = require('jsonwebtoken');
/**
 * Instanciation de express pour creer notre application
 */
const app = express();

app.set('superSecret', serverConfig.secret);

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
 * Utilisation de morgan pour logguer les requetes dans la console
 */
app.use(morgan('dev'));


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
require("./routes/api/users.route")(routerAPI);


const User = require('./models/user');
routerAPI.route('/auth')
    .post((req, res) => {
        User.findOne(
            {
                email: req.body.email
            },
            (err, user) => {
                if (err) throw err;
                if (!user) {
                    res.status(404);
                    res.json({
                        message: `L'utilisateur avec l'email "${req.body.email}" n'existe pas`
                    })
                } else if (user && user.password != req.body.password) {
                    res.status(500);
                    res.json({
                        message: `Le mot de passe entré n'est pas le bon`
                    })
                } else {
                    const payload = {
                        admin: user.role
                    };
                    var token = jwt.sign(payload, app.get('superSecret'), {
                        expiresIn: "2 days"
                    });
                    res.json({
                        token: token
                    });
                }
            })
    });


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
