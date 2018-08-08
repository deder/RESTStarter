/**
 * Import des packages
 */
const express = require('express');
const bodyParser = require('body-parser');

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
const routerApi = express.Router(); 


app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

routerApi.get('/', (req, res) => {
    res.json({ message: 'Ma premiere page' });
});

app.use('/api', routerApi);

app.listen(port, () => {
    console.log(`Ecoute sur le port ${port}`)
})
