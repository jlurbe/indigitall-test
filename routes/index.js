var express = require('express');
const { UsersController } = require('../controllers/users');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
  res.send('Hello world!');
});

module.exports = router;
