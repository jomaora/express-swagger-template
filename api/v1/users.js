const express = require('express');
const request = require('request-promise');
const router = express.Router();

/* GET users listing. */
router.get('/', async (req, res, next) => {
  try {
		const users = await request({
			uri: 'http://www.mocky.io/v2/5c015e253500006c00ad098f',
			method: 'GET',
			json: true
		});

		const {country, company} = req.query;
		let filteredList = users;
		if (country) {
		  filteredList = users.filter(u => u.country === country);
    }
		if (company) {
			filteredList = users.filter(u => u.company === company);
		}

		res.send(filteredList);
  } catch(err) {
    next(err);
  }
});

module.exports = router;
