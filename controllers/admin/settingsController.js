const User = require("../../model/user");
const bcrypt = require('bcryptjs');

function settingsController() {

    return {
        async index(req, res) {
            const admin = await User.findById(req.params.id);
            res.render('admin/settings',{ admin });
        },
        async settings(req, res){
            const admin = await User.findById(req.params.id);
            res.render('admin/accSettings',{ admin });
        },
        async accUpdate(req, res){
            let adminId = req.params.id;
            const { fname, lname, email } = req.body;

            //Validation request
            if(!fname || !lname || !email) {
                req.flash('error', 'All fields are required!');
                req.flash('fname', fname);
                req.flash('lname', lname);
                req.flash('email', email);
                return res.redirect('/settings/account/'+adminId);
            }

            //Check if email already exist
            const emailExist =  await User.exists({email: email});
            const adminDetails = await User.findById(adminId);

            if(emailExist && adminDetails.email != email){
                req.flash('error', 'Email already taken!');
                req.flash('fname', fname);
                req.flash('lname', lname);
                req.flash('email', email);
                return res.redirect('/settings/account/'+adminId);
            }

            let updatedData = {
                fname: req.body.fname,
                lname: req.body.lname,
                email: req.body.email,
            };

            User.findByIdAndUpdate(adminId, {$set: updatedData})
            .then(() => {
                req.flash('success', 'Details successfully changed!');
                res.redirect('/settings/account/'+adminId);
            }).catch(err => {
                res.json({
                    message: 'Something went wrong!'
                })
            })
        },
        async password(req, res) {
            const admin = await User.findById(req.params.id);
            res.render('admin/accPassword',{ admin });
        },
        async passwordUpdate(req, res) {
            let adminId = req.params.id;
            const {oldPassword, newPasswordOne, newPasswordTwo} = req.body;

            //Validation request
            if(!oldPassword || !newPasswordOne || !newPasswordTwo) {
                req.flash('error', 'All fields are required!');
                return res.redirect('/settings/password/'+adminId);
            }

            //Validate old password
            const user = await User.findById(adminId);

            //Validate the user typed old password with actual password
            const validatePassword = await bcrypt.compare(oldPassword, user.password);

            if(!validatePassword) {

                req.flash('error', 'Old password does not match!');
                return res.redirect('/settings/password/'+adminId);

            } else if(newPasswordOne != newPasswordTwo) {

                req.flash('error', 'new passwords does not match!');
                return res.redirect('/settings/password/'+adminId);

            } else {
                const hashedNewPassword = await bcrypt.hash(newPasswordTwo, 10);

                User.findByIdAndUpdate(adminId,{password: hashedNewPassword})
                .then(() => {
                    req.flash('success', 'Password successfully changed!');
                    res.redirect('/settings/password/'+adminId);
                }).catch(err => {
                    res.json({
                        message: 'Something went wrong!'
                    })
                })
            }
        }
    }
}

module.exports = settingsController;