const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

const MONGO_URI = 'mongodb://localhost:27017/listingsdb';

async function main() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("Connected to DB");

    // Clear existing listings
    await Listing.deleteMany({});
    console.log('Cleared existing listings');

    // Insert initial data
    await Listing.insertMany(initData.data);
    console.log('Inserted initial data');

    mongoose.connection.close(); // Close connection after seeding
    console.log("DB connection closed");
  } 
  catch (err) {
    console.log("Error:", err);
  }
}

main();
