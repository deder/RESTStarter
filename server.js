/**
 * Import des packages
 */
const dbConfig = require('./config/db.conf');
const serverConfig = require('./config/server.conf');
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const morgan = require('morgan');
const jwt = require('jsonwebtoken');
const urlsSansToken = ['/auth'];
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
const db = mongoose.connection;
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

// Virification du token
routerAPI.use((req, res, next) =>{
    if (urlsSansToken.indexOf(req.url) > -1) return next();
        // check header or url parameters or post parameters for token
        const token = req.body.token || req.query.token || req.headers['x-access-token'];
    
        // decode token
        if (token) {
    
            // verifies secret and checks exp
            jwt.verify(token, app.get('superSecret'), function (err, decoded) {
                if (err) {
                    return res.status(500).json({ 
                        message: `Erreur d'authentification`
                    });
                } else {
                    // if everything is good, save to request for use in other routes
                    req.decoded = decoded;
                    next();
                }
            });
    
        } else {
    
            // if there is no token
            // return an error
            return res.status(403).send({
                message: `Erreur d'authentification`
            });
    
        }
    });


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
                    const token = jwt.sign(payload, app.get('superSecret'), {
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
