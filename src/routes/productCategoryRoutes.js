const express = require('express');
const router = express.Router();
const {
  createCategory,
  getCategories,
  getTopLevelCategories,
  getSubCategories,
  getCategoryById,
  updateCategory,
  deleteCategory
} = require('../controllers/productCategoryController');

const multer = require('multer');
const path = require('path');

// Setup storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + ext);
  }
});

const upload = multer({ storage });

// ✅ Apply middleware here
router.post('/', upload.single('image'), createCategory);

router.get('/', getCategories);
router.get('/toplevel-categories', getTopLevelCategories);
router.get('/sub-categories', getSubCategories);
router.get('/:id', getCategoryById);
router.put('/:id', updateCategory);
router.delete('/:id', deleteCategory);

module.exports = router;
