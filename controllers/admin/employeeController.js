const User = require("../../model/user");
const bcrypt = require('bcryptjs');


function employeeController(){
    return{
        index(req, res){
            User.find({role: {$nin: ['admin','customer']}}, null, {sort: {'createdAt': -1}})
            .then(response => {
                res.render('admin/employee', {employee: response});
            });
        },
        addEmployee(req, res){
            res.render('admin/addEmployee');
        },
        async store(req, res){

            const {fname, lname, gender, dob, nic, email, address, password, accType } = req.body;
            const image = req.file.filename;

            //Validation request
            if(!fname || !lname || !gender || !dob || !nic || !image || !email || !address || !password || !accType) {
                req.flash('error', 'All fields are required!');
                req.flash('fname', fname);
                req.flash('lname', lname);
                req.flash('gender', gender);
                req.flash('dob', dob);
                req.flash('nic', nic);
                req.flash('email', email);
                req.flash('address', address);
                return res.redirect('/employees/addEmployee');
            }

            //Check if email already exist
            User.exists({email: email},(err, result) => {
                if(result){
                    req.flash('error', 'Email already taken');
                    req.flash('fname', fname);
                    req.flash('lname', lname);
                    req.flash('gender', gender);
                    req.flash('dob', dob);
                    req.flash('nic', nic);
                    req.flash('email', email);
                    req.flash('address', address); 
                    return res.redirect('/employees/addEmployee');
                }
            });

            //Hash the password
            const hashedPassword = await bcrypt.hash(password, 10);

            let employee = new User({
                fname: req.body.fname,
                lname: req.body.lname,
                gender: req.body.gender,
                dob: req.body.dob,
                nic: req.body.nic,
                image: req.file.filename,
                email: req.body.email,
                phone: req.body.phone,
                address: req.body.address,
                password: hashedPassword,
                role: req.body.accType
                
            });

            employee.save().then((user) => {
                
                return res.redirect('/admin/employees');

            }).catch(err => {
                req.flash('error', 'Something went wrong');
                return res.redirect('/employees/addEmployee');

            });
        },
        async employee(req, res){
            const emp = await  User.findById(req.params.id);

            return res.render('admin/employeeUpdate', { emp });
        },
        async update(req, res){
            let employeeId = req.params.id;

            let updatedData = {
                fname: req.body.fname,
                lname: req.body.lname,
                nic: req.body.nic,
                email: req.body.email,
                phone: req.body.phone,
                address: req.body.address,
            }

            if(req.body.gender){
                updatedData.gender = req.body.gender
            }

            if(req.body.accType){
                updatedData.role = req.body.accType
            }

            if(req.file){
                updatedData.image = req.file.filename;
            }

            if(req.body.dob){
                updatedData.dob = req.body.dob;
            }

            if(req.body.password){
                //Hash the password
                const hashedPassword = await bcrypt.hash(password, 10);
                updatedData.password = hashedPassword;
            }

            User.findByIdAndUpdate(employeeId, {$set: updatedData})
            .then(() => {
                res.redirect('/admin/employees');
            }).catch(err => {
                res.json({
                    message: 'Something went wrong!'
                })
            })
        },
        delete(req, res, next){
            let employeeId = req.params.id;
            User.findByIdAndRemove(employeeId).then(() => {
                res.redirect('/admin/employees');
            }).catch(err => {
                req.json({
                    message: 'Something went wrong!'
                })
            })
        }
    }
}

module.exports = employeeController;