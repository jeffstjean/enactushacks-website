const router = require('express').Router();
const { get_user, get_user_by_email, get_user_by_token } = require('../controllers/UserController')

router.get('/verify', async (req, res) => {
    if(req.session.id) {
        try {
            const { user, err } = await get_user(req.session.id)
            if(err) throw new Error(err)
            if(user.is_verified) res.redirect('/status')
            else res.render('verify', { user })
        }
        catch(e) {
            console.log(e)
            req.session = null
            res.redirect('login')
        }
    }
    else {
        res.redirect('login')
    }
})

router.post('/verify', async (req, res, next) => {
    const email = req.body.email;
    if(!email) {
        res.status(400)
        return next('NoEmail')
    }
    try {
        const { user, err } = await get_user_by_email(email)
        if(err) {
            if(err === 'NoUser') res.render('verify', { user: { email } })
            else throw new Error(err)
        }
        if(user) {
            user.send_verification_email();
            res.render('verify', { user })
        }
    }
    catch(err) {
        res.status(500)
        return next(err);
    }
})

router.get('/verify/:token', async (req, res, next) => {
    const token = req.params.token;
    if(!token) {
        res.status(400)
        return next('NoToken')
    }
    try {
        let { user, err } = await get_user_by_token(token)
        if(err) {
            if(err === 'NoUser') res.render('verify', { expired: true })
            else throw new Error(err)
        }
        if(user) {
            const expiry = new Date(user.token_expiration)
            const now = new Date()
            const is_expired = now > expiry
            user.token = undefined;
            user.token_expiration = undefined;
            if(is_expired) {
                console.log(`Expired token for ${user._id}`)
                await user.save()
                return res.render('verify', { expired: true });
            }
            else {
                console.log(`Verified token for ${user._id}`)
                user.application_status = 'incomplete'
                user.is_verified = true
                await user.save()
                return res.redirect('/status')
            }
        }
    }
    catch(err) {
        res.status(500)
        return next(err);
    }
})


module.exports = router;
