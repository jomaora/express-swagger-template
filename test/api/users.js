'use strict';

const {expect} = require('chai');
const request = require('supertest');
const createServer = require('../../app');
const database = require('../../src/database');
const fixtures = require('../fixtures/users');

const server = request(createServer());

describe('User api', function() {
	describe('POST /api/v1/users', function () {
		before(async function() {
			await database.sequelize.query('DELETE from USERS');
			const {Users} = database;
			await Users.create(fixtures);
		});

		it("La requete envoie tous les données d'un user, l'user est crée et on reçoit un 200", async () => {
			await server.post('/api/v1/users')
				.send({
					username: 'lea',
					fullname: 'lea',
					country: 'FR'
				})
				.expect(201);
		});

		it("La requete envoie n'evoie pas tous les données d'un user, on reçoit un 400", async () => {
			await server.post('/api/v1/users')
				.send({
					username: 'lea'
				})
				.expect(400);
		});

		it("La requete envoie un utilisateur qui existe déjà, on reçoit un 409", async () => {
			await server.post('/api/v1/users')
				.send({
					username: 'joan',
					fullname: 'joan',
					country: 'CO'
				})
				.expect(409);
		});
	});
});