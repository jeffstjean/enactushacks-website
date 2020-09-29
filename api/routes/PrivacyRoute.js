const fs = require('fs')
const path = require('path')

const router = require('express').Router();

const FILEPATH = 'public/docs/privacy_policy.pdf'

router.get('/privacy', (req, res) => {
    res.download(FILEPATH, 'Enactus Hacks 2020 - Privacy Policy.pdf');
})



module.exports = router;
