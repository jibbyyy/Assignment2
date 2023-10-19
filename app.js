const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(express.json());
app.use(cors());

// MongoDB connection
const mongoURI = process.env.MONGODB_URI;
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;

db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => console.log('Connected to MongoDB'));

// Import your Product model here
const Product = require('./models/product');

// Define the route to create a new product
app.post('/api/products', async (req, res) => {
  try {
    // Extract data from the request body
    const { name, description, price, published, category } = req.body;

    // Create a new product using your Mongoose model
    const product = new Product({ name, description, price, published, category });

    // Save the product to the database
    await product.save();

    // Respond with a success message
    res.json({ message: 'Product created successfully' });
  } catch (error) {
    // Handle errors and respond with an error message
    res.status(500).json({ message: error.message });
  }
});

// Define the route to get all products
app.get('/api/products', async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create a variable for the categories routes
const categoriesRoutes = require('./routes/categoryRoutes');

// Use the categories routes in your main app
app.use('/api/categories', categoriesRoutes);

// Define a route for the root URL
app.get('/', (req, res) => {
  res.send('("message": Welcome to DressStore Application.")');
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
