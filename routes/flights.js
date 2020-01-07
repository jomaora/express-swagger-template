var express = require('express');
var router = express.Router();

// Créer un vol avec les données qui viennent dans le req.body
// POST /flights
router.post('/', async (req, res, next) => {
  try {
    const data = req.body;
    if (!data.flightNumber || !data.company || !data.departure || !data.destination || !data.date) {
      return res.status(400).send('Missing data');
    }

    const {Flights} = req.db;
    const flight = await Flights.findOne({where: {flightNumber: data.flightNumber}});

    if (flight) {
      return res.status(409).send('Il y a déjà un vol avec le flightNumber ' + data.flightNumber);
    }

    const newFlight = await Flights.create(data);
    return res.status(201).send(newFlight);
  } catch(err) {
    next(err);
  }
});

// GET /flights/{flightNumber}
router.get('/:flightNumber', async (req, res, next) => {
  try {
    const flightNumber = req.params.flightNumber;
    const {Flights} = req.db;
    const flight = await Flights.findOne({where: {flightNumber: flightNumber}});

    if (!flight) {
      return res.status(404).send('Vol ' + flightNumber + " existe pas")
    }

    return res.send(flight);
  } catch(err) {
    next(err);
  }
});

module.exports = router;
