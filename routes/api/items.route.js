/**
 * Import du modele de donnée Item
 */
const Item = require('../../models/item');

module.exports = function (routerAPI) {
    return routerAPI.route('/items')
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

    routerAPI.route('/items/:item_id')
        .get((req, res) => {
            Item.findById(req.params.item_id, (err, item) => {
                if (err) {
                    res.send(err)
                }
                res.json(item);
            })
        })
        .put((req, res) => {
            Item.findById(req.params.item_id, (err, item) => {
                if (err) {
                    res.send(err);
                }
                item.type = req.body.type;
                item.save(function (err) {
                    if (err) {
                        res.send(err);
                    }
                    res.json({ message: `Item mis à jour ! ${item}` });
                });

            })
        })
        .delete((req, res) => {
            Item.remove({ _id: req.params.item_id }, (err, item) => {
                if (err) {
                    res.send(err);
                }
                res.json({ message: `Item supprimé ! ${req.params.item_id}` })
            });
        })
}