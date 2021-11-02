const User = require('../model/user');
const bcrypt = require('bcryptjs');
const passport = require('passport');

function authController() {

    //Redirect method
    const _getRedirectUrl = (req) => {
        //return req.user.role === 'admin' ? '/admin/dashboard' : '/customer/viewOrders'

        if(req.user.role === 'admin'){
            return '/admin/dashboard';
        } else if(req.user.role === 'employee'){
            return '/employee/dashboard';
        } else{
            return '/customer/viewOrders';
        }
    }

    return {
        login(req, res){
            res.render('customer/login');
        },
        postLogin(req, res, next){
            passport.authenticate('local', (err, user, info) => {
                if(err){
                    req.flash('error', info.message);
                    return next(err);
                }

                if(!user){
                    req.flash('error', info.message);
                    return res.redirect('/login');
                }

                req.logIn(user, (err) => {
                    if(err){
                        req.flash('error', info.message);
                        return next(err);
                    }
                    
                    return res.redirect(_getRedirectUrl(req));
                });
            })(req, res, next);
        },
        register(req, res){
            res.render('customer/register');
        },
        async postRegister(req, res) {
            const {fname, lname, email, password } = req.body;

            //Validation request
            if(!fname || !lname || !email || !password) {
                req.flash('error', 'All fields are required!');
                req.flash('fname', fname);
                req.flash('lname', lname);
                req.flash('email', email);
                return res.redirect('/register');
            }


            //Check if email already exist
            User.exists({email: email},(err, result) => {
                if(result){
                    req.flash('error', 'Email already taken');
                    req.flash('fname', fname);
                    req.flash('lname', lname);
                    req.flash('email', email); 
                    return res.redirect('/register');
                }
            });

            //Hash the password
            const hashedPassword = await bcrypt.hash(password, 10)

            //Create a user
            const user = new User({
                fname,
                lname,
                email,
                password: hashedPassword
            });

            user.save().then((user) => {
                //Login
                return res.redirect('/');

            }).catch(err => {
                req.flash('error', 'Something went wrong');
                return res.redirect('/register');

            });
        },
        logout(req, res) {
            req.logout();
            return res.redirect('/login');
        }
    }
}

module.exports = authController;