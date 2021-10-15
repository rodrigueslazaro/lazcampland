const User = require('../models/user');
const m = module.exports;

m.renderRegister = (req, res) => {
    res.render('users/register');
}

m.register = async(req, res, next) => {
    try {
        const { email, username, password } = req.body;
        const user = new User({email, username});
        const registeredUser = await User.register(user, password);
        req.login(registeredUser, err => {
            if(err) return next(err);
            req.flash('success', 'Welcome to YelpCamp!');
            res.redirect('/campgrounds');
        });

    } catch(e) {
        req.flash('error', e.message);
        res.redirect('register');
    }
}

m.renderLogin = (req, res) => {
    res.render('users/login');
}

m.login = (req, res) => {
    req.flash('success', 'Welcome back!');
    const redirectUrl = req.session.returnTo || '/campgrounds';
    delete req.session.returnTo;
    res.redirect(redirectUrl);
}

m.logout = (req, res) => {
    req.logout();
    req.flash('success', "Goodbye!");
    res.redirect('/campgrounds');
}