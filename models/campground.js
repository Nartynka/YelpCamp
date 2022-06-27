const mongoose = require('mongoose');
const { Schema } = mongoose;

const campgroundSchema = new Schema({
	title: String,
	description: String,
	price: Number,
	location: String,
	image: String,
	date: Date
	//author: userSchema,
	//comments: [commentSchema]
});

module.exports = mongoose.model('Campground', campgroundSchema);
