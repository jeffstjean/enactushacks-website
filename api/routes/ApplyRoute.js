const router = require('express').Router();
const { is_user } = require('../services/AuthService')

router.get('/apply', is_user, (req, res) => {
    let user = req.session.user;
    if(user.date_application_completed === undefined) res.render('apply', { user: user })
    else res.redirect('/status')
})

router.post('/apply', is_user, async (req, res, next) => {
    let user = req.session.user
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
