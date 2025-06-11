import mongoose from 'mongoose'; 

const wishlistSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  products: [
    {
      type: mongoose.Schema.ObjectId,
      ref: 'product'
    }
  ],
}, {
  timestamps: true
});

// Use export default instead of module.exports
const Wishlist = mongoose.model('Wishlist', wishlistSchema);
export default Wishlist;