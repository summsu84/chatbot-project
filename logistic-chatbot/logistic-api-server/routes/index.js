var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  // res.render('index', { title: 'Express' });
  res.json({
    error:'이쪽으로 요청하면 안되요'
  });
});

module.exports = router;