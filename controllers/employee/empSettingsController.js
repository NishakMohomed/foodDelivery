const User = require("../../model/user");
const bcrypt = require('bcryptjs');

function empSettingsController() {
    return {
        index(req, res) {
            res.render('employee/settings');
        },
        async account(req, res) {
            const emp = await  User.findById(req.params.id);
            res.render('employee/accSettings',{emp});
        },
        async accountUpdate(req, res) {
            let employeeId = req.params.id;
            const {email, phone, address} = req.body;

            //Validation request
            if(!email || !phone || !address) {
                req.flash('error', 'All fields are required!');
                req.flash('email', email);
                req.flash('phone', phone);
                req.flash('address', address); 
                return res.redirect('/empSettings/account/'+employeeId);
            }

            //Check if email already exist
            const emailExist =  await User.exists({email: email});
            const userDetails = await User.findById(employeeId);

            if(emailExist && userDetails.email != email){
                req.flash('error', 'Email already taken!');
                req.flash('email', email);
                req.flash('phone', phone);
                req.flash('address', address); 
                return res.redirect('/empSettings/account/'+employeeId);
            }

            let updatedData = {
                email: req.body.email,
                phone: req.body.phone,
                address: req.body.address
            };

            User.findByIdAndUpdate(employeeId, {$set: updatedData})
            .then(() => {
                req.flash('success', 'details successfully changed!');
                res.redirect('/empSettings/account/'+employeeId);
            }).catch(err => {
                res.json({
                    message: 'Something went wrong!'
                })
            })
        },
        async password(req, res) {
            const emp = await User.findById(req.params.id);
            res.render('employee/accPassword', { emp });
        },
        async passwordUpdate(req, res) {
            let employeeId = req.params.id;
            const {oldPassword, newPasswordOne, newPasswordTwo} = req.body;

            //Validation request
            if(!oldPassword || !newPasswordOne || !newPasswordTwo) {
                req.flash('error', 'All fields are required!');
                return res.redirect('/empsettings/password/'+employeeId);
            }

            //Validate old password
            const user = await User.findById(employeeId);

            //Validate the user typed old password with actual password
            const validatePassword = await bcrypt.compare(oldPassword, user.password);

            if(!validatePassword) {

                req.flash('error', 'Old password does not match!');
                return res.redirect('/empsettings/password/'+employeeId);

            } else if(newPasswordOne != newPasswordTwo) {

                req.flash('error', 'new passwords does not match!');
                return res.redirect('/empsettings/password/'+employeeId);

            } else {
                const hashedNewPassword = await bcrypt.hash(newPasswordTwo, 10);

                User.findByIdAndUpdate(employeeId,{password: hashedNewPassword})
                .then(() => {
                    req.flash('success', 'password successfully changed!');
                    res.redirect('/empsettings/password/'+employeeId);
                }).catch(err => {
                    res.json({
                        message: 'Something went wrong!'
                    })
                })
            }
        }
    }
}

module.exports = empSettingsController;