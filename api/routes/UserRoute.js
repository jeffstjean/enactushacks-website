const router = require('express').Router();
const { create_user, get_user, get_user_by_email, get_user_by_token } = require('../controllers/UserController')
const { is_user } = require('../services/AuthService')

const MONGO_DUPLICATE_ERROR_CODE = 11000;

// router.post('/user', async (req, res, next) => {
//     delete req.body.verify_password;
//     try {
//         const { user, err } = await create_user(req.body);
//         if(user) {
//             console.log(`Created user ${user.email}`)
//             user.send_verification_email();
//             req.session.id = user._id;
//             return res.redirect('verify')
//         }
//         else {
//             switch(err.name) {
//                 case 'ValidationError':
//                     let errors = [];
//                     for(field in err.errors) {
//                         errors.push({field: err.errors[field].path, message: err.errors[field].message})
//                     }
//                     return res.status(400).json({ errors })
//                 case 'MongoError':
//                     if(err.code === MONGO_DUPLICATE_ERROR_CODE) {
//                         console.log('Duplicate key')
//                         return res.status(400).render('signup', { err: true, errors: [{ field: 'email', message: 'A user with this email already exists' }] })
//                     }
//                 default:
//                     console.log('Unknown Error')
//                     res.status(500)
//                     return next(err);
//             }
//         }
//     }
//     catch(err) {
//         res.status(500)
//         return next(err);
//     }
// });


module.exports = router;
