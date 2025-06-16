import Wishlist from '../models/Wishlist.js';
import ProductModel from '../models/ProductModel.js';


const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};


export const getWishlist = asyncHandler(async (req, res, next) => {
  
  const wishlist = await Wishlist.findOne({ user: req.user._id }).populate('products');

  if (!wishlist) {
    return res.status(200).json({
      success: true,
      wishlist: { products: [] }, 
    });
  }

  res.status(200).json({
    success: true,
    wishlist,
  });
});


export const addProductToWishlist = asyncHandler(async (req, res, next) => {
  const { productId } = req.body;

  // 1. Validate if the product exists
  const product = await ProductModel.findById(productId);
  if (!product) {
    return res.status(404).json({ success: false, message: 'Product not found' });
  }

  // 2. Find or create the user's wishlist
  let wishlist = await Wishlist.findOne({ user: req.user._id });

  if (!wishlist) {
    // If no wishlist exists for this user, create a new one
    wishlist = await Wishlist.create({
      user: req.user._id,
      products: [productId],
    });
  } else {
    // If wishlist exists, add the product only if it's not already there
    if (!wishlist.products.includes(productId)) {
      wishlist.products.push(productId);
      await wishlist.save();
    }
  }

  // 3. Populate the product details in the wishlist before sending the response
  await wishlist.populate('products');

  res.status(200).json({
    success: true,
    message: 'Product added to wishlist',
    wishlist,
  });
});


export const removeProductFromWishlist = asyncHandler(async (req, res, next) => {
  const { productId } = req.params;

  // 1. Find the user's wishlist
  let wishlist = await Wishlist.findOne({ user: req.user._id });

  if (!wishlist) {
    return res.status(404).json({ success: false, message: 'Wishlist not found for this user' });
  }

  // 2. Filter out the product to be removed
  const initialLength = wishlist.products.length;
  wishlist.products = wishlist.products.filter(
    (id) => id.toString() !== productId.toString() 
  );

  // 3. Check if any product was actually removed
  if (wishlist.products.length === initialLength) {
    return res.status(404).json({ success: false, message: 'Product not found in wishlist' });
  }

  // 4. Save the updated wishlist
  await wishlist.save();

  // 5. Populate product details before sending the response
  await wishlist.populate('products');

  res.status(200).json({
    success: true,
    message: 'Product removed from wishlist',
    wishlist,
  });
});