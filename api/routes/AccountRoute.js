const router = require('express').Router();
const { is_user } = require('../services/AuthService')
const { accepting_applications } = require('../config/config')

router.get('/status', is_user, (req, res) => {
    let user = req.session.user
    res.render('status', { user, accepting_applications })
})

module.exports = router;