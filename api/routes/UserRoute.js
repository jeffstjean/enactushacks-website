const router = require('express').Router();
const { create_user } = require('../controllers/UserController')
const { is_user, get_user } = require('../services/AuthService')

const MONGO_DUPLICATE_ERROR_CODE = 11000;

router.get('/signup', (req, res) => {
    res.render('apply')
})

router.get('/apply', (req, res) => {
    res.render('apply')
})

router.post('/login', (req, res) => {
    get_user(req.body.email)
    req.session.id = user._id;
})

router.post('/logout', (req, res) => {
    req.session = null;
    res.send('ERRRRROR')
})

router.get('/status', is_user, (req, res) => {
    let user = req.session.user
    res.render('status', { user })
})

router.post('/user', async (req, res, next) => {
    try {
        const { user, err } = await create_user(req.body);
        if(user) {
            req.session.id = user._id;
            return res.redirect('status')
        }
        else {
            switch(err.name) {
                case 'ValidationError':
                    let errors = [];
                    for(field in err.errors) {
                        errors.push({field: err.errors[field].path, message: err.errors[field].message})
                    }
                    return res.status(400).json({ err: true, errors })
                case 'MongoError':
                    if(err.code === MONGO_DUPLICATE_ERROR_CODE) {
                        console.log('Duplicate key')
                        return res.status(400).json({ err: true, errors: [{ field: 'email', message: 'A user with this email already exists' }] })
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
