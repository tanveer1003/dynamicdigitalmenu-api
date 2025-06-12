const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  title: {
    en: { type: String, required: true },
    he: { type: String }
  },
  description: {
    en: { type: String },
    he: { type: String }
  },
  price: { type: Number, required: true },
  image: { type: String },
  tags: [{ type: String }],
  categoryId: { type: mongoose.Schema.Types.ObjectId, ref: 'ProductCategory' }
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);
