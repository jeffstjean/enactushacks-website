const router = require('express').Router();
const { is_user } = require('../services/AuthService')
const { get_user } = require('../controllers/UserController')

router.get('/apply', is_user, async (req, res) => {
    let { user, err } = await get_user(req.session.id)
    if(err) return next(err);
    if(user.date_application_completed === undefined) res.render('apply', { user: user })
    else res.redirect('/status')
})

router.post('/apply', is_user, async (req, res, next) => {
    let { user, err } = await get_user(req.session.id)
    if(err) return next(err);
    let application_data = req.body;
    application_data.grad_year = new Date(application_data.grad_year).toUTCString()
    if(!application_data.is_shipping) {
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
        console.log(`User ${user.email} applied`)
        res.redirect('status')
    }
    catch(err) {
        console.log(err)
        res.status(500)
        next();
    }
})


module.exports = router;
