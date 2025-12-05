// Importing Required Modules
const express = require('express');
const  app = express();
const port = 3000;
const mongoose = require('mongoose');
const path = require('path');
const MONGO_URI = 'mongodb://localhost:27017/listingsdb';
const Listing = require('./models/listing');
const initData = require('./init/data.js');
// Connecting to MongoDB
main()
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.log(err));

// Async function to handle connection
async function main() {
  await mongoose.connect(MONGO_URI);

  // use `await mongoose.connect('mongodb://user:password@127.0.0.1:27017/test');` if your database has auth enabled
}

// middleware for serving static files
app.use(express.static(path.join(__dirname, 'public')));
// Setting up EJS as the templating engine
app.set('view engine', 'ejs');
// Setting the views directory
app.set('views', path.join(__dirname, 'views'));

// Middleware to parse JSON and URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.send('Hello World!');
});

// Route to display all listings
app.get('/listings', async (req, res) => {
  try{
    const allListings =  await Listing.find({});
    res.render('listings/index', { listings: allListings });
  }
  catch(err){
    console.log("Error fetching listings:", err);
  }
});

app.get('/listings/:id', async (req, res) => {
  try{
    const { id } = req.params;
    const listing =  await Listing.findById(id);
    res.render('listings/show', { listing });
  }
  catch(err){
    console.log("Error fetching listing:", err);
  }
});

// Starting the Server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});