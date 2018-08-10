/**
 * Import du modele de donnée User
 */
const User = require('../../models/user');

module.exports = function (routerAPI) {
    return routerAPI.route('/users')
        .post((req, res) => {
            var user = new User();
            user.type = req.body.type;
            user.save((err) => {
                if (err) {
                    res.send(err);
                }
                res.json({ message: `User ajoutée ! ${user}` });
            })
        })
        .get((req, res) => {
            User.find((err, user) =>{
                if (err) {
                    res.send(err);
                }
                res.json(user);
            });
        });
}