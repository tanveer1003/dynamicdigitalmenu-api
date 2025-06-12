const ProductCategory = require('../models/ProductCategory');
const multer = require('multer');


const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Make sure this folder exists
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + ext);
  }
});

const upload = multer({ storage });

exports.uploadCategoryImage = upload.single('image');

exports.createCategory = async (req, res) => {
  try {
    req.body = Object.assign({}, req.body);
    let name = req.body.name;

    console.log("Something happened:", req.body);

    // ✅ Parse the JSON string into an object
    if (typeof name === 'string') {
      try {
        name = JSON.parse(name); // ✅ This line should NOT be commented
      } catch (e) {
        return res.status(400).json({ message: 'Invalid JSON format in name field' });
      }
    }

    const image = req.file ? req.file.path : null;

    //const newCategory = new ProductCategory({ name, image, parentCategory: body.parentCategory || null });
    
    const newCategory = new ProductCategory({
      name,
      image,
      parentCategory: req.body.parentCategory || null  // ✅ Correct reference
    });
    
    await newCategory.save();

    res.status(201).json(newCategory);
  } catch (error) {
    console.error('Category creation error:', error);
    res.status(400).json({ message: 'Error creating category', error: error.message });
  }
};


/*
// Create a new category
exports.createCategory = async (req, res) => {
  try {
    const { name, image } = req.body;
    console.log('Incoming category:', req.body);

    const newCategory = new ProductCategory({ name, image });
    await newCategory.save();

    res.status(201).json(newCategory);
  } catch (error) {
    console.error('Category creation error:', error);
    res.status(200).json({ message: 'Error creating category', error: error.message });
  }
};
*/


// Get all categories
exports.getCategories = async (req, res) => {
  try {
    /*
    const categories = await ProductCategory.find();
    res.json(categories);
    */
   const categories = await ProductCategory.find();

    const categoriesWithImageUrl = categories.map(category => ({
      ...category.toObject(),
      imageUrl: category.image ? `${req.protocol}://${req.get('host')}/${category.image}` : null
    }));

    res.json(categoriesWithImageUrl);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching categories', error: error.message });
  }
};

exports.getTopLevelCategories = async (req, res) => {
  try {
    const categories = await ProductCategory.find({ parentCategory: null }).populate('parentCategory');;

    const categoriesWithImageUrl = categories.map(category => ({
      ...category.toObject(),
      imageUrl: category.image ? `${req.protocol}://${req.get('host')}/${category.image}` : null
    }));

    res.json(categoriesWithImageUrl);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching top-level categories', error: error.message });
  }
};

exports.getSubCategories = async (req, res) => {
  try {
    const categories = await ProductCategory.find({ parentCategory: { $ne: null } }).populate('parentCategory');;;

    const categoriesWithImageUrl = categories.map(category => ({
      ...category.toObject(),
      imageUrl: category.image ? `${req.protocol}://${req.get('host')}/${category.image}` : null
    }));

    res.json(categoriesWithImageUrl);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching subcategories', error: error.message });
  }
};



// Get single category by ID
exports.getCategoryById = async (req, res) => {
  try {
    const category = await ProductCategory.findById(req.params.id);
    if (!category) return res.status(404).json({ message: 'Category not found' });
    res.json(category);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching category', error: error.message });
  }
};

// Update category
exports.updateCategory = async (req, res) => {
  try {
    const { name, image } = req.body;
    const updatedCategory = await ProductCategory.findByIdAndUpdate(
      req.params.id,
      { name, image },
      { new: true }
    );
    if (!updatedCategory) return res.status(404).json({ message: 'Category not found' });
    res.json(updatedCategory);
  } catch (error) {
    res.status(500).json({ message: 'Error updating category', error: error.message });
  }
};

// Delete category
exports.deleteCategory = async (req, res) => {
  try {
    const deleted = await ProductCategory.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Category not found' });
    res.json({ message: 'Category deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting category', error: error.message });
  }
};
