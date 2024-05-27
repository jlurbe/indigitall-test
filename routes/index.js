var express = require('express');
const { UsersController } = require('../controllers/users');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
  res.send('Hello world!');
});

router.get('/users/:id', UsersController.getById);
router.post('/users', UsersController.create);
router.put('/users/:id', UsersController.put);
router.delete('/users/:id', UsersController.delete);

module.exports = router;
