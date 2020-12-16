const bcrypt = require('bcryptjs');
const { layout } = require('../utils')
const { User } = require('../models');

const newUser = (req, res) => {
    res.render('login-form', {
        locals: {
            title: 'Sign up'
        },
        ...layout
    });
};

const processNewUser = async (req, res) => {
    const { username, password } = req.body;
    console.log(username, password);
    if (username == '' || password == '') {
        // Really should give the user a message
        console.log('username or password is blank', req.baseUrl);
        res.redirect(`${req.baseUrl}/new`);
    } else {
        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(password, salt);
        try {
            const newUser = await User.create({
                username,
                hash
            });
            res.redirect(`${req.baseUrl}/login`);
        } catch (e) {
            // e.name will be "SequelizeUniqueConstraintError"
            console.log(e.name);
            if (e.name === "SequelizeUniqueConstraintError") {
                // We should tell the user that the username is taken
                // and then redirect them
            }
            res.redirect(`${req.baseUrl}/new`);
        }
    }
};

const login = (req, res) => {
    res.render('login-form', {
        locals: {
            title: 'Log in'
        },
        ...layout
    });
};

const processLogin = async (req, res) => {
    const { username, password } = req.body;
    // Get the entire User object from the database
    const user = await User.findOne({
        where: {
            username
        }
    });
    if (user) {
        console.log('valid user...checking password');
        const isValid = bcrypt.compareSync(password, user.hash);
        if (isValid) {
            console.log('password is good!');
            // Save some information about the user in their
            // session - "activate their magic band"

            // req.session is added to the request by the session middleware
            req.session.user = {
                username,           // so we can greet them
                id: user.id         // so I can pull their content on another page
            };
            // We save the session (which is really just a file on the server)
            req.session.save(() => {
                // Only after the saving has finished, then we redirect them.
                res.redirect('/members-only');      
            });

        } else {
            console.log('but password is wrong');
            res.redirect(`${req.baseUrl}/login`);
        }
    } else {
        console.log('not a valid user');
        res.redirect(`${req.baseUrl}/login`);
    }
};

const logout = (req, res) => {
    console.log('logging out...');
    req.session.destroy(() => {
        // After deleting session:
        res.redirect('/');
    });
};


module.exports = {
    newUser,
    processNewUser,
    login,
    processLogin,
    logout
};
