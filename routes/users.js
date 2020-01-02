var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', async (req, res, next) => {
  try {
    const {Users} = req.db;
    const users = await Users.findAll();
    return res.send(users);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
