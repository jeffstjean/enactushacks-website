const router = require('express').Router();
const { add_to_mailing_list } = require('../services/Email')

router.post('/', async (req, res) => {
    const list = req.body.list
    const email = req.body.email
    if(!email) {
        console.log('No email provided');
        return res.status(400).send('NoEmail')
    }
    if(!list) {
        console.log('No list provided');
        return res.status(400).send('NoList')
    }
    try {
        await add_to_mailing_list(list, email)
        return res.status(200).send()
    } catch (err) {
        if(err.message.search('already exists') !== -1) return res.status(303).send();
        else return res.status(400).send();
    }
});


module.exports = router;
