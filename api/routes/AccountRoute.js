const router = require('express').Router();
const { is_user } = require('../services/AuthService')

router.get('/status', is_user, (req, res) => {
    let user = req.session.user
    res.render('status', { user })
})

module.exports = router;