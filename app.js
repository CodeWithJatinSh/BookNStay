// Importing Required Modules
const express = require('express');
const app = express();
const port = 3000;
const mongoose = require('mongoose');
const path = require('path');
const methodOverride = require('method-override');
const multer = require('multer');

// Multer setup to store uploaded images locally
const upload = multer({ dest: 'uploads/' });

// MongoDB URI
const MONGO_URI = 'mongodb://localhost:27017/listingsdb';

// Models & Data
const Listing = require('./models/listing');
const initData = require('./init/data.js');

// Connecting to MongoDB
main()
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.log(err));

// Async function to handle DB connection
async function main() {
  await mongoose.connect(MONGO_URI);
}

// Middleware to support PUT and DELETE methods via forms
app.use(methodOverride('_method'));

// Middleware for serving static files
app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static('uploads')); // serve uploaded images

// Setting up EJS as the templating engine
app.set('view engine', 'ejs');

// Setting the views directory
app.set('views', path.join(__dirname, 'views'));

// Middleware to parse JSON and URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Home Route
app.get('/', (req, res) => {
  res.send('Hello World!');
});

// Route to display all listings
app.get('/listings', async (req, res) => {
  try {
    const allListings = await Listing.find({});
    res.render('listings/index', { listings: allListings });
  } catch (err) {
    console.log("Error fetching listings:", err);
    res.status(500).send("Something went wrong");
  }
});

// Route to render new listing form
app.get('/listings/new', (req, res) => {
  res.render('listings/new.ejs');
});

// Route to show a specific listing
app.get('/listings/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const listing = await Listing.findById(id);
    res.render('listings/show', { listing });
  } catch (err) {
    console.log("Error fetching listing:", err);
    res.status(500).send("Something went wrong");
  }
});

// Route to edit a listing
app.get('/listings/:id/edit', async (req, res) => {
  try {
    const { id } = req.params;
    const listing = await Listing.findById(id);
    res.render('listings/edit', { listing });
  } catch (err) {
    console.log("Error fetching listing for edit:", err);
    res.status(500).send("Something went wrong");
  }
});

// Route to update a listing
app.put('/listings/:id', upload.single('image'), async (req, res) => {
  try {
    const { id } = req.params;
    const updatedData = req.body;

    // Only update image if new file uploaded
    if (req.file) {
      updatedData.image = req.file.path;
    }

    await Listing.findByIdAndUpdate(id, updatedData, { new: true, runValidators: true });
    res.redirect(`/listings/${id}`);
  } catch (err) {
    console.log("Error updating listing:", err);
    res.status(500).send("Something went wrong");
  }
});

// Route to create a new listing
app.post('/listings', upload.single('image'), async (req, res) => {
  try {
    const listingData = req.body;

    if (req.file) {
      listingData.image = req.file.path;
    }

    const newListing = new Listing(listingData);
    await newListing.save();

    res.redirect(`/listings`);
  } catch (err) {
    console.log("Error creating listing:", err);
    res.status(500).send("Something went wrong");
  }
});

// Starting the Server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
