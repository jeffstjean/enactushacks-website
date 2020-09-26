const router = require('express').Router();
const { create_user, get_user, get_user_by_email, get_user_by_token } = require('../controllers/UserController')
const { is_user } = require('../services/AuthService')

const MONGO_DUPLICATE_ERROR_CODE = 11000;

router.get('/signup', (req, res) => {
    if(req.session.id) {
        res.redirect('status')
    }
    else {
        res.render('login')
    }
})

router.get('/apply', is_user, (req, res) => {
    let user = req.session.user;
    if(user.date_application_completed === undefined) res.render('apply')
    else res.redirect('/status')
})

router.post('/apply', is_user, async (req, res, next) => {
    let user = req.session.user
    let application_data = req.body;
    application_data.grad_year = new Date(application_data.grad_year).toUTCString()
    if(application_data.is_shipping === false) {
        delete application_data.ship_name;
        delete application_data.ship_address;
        delete application_data.ship_apartment;
        delete application_data.ship_city;
        delete application_data.ship_country;
        delete application_data.ship_postal;
    }
    user = Object.assign(user, application_data);
    user.application_status = 'under review';
    user.date_application_completed = new Date();
    try {
        await user.save()
        console.log(`User ${user._id} applied`)
        res.redirect('status')
    }
    catch(err) {
        console.log(err)
        res.status(500)
        next();
    }
})

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

router.get('/login', (req, res) => {
    if(req.session.id) {
        res.redirect('status')
    }
    else {
        res.render('login')
    }
})

router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    const { user, err } = await get_user_by_email(email)
    if(user && user.is_valid_password(password)) {
        req.session.id = user._id;
        res.redirect('/status')
    }
    else {
        console.log('Invalid credentials')
        res.render('login', { errors: ['InvalidCredentials'] })
    }
})

router.get('/logout', (req, res) => {
    req.session = null;
    res.redirect('/')
})

router.get('/status', is_user, (req, res) => {
    let user = req.session.user
    res.render('status', { user })
})

router.post('/user', async (req, res, next) => {
    delete req.body.verify_password;
    try {
        const { user, err } = await create_user(req.body);
        if(user) {
            console.log(`Created user ${user.email}`)
            user.send_verification_email();
            req.session.id = user._id;
            return res.redirect('verify')
        }
        else {
            switch(err.name) {
                case 'ValidationError':
                    let errors = [];
                    for(field in err.errors) {
                        errors.push({field: err.errors[field].path, message: err.errors[field].message})
                    }
                    return res.status(400).json({ errors })
                case 'MongoError':
                    if(err.code === MONGO_DUPLICATE_ERROR_CODE) {
                        console.log('Duplicate key')
                        return res.status(400).render('signup', { err: true, errors: [{ field: 'email', message: 'A user with this email already exists' }] })
                    }
                default:
                    console.log('Unknown Error')
                    res.status(500)
                    return next(err);
            }
        }
    }
    catch(err) {
        res.status(500)
        return next(err);
    }
});


module.exports = router;
