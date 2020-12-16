

const requireLogin = (req, res, next) => {
    if (req.session.user) {
        console.log('===============================');
        console.log('requireLogin() says there is a user session');
        next();
    } else {
        console.log('===============================');
        console.log('YOU SHALL NOT PASS');
        res.redirect('/unauthorized');
    }
}

module.exports = {
    requireLogin
};
