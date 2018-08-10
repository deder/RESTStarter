/**
 * Import du modele de donnée User
 */
const User = require('../../models/user');

module.exports = function (routerAPI) {
    routerAPI.route('/users')
        .post((req, res) => {
            var user = new User({
                email: req.body.email,
                password: req.body.password,
                role: 0
            });
            user.save((err) => {
                if (err) {
                    res.send(err);
                }
                res.json({ success: true });
            })
        })
        .get((req, res) => {
            User.find((err, user) => {
                if (err) {
                    res.send(err);
                }
                res.json(user);
            });
        });
}