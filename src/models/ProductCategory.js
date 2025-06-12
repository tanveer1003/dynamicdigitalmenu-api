const mongoose = require('mongoose');

const productCategorySchema = new mongoose.Schema({
  name: {
    en: { type: String , required: true  },
    he: { type: String, required: true  }
  },
  image: { type: String },
  parentCategory: {
  type: mongoose.Schema.Types.ObjectId,
  ref: 'ProductCategory',
  default: null
}

}, { timestamps: true });

module.exports = mongoose.model('ProductCategory', productCategorySchema);
