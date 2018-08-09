module.exports = function (routerAPI) {
    return routerAPI
        .get('/', (req, res) => {
            res.json({ message: 'Ceci ne fait pas partie de l\'API' });
        });
}