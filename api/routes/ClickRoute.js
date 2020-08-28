const router = require('express').Router();

router.get('/', (req, res, next) => {
  if(req.query.q && req.query.source) {
    res.redirect(req.query.q)
  }
  else {
    res.status(406)
    next();
  }
});


module.exports = router;
