const nodemailer = require('nodemailer');
const User = require("../../model/user");

function promoController() {

    return {
        index(req, res) {
            res.render('admin/promo');
        },
        sendPromo(req, res) {
            const promoDetails = req.body.promoDetails;

            User.find({promo: {$ne: false}}, {email: 1, _id: 0}).exec((err, records) => {
                records.forEach((email) => {

                    let transport = nodemailer.createTransport({
                        service: 'hotmail',
                        auth: {
                            user: process.env.EMAIL_ADDRESS,
                            pass: process.env.EMAIL_PASS
                        }
                    });

                    let mailOptions = {
                        from: process.env.EMAIL_ADDRESS,
                        to: email,
                        subject: 'Offer',
                        text: '',
                        html: promoDetails
                    };

                    transport.sendMail(mailOptions, (error, info) => {
                        if(error) {
                            return console.log(error);
                        }
                    }); 
                })
            });

            res.redirect('/admin/promotions')
        }
    }
}

module.exports = promoController;