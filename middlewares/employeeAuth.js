function employeeAuth(req, res, next){
    if(req.isAuthenticated() && req.user.role === 'cashier'){
        return next();
    }

    return res.redirect('/')
}

module.exports = employeeAuth;