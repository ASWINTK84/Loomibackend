import mongoose from "mongoose";
import Cart from "../models/Cart.js";
import ProductModel from "../models/ProductModel.js"; 
import OfferProduct from "../models/offerproductsModel.js"; 


const populateCartDetails = async (cart) => {
  if (!cart || !cart.items || cart.items.length === 0) {
    return { items: [], total: 0 };
  }

  let activeOffers = [];
  try {
    activeOffers = await OfferProduct.find({});
  } catch (offerError) {
    console.error("Error fetching offer products:", offerError.message);
  }

  const offerMap = new Map(
    activeOffers
      .filter(offer => offer?.product)
      .map(offer => [offer.product.toString(), offer.offerPercentage])
  );

  try {
    await cart.populate({
      path: "items.product",
      
      select: "name price imageUrl sizes colors", 
    });
  } catch (populateError) {
    console.error("Error during cart item population:", populateError.message);
    throw populateError;
  }

  let total = 0;
  const populatedItems = cart.items.map(item => {
    if (!item.product) {
      console.warn(`Product not found for cart item _id: ${item._id}`);
      return null;
    }

    const originalPrice = item.product.price;
    let effectivePrice = originalPrice;
    let offerPrice = null;
    let offerPercentage = null;

    const matchedOffer = offerMap.get(item.product._id.toString());
    if (typeof matchedOffer === 'number' && matchedOffer > 0 && matchedOffer <= 100) {
      const calculated = originalPrice * (1 - matchedOffer / 100);
      if (calculated < originalPrice) {
        effectivePrice = parseFloat(calculated.toFixed(2));
        offerPrice = effectivePrice;
        offerPercentage = matchedOffer;
      }
    }

    const subTotal = effectivePrice * item.quantity;
    total += subTotal;

    return {
      _id: item._id,
      product: {
        _id: item.product._id,
        name: item.product.name,
        imageUrl: item.product.imageUrl,
        price: originalPrice,
        offerPrice,
        appliedOfferPercentage: offerPercentage,
        sizes: item.product.sizes,
       
        colors: item.product.colors, 
      },
      quantity: item.quantity,
      size: item.size,
      color: item.color, 
      subTotal: parseFloat(subTotal.toFixed(2)),
    };
  }).filter(Boolean);

  return { items: populatedItems, total: parseFloat(total.toFixed(2)) };
};

// --- Add to Cart ---
export const addToCart = async (req, res) => {
  try {
    const userId = req.user._id;
    // Destructure color from req.body
    const { productId, quantity, size, color } = req.body; 

    // Input validation for color
    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ success: false, message: "Invalid product ID." });
    }
    if (typeof quantity !== "number" || quantity <= 0) {
      return res.status(400).json({ success: false, message: "Quantity must be a positive number." });
    }
    if (!size) {
      return res.status(400).json({ success: false, message: "Size is required." });
    }
    // Add validation for color
    if (!color) {
        return res.status(400).json({ success: false, message: "Color is required." });
    }

    const product = await ProductModel.findById(productId);
    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found." });
    }

    let cart = await Cart.findOne({ user: userId });
    if (!cart) {
      cart = new Cart({ user: userId, items: [] });
    }

    // IMPORTANT: Update the find logic to include color
    const existingItem = cart.items.find(
      item => item.product.toString() === productId && item.size === size && item.color === color
    );

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      // Add color to the new item pushed to cart
      cart.items.push({ product: productId, quantity, size, color }); 
    }

    await cart.save();

    const { items, total } = await populateCartDetails(cart);

    res.status(200).json({ success: true, items, total, message: "Item added/updated in cart." });
  } catch (error) {
    console.error("addToCart Error:", error);
    res.status(500).json({ success: false, message: "Server error.", error: error.message });
  }
};


// --- Get Cart ---
export const getCart = async (req, res) => {
  try {
    const userId = req.user._id; 
    const cart = await Cart.findOne({ user: userId });

    // Populate cart details even if cart is null (will return empty items/total)
    const { items, total } = await populateCartDetails(cart);
    res.status(200).json({ success: true, items, total });
  } catch (error) {
    console.error("getCart Error:", error);
    res.status(500).json({ success: false, message: "Server error.", error: error.message });
  }
};

// --- Remove from Cart ---
export const removeFromCart = async (req, res) => {
  try {
    const userId = req.user._id; 
    const cartItemId = req.params.cartItemId; 

    if (!mongoose.Types.ObjectId.isValid(cartItemId)) {
      return res.status(400).json({ success: false, message: "Invalid cart item ID." });
    }

    // Find the cart and pull (remove) the item by its _id
    const cart = await Cart.findOneAndUpdate(
      { user: userId },
      { $pull: { items: { _id: cartItemId } } },
      { new: true } // Return the updated document
    );

    if (!cart) {
      return res.status(404).json({ success: false, message: "Cart not found." });
    }

    // Populate and send back the updated cart details
    const { items, total } = await populateCartDetails(cart);
    res.status(200).json({ success: true, items, total, message: "Item removed from cart." });
  } catch (error) {
    console.error("removeFromCart Error:", error);
    res.status(500).json({ success: false, message: "Server error.", error: error.message });
  }
};

// --- Update Quantity ---
export const updateCartQuantity = async (req, res) => {
  try {
    const userId = req.user._id; 
    const cartItemId = req.params.cartItemId; 
    const { quantity } = req.body;

    if (!mongoose.Types.ObjectId.isValid(cartItemId)) {
      return res.status(400).json({ success: false, message: "Invalid cart item ID." });
    }

    if (typeof quantity !== "number" || quantity < 0) {
      return res.status(400).json({ success: false, message: "Invalid quantity (must be non-negative)." });
    }

    const cart = await Cart.findOne({ user: userId });
    if (!cart) {
      return res.status(404).json({ success: false, message: "Cart not found." });
    }

    // Find the specific item by its _id within the items array
    const itemIndex = cart.items.findIndex(item => item._id.toString() === cartItemId);
    if (itemIndex === -1) {
      return res.status(404).json({ success: false, message: "Item not found in cart." });
    }

    if (quantity === 0) {
      // Remove item if quantity is set to 0
      cart.items.splice(itemIndex, 1);
    } else {
      // Update quantity
      cart.items[itemIndex].quantity = quantity;
    }

    await cart.save(); 

    // Populate and send back the updated cart details
    const { items, total } = await populateCartDetails(cart);
    res.status(200).json({ success: true, items, total, message: "Quantity updated." });
  } catch (error) {
    console.error("updateCartQuantity Error:", error);
    res.status(500).json({ success: false, message: "Server error.", error: error.message });
  }
};

// --- Clear Cart ---
export const clearCart = async (req, res) => {
  try {
    const userId = req.user._id; 

    // Find the cart and set its items array to empty
    const cart = await Cart.findOneAndUpdate(
      { user: userId },
      { $set: { items: [] } },
      { new: true } 
    );

    if (!cart) {
      
      return res.status(200).json({ success: true, message: "Cart already empty.", items: [], total: 0 });
    }

    res.status(200).json({ success: true, message: "Cart cleared.", items: [], total: 0 });
  } catch (error) {
    console.error("clearCart Error:", error);
    res.status(500).json({ success: false, message: "Server error.", error: error.message });
  }
};