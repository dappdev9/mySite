const express = require('express');
const app = express();
const Datastore = require('nedb');
require('dotenv').config();

app.listen(3000, () => console.log('listening at 3000'));
app.use(express.static('public'));
app.use(express.json({ limit: '1mb' }));

const database = new Datastore('database.db');
database.loadDatabase();

app.get('/api', (req, res) => {
	database.find({}, (err, data) => {
		if(err) {
			res.end();
			return;
		}
		res.json(data);
	});
});

app.post('/api', (req, res) => {
	console.log('I got request!');

	const api_key = process.env.API_KEY;
	const atra = 'https://api.atra.io/prod/v1/'

	const data = req.body;
	const timestamp = Date.now();
	data.timestamp = timestamp;

	database.insert(data);
	
	res.json({
		status: 'succes',
		timestamp: timestamp,
		mood: 'none',
		latitude: data.lat,
		longitude: data.lon
	});
});