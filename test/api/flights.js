'use strict';

const {expect} = require('chai');
const request = require('supertest');
const createServer = require('../../app');
const database = require('../../database');
const fixtures = require('../fixtures/flights')

const server = request(createServer());

describe('Flight api', function() {
	before(async function() {
		await database.sequelize.query('DELETE from FLIGHTS');
		const {Flights} = database;
		const promises = fixtures.map(flight => Flights.create(flight));
		await Promise.all(promises);
	});

	describe('GET /api/v1/flights', function() {
		it('Recover all flights', async () => {
			const {body: flights} = await server
				.get('/api/v1/flights')
				.set('Accept', 'application/json')
				.expect(200);
			expect(flights).to.be.an('array');
			expect(flights.length).to.equal(3);
		});

		it('Filtering flights', async () => {
			const {body: flights} = await server
				.get('/api/v1/flights')
				.query({
					company: 'Lufthansa',
					origin: 'CDG',
					destination: 'BOG'
				})
				.set('Accept', 'application/json')
				.expect(200);

			expect(flights).to.be.an('array');
			expect(flights.length).to.equal(1);
			expect(flights[0].reference).to.equal('LH-123')
		});
	});

	describe('POST /api/v1/flights', function() {
		it('should create a flight', async () => {
			const {body: flight} = await server
				.post('/api/v1/flights')
				.set('Accept', 'application/json')
				.send({
					reference: 'AF-124',
					origin: 'CDG',
					destination: 'MAD',
					date: '2019-01-01',
					placesLeft: 30,
					price: 300.87,
					company: 'Air France'
				})
				.expect(201);

			expect(flight).to.be.an('object');
			expect(flight.reference).to.equal('AF-124');
		});

		it('should return an 400 error if given body has not all the mandatory data', async () => {
			const {body} = await server
				.post('/api/v1/flights')
				.set('Accept', 'application/json')
				.send({
					placesLeft: 30,
					price: 300.87,
					company: 'Air France'
				})
				.expect(400);

			expect(body.message.errors).to.be.an('array');
		});
	});
});