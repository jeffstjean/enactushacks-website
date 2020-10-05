const User = require('../models/UserModel')

const is_user = async (req, res, next) => {
    if(req.session.id) {
        // try {
        //     let user = await User.findById(req.session.id)
        //     if(!user) return next('NoUser')
        //     if(user.application_status === 'unverified') return res.render('verify', { user })
        //     user.q_quality = undefined
        //     user.q_responsibility = undefined
        //     user.q_experience = undefined
        //     req.session.user = user;
        //     next()
        // }
        // catch(e) {
        //     next(e)
        // }
        next();
    }
    else {
        res.redirect('/signup')
    }
}

module.exports = {
    is_user
}