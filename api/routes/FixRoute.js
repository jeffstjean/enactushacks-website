const router = require('express').Router();
const { get_user } = require('../controllers/UserController')
const { is_user } = require('../services/AuthService')

router.get('/sync', is_user, async (req, res) => {
    let user = req.session.user
    res.render('sync', { user })
});

router.post('/fix', async (req, res) => {
    if(req.session.id) {
        try {
            const data = JSON.parse(req.body.app)
            let { user, err } = await get_user(req.session.id);
            if(!err && !user.q_experience) {
                user = Object.assign(user, data)
                await user.save()
                console.log('Updated user')
            }
            res.send()
        }
        catch(e) {
            console.log(e)
            console.log('Unable to update user')
            res.send()
        }
    }
    else {
        res.send()
    }
});


module.exports = router;
