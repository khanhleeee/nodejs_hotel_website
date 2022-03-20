const User = require('../models/User');

// [GET] /login
const showPage = async(req, res, next) => {
    res.render('login');
}

// [POST] /login/loginStore
const loginStore = async(req, res, next) => {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
        req.session.message = {
            type: 'danger',
            intro: 'Email không tồn tại !',
        }
        return res.redirect('/login');
    }

    const checkPassword = await User.findOne({ password: req.body.password });
    if (!checkPassword) {
        req.session.message = {
            type: 'danger',
            intro: 'Mật khẩu không đúng !',
        }
        return res.redirect('/login');
    } else {
        return res.json({ message: "login success" })
    }
}

module.exports = { showPage, loginStore }