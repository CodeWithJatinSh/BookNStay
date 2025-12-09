// Importing Required Modules
const express = require('express');
const app = express();
const port = 3000;
const mongoose = require('mongoose');
const path = require('path');
const methodOverride = require('method-override');
const multer = require('multer');
const ejsMate = require('ejs-mate');

// Setting up EJS Mate as the templating engine
app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');

// Multer setup to store uploaded images locally (in uploads folder)
const upload = multer({ dest: 'uploads/' });

// MongoDB URI
const MONGO_URI = 'mongodb://localhost:27017/listingsdb';

// Models
const Listing = require('./models/listing');

// Connecting to MongoDB
main()
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.log(err));

async function main() {
  await mongoose.connect(MONGO_URI);
}

// Setting the views directory
app.set('views', path.join(__dirname, 'views'));

// Middleware for static files
app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static('uploads')); // Serve uploaded images

// Parse request body
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Override method for PUT & DELETE
app.use(methodOverride('_method'));

// Home Route
app.get('/', (req, res) => {
  res.redirect('/listings');
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

// Route to render form for adding a new listing
app.get('/listings/new', (req, res) => {
  res.render('listings/new');
});

// Route to create a new listing
app.post('/listings', upload.single('image'), async (req, res) => {
  try {
    const listingData = req.body;

    if (req.file) {
      listingData.image = `/uploads/${req.file.filename}`;
    }

    const newListing = new Listing(listingData);
    await newListing.save();
    res.redirect('/listings');
  } catch (err) {
    console.log("Error creating listing:", err);
    res.status(500).send("Something went wrong");
  }
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

// Route to render edit form
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

// Update Listing (Image optional)
app.put('/listings/:id', upload.single('image'), async (req, res) => {
  try {
    const { id } = req.params;
    let listing = await Listing.findById(id);

    if (!listing) {
      return res.status(404).send("Listing not found");
    }

    // Update text fields
    listing.title = req.body.title;
    listing.description = req.body.description;
    listing.price = req.body.price;
    listing.location = req.body.location;
    listing.country = req.body.country;

    // Update image only if new one is uploaded
    if (req.file) {
      listing.image = `/uploads/${req.file.filename}`;
    }

    await listing.save();
    res.redirect(`/listings/${id}`);
  } catch (err) {
    console.log("Error updating listing:", err);
    res.status(500).send("Something went wrong");
  }
});

// Delete Listing
app.delete('/listings/:id', async (req, res) => {
  try {
    console.log("Deleting listing:", req.params.id);
    await Listing.findByIdAndDelete(req.params.id);
    res.redirect('/listings');
  } catch (err) {
    console.log("Delete error:", err);
    res.status(500).send("Delete failed");
  }
});

// Starting the Server
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
