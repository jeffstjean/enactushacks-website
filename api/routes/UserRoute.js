const router = require('express').Router();
const { create_user } = require('../controllers/UserController')

const MONGO_DUPLICATE_ERROR_CODE = 11000;

router.get('/apply', (req, res) => {
    console.log(req.session)
    res.render('apply')
})

router.post('/user', async (req, res, next) => {
    try {
        const { user, err } = await create_user(req.body);
        const pass = req.body.password;
        if(user) {
            console.log(user._id)
            req.session._id = user._id;
            return res.json(user)
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
