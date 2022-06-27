const mongoose = require('mongoose');
const Campground = require('../models/campground');
const cities = require('./cities');
const { descriptors, places } = require('./seedHelpers');

mongoose.connect('mongodb://localhost:27017/yelpcamp', { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'conection error'));
db.once('open', () => {
	console.log('Database conected');
});

const randomIndex = (arr) => arr[Math.floor(Math.random() * arr.length)];

const seedDB = async () => {
	await Campground.deleteMany({});
	// console.log(descriptors.length);
	// console.log(places.length);
	for (let i = 0; i < 50; i++) {
		const random1000 = Math.floor(Math.random() * 1000);
		const city = cities[random1000];
		const campground = new Campground({
			title: `${randomIndex(descriptors)} ${randomIndex(places)}`,
			description: 'Lorem, ipsum dolor sit amet consectetur adipisicing elit. Ducimus, tenetur laboriosam ullam at quidem, unde a iste ad vero nisi exercitationem provident iure minima modi rem illum perferendis harum esse!',
			price: Math.floor(Math.random() * 50)+10,
			location: `${city.city}, ${city.state}`,
			image: 'https://source.unsplash.com/collection/483251',
			date: new Date()
		});
		// console.log(campground.title);
		await campground.save();
	}
	// Campground.insertMany()
};

seedDB().then(()=>{mongoose.connection.close()});