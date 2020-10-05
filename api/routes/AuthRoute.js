const router = require('express').Router();
const { create_user, get_user_by_email } = require('../controllers/UserController')
const { is_user } = require('../services/AuthService')
const { verify_users } = require('../config/config')

const MONGO_DUPLICATE_ERROR_CODE = 11000;
const valid_password = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#^(){}])[A-Za-z\d@$!%*?&#^(){}]{8,}$/;

router.get('/signup', (req, res) => {
    if(req.session.id) {
        res.redirect('status')
    }
    else {
        res.render('login')
    }
})

router.post('/signup', async (req, res, next) => {
    let user_data = req.body;
    if(!valid_password.test(user_data.password)) {
        return res.render('login', { errors: [ 'InvalidPassword' ] })
    }
    try {
        let { user, err } = await create_user(user_data);
        if(user) {
            console.log(`Created user ${user.email}`)
            if(verify_users) {
                user.send_verification_email();
                console.log(`Sent verification to ${user.email}`)
            }
            else {
                user.token = undefined;
                user.token_expiration = undefined;
                user.is_verified = true;
                user.application_status = 'incomplete'
                await user.save();
            }
            req.session.id = user._id;
            req.session.name = user.first_name;
            return res.redirect('verify')
        }
        else {
            switch(err.name) {
                case 'ValidationError':
                    let errors = [];
                    for(field in err.errors) {
                        errors.push(err.errors[field].message)
                    }
                    return res.render('login', { errors: errors })
                case 'MongoError':
                    if(err.code === MONGO_DUPLICATE_ERROR_CODE) {
                        console.log(`Duplicate key ${user_data.email}`)
                        return res.render('login', { errors: [ 'DuplicateUser' ] })
                    }
                    else {
                        console.log(err)
                        res.status(500)
                        return next(err);
                    }
                default:
                    console.log(err)
                    res.status(500)
                    return next(err);
            }
        }
    }
    catch(err) {
        console.log(err)
        res.status(500)
        return next(err);
    }
});

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
    try {
        const { user, err } = await get_user_by_email(email)
        if(user && user.is_valid_password(password)) {
            req.session.id = user._id;
            req.session.name = user.first_name;
            res.redirect('/status')
        }
        else {
            console.log('Invalid credentials')
            res.render('login', { errors: ['InvalidCredentials'] })
        }
    }
    catch(err) {
        console.log(err)
        res.status(500)
        return next(err);
    }
})

router.get('/logout', (req, res) => {
    req.session = null;
    res.redirect('/')
})


module.exports = router;
