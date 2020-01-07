var express = require('express');
var router = express.Router();

// Créer un vol avec les données qui viennent dans le req.body
// POST /flights
router.post('/', async (req, res, next) => {
  try {
    const authorisationToken = req.get('Authorization');
    console.log(authorisationToken);

    if (!authorisationToken) {
      return res.status(401).send('Missing Authorization header');
    }

    if (authorisationToken !== 'Bearer toto') {
      return res.status(403).send("Vous n'êtes pas authorisé à executer cette action.");
    }

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
      if (req.accepts('html')) {
        return res.render('error', {
          message: 'Flight not found',
          error: {
            status: 404,
            stack: ''
          }
        });
      }
      return res.status(404).send({
          message: 'Vol ' + flightNumber + " existe pas"
      })
    }

    if (req.accepts('html')) {
        return res.render('flight', {flight: flight});
    }
    return res.send(flight);
  } catch(err) {
    next(err);
  }
});

module.exports = router;
