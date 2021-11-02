const Menu = require('../../model/menu');


function productController(){

    return {
        index(req, res, next){
            Menu.find()
            .then(response => {
                // res.json({
                //     response
                // });
                res.render('admin/products', {menuItems: response});
            })
            .catch(err => {
                res.json({
                    message: 'Something went wrong!'
                });
            });
        },
        async product(req, res){
            const menu = await  Menu.findById(req.params.id);

            return res.render('admin/productUpdate', { menu });
        },
        addProduct(req, res){
            res.render('admin/addProducts');
        },
        store(req, res){
            let product = new Menu({
                name: req.body.name,
                image: req.file.filename,
                price: req.body.price
            });

            product.save().then(response => {
                res.redirect('/admin/products')
            }).catch(err => {
                res.json({
                    message: 'Smething went wrong!'
                });
            });
        },
        async update(req, res){
            let productId = req.params.id;

            let updatedData = {
                name: req.body.name,
                price: req.body.price
            }

            if(req.file){
                updatedData.image = req.file.filename;
            }

            Menu.findByIdAndUpdate(productId, {$set: updatedData})
            .then(() => {
                res.redirect('/admin/products');
            }).catch(err => {
                res.json({
                    message: 'Something went wrong!'
                })
            })
        },
        delete(req, res, next){
            let productId = req.params.id;
            Menu.findByIdAndRemove(productId).then(() => {
                res.redirect('/admin/products');
            }).catch(err => {
                req.json({
                    message: 'Something went wrong!'
                })
            })
        }
    }
}


module.exports = productController;