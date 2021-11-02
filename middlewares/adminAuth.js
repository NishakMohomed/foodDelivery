function adminAuth(req, res, next){
    if(req.isAuthenticated() && req.user.role === 'admin'){
        return next();
    }

    return res.redirect('/')
}

module.exports = adminAuth;