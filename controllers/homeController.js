const Menu = require('../model/menu');
const Feedback = require('../model/feedback')

function homeController() {
    return {

        async index(req, res) {

            const menuItems = await Menu.find();
            const feedback = await Feedback.find().sort({_id: -1}).limit(3);
            const feedbackCount = await Feedback.count();

            return res.render('customer/home', {menuItems: menuItems, feedback: feedback, feedbackCount: feedbackCount});

            // Menu.find().then(function(menuItems) {
            //     console.log(menuItems)
            //     return res.render('home', {menuItems: menuItems})
            // });
        }
    }
}

module.exports = homeController;