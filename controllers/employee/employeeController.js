const Order = require('../../model/order');
const Menu = require('../../model/menu');

function employeeController(){
    return{
        async index(req, res){
            const menu = await Menu.find().sort({_id: -1});
            Order.count({status: {$nin: ['delivered']}}, (err, docCount) => {
                res.render('employee/dashboard', {orderCount: docCount,menuItems: menu});
            });
            //res.render('employee/dashboard', {menuItems: menu});
        },
        orders(req, res){
            Order.find({ status: {$ne: 'completed'}}, null, {sort: {'createdAt': -1}}).
            populate('customerId', '-password').exec((err, orders) => {
                if(req.xhr){
                    res.json(orders);
                } else{
                    res.render('employee/orders');
                }
                
            });
        }
    }
}

module.exports = employeeController;