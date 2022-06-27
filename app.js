const express = require('express');
const app = express();
const mongoose = require('mongoose');
const path = require('path');
const ejsMate = require('ejs-mate');
const Campground = require('./models/campground');
const methodOverride = require('method-override');
const ExpressError = require('./utilities/expressError');
const catchAsync = require('./utilities/catchAsync');
const {campgroundSchema} = require('./schemas');

mongoose.connect('mongodb://localhost:27017/yelpcamp', { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'conection error'));
db.once('open', () => {
	console.log('Database conected');
});

app.set('views', path.join(__dirname + '/views'));
app.set('view engine', 'ejs');
app.engine('ejs', ejsMate);
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

const validateForm = (req, res, next) => {
	// console.log(campgroundSchema);
	const { error } = campgroundSchema.validate(req.body);
	if (error) {
		const msg = error.details.map(el => el.message).join(', ');
		throw new ExpressError(msg, '400');
	} else {next()}
};

app.get('/', (req, res) => {
	res.render('home');
});

app.get('/campgrounds',
	catchAsync(async (req, res) => {
		const camps = await Campground.find({});
		res.render('campgrounds/index', { camps });
	})
);

app.get('/campgrounds/new', (req, res) => {
	res.render('campgrounds/new');
});

app.post('/campgrounds',
	validateForm,
	catchAsync(async (req, res) => {
		const camp = new Campground({ ...req.body.campground, date: new Date() });
		await camp.save();
		res.redirect('/campgrounds');
	})
);

app.get('/campgrounds/:id',
	catchAsync(async (req, res) => {
		const { id } = req.params;
		const camp = await Campground.findById(id);
		res.render('campgrounds/details', { camp });
	})
);

app.get('/campgrounds/:id/edit',
	catchAsync(async (req, res) => {
		const { id } = req.params;
		const camp = await Campground.findById(id);
		res.render('campgrounds/edit', { camp });
	})
);

app.put('/campgrounds/:id', validateForm,
	catchAsync(async (req, res) => {
		const { id } = req.params;
		const camp = await Campground.findByIdAndUpdate(id, req.body.campground, {
			useFindAndModify: false
		});
		await camp.save();
		res.redirect(`/campgrounds/${id}`);
	})
);

app.delete('/campgrounds/:id',
	catchAsync(async (req, res) => {
		const { id } = req.params;
		await Campground.findByIdAndDelete(id);
		res.redirect('/campgrounds');
	})
);

app.all('*', (req, res, next) => {
	next(new ExpressError('Not found', 404));
});

app.use((err, req, res, next) => {
	const { message = 'Something went wrong', status = 500 } = err;
	res.status(status).render('error', { err });
	// next();
});

app.listen('3000', () => {
	console.log('Server is running on port 3000');
});
