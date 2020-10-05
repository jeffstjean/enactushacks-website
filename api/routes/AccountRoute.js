const router = require('express').Router();
const { is_user } = require('../services/AuthService')
const { get_user } = require('../controllers/UserController')
const { accepting_applications } = require('../config/config')

router.get('/status', is_user, async (req, res) => {
    let { user, err } = await get_user(req.session.id)
    if(err) return next(err);
    res.render('status', { user, accepting_applications })
})

module.exports = router;