const User = require('../models/UserModel')

const is_user = async (req, res, next) => {
    if(req.session.id) {
        try {
            const user = await User.findById(req.session.id)
            if(!user) return next('NoUser')
            req.session.user = user;
            next()
        }
        catch(e) {
            next(e)
        }
    }
    else {
        res.redirect('/login')
    }
}

module.exports = {
    is_user
}