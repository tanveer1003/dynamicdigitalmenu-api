const express = require('express');
const cors = require('cors');
require('dotenv').config();

const multer = require('multer');
const path = require('path');

const authRoutes = require('./routes/authRoutes');
const productCategoryRoutes = require('./routes/productCategoryRoutes');
const productRoutes = require('./routes/productRoutes');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/auth', authRoutes);
app.use('/api/categories', productCategoryRoutes);
app.use('/api/products', productRoutes);
app.use('/uploads', express.static('uploads'));



module.exports = app;