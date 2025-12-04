const mongoose = require('mongoose');
const schema = mongoose.Schema;

const listingSchema = new schema({
    title:{
        type: String,
        required: true
    },
    description:{
        type: String,
        required: true
    },
    price:{
        type: Number,
        required: true
    },
    image:{
        type: String,
        required: true,
        default: 'https://images.unsplash.com/photo-1761839257469-96c78a7c2dd3?q=80&w=1169&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        set: v => 
            v === '' ? 'https://images.unsplash.com/photo-1761839257469-96c78a7c2dd3?q=80&w=1169&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' : v
    },
    location:{
        type: String,
        required: true
    },
    country:{
        type: String,
        required: true
    }
});
const Listing = mongoose.model('Listing', listingSchema);
module.exports = Listing;