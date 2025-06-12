const multer = require('multer');
const path = require('path');
const Product = require('../models/Product');

// Setup multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Make sure this folder exists
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + ext);
  },
});

const upload = multer({ storage });
exports.uploadProductImage = upload.single('image');

exports.createProduct = async (req, res) => {
  try {
    // Convert [Object: null prototype] if needed
    req.body = Object.assign({}, req.body);

    let body = req.body;
    console.log("Parsed body:", body);
    console.log("Parsed price:", typeof body.price, body.price);
    console.log("Parsed title:", body.title);


    // If name or other complex fields are JSON strings, parse them
    if (typeof body.title === 'string') {
      try {
        body.title = JSON.parse(body.title);
      } catch (e) {
        return res.status(400).json({ message: 'Invalid JSON format in name field' });
      }
    }
    if (typeof body.description === 'string') {
      try {
        body.description = JSON.parse(body.description);
      } catch (e) {
        return res.status(400).json({ message: 'Invalid JSON format in description field' });
      }
    }

    if (typeof body.price === 'string') {
      body.price = parseFloat(body.price);
    }

    // Add uploaded image path
    const image = req.file ? req.file.path : null;

    const categoryId = body.categoryId || null;

    //const newProduct = new Product({ ...body, image,categoryId  });
    const newProduct = new Product({
      title: body.title,
      description: body.description,
      price: body.price,
      image,
      tags: body.tags ? body.tags.split(',') : [],
      categoryId,
    });

    await newProduct.save();
    res.status(201).json(newProduct);
  } catch (err) {
    res.status(500).json({ message: 'Error creating product', error: err.message });
  }
};

// Get all products
exports.getProducts = async (req, res) => {
  try {
    const products = await Product.find().populate('categoryId');
    const prodcutsWithImageUrl = products.map(product => ({
      ...product.toObject(),
      imageUrl: product.image ? `${req.protocol}://${req.get('host')}/${product.image}` : null
    }));

    res.json(prodcutsWithImageUrl);
    //res.json(products);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching products', error: err.message });
  }
};

// Get single product by ID
exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate('categoryId');
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching product', error: err.message });
  }
};

// Update product
exports.updateProduct = async (req, res) => {
  try {
    const updated = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ message: 'Product not found' });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: 'Error updating product', error: err.message });
  }
};

// Delete product
exports.deleteProduct = async (req, res) => {
  try {
    const deleted = await Product.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Product not found' });
    res.json({ message: 'Product deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting product', error: err.message });
  }
};
