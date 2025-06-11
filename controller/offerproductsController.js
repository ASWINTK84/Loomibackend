import OfferProduct from "../models/offerproductsModel.js";
import Product from "../models/ProductModel.js";  


// Create an offer product
export const createOfferProduct = async (req, res) => {
  try {
    const { productId, offerPercentage } = req.body;

    if (!productId || !offerPercentage) {
      return res.status(400).json({ success: false, message: "Missing required fields" });
    }

    // Check if product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    // Create and save offer product
    const offerProduct = new OfferProduct({
      product: productId,
      offerPercentage,
    });

    await offerProduct.save();

    res.status(201).json({ success: true, message: "Offer product added", offerProduct });
  } catch (error) {
    console.error("Error adding offer product:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export const getOfferProducts = async (req, res) => {
  try {
    const offerProducts = await OfferProduct.find()
      .populate({
        path: "product",
        populate: {
          path: "category", // this works only if `product.category` is populated
          model: "Category"
        }
      });

    res.status(200).json({
      success: true,
      offerProducts
    });
  } catch (error) {
    console.error("❌ Error fetching offer products:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch offer products"
    });
  }
};


export const updateOfferPercentage = async (req, res) => {
  const { offerPercentage } = req.body;
  const offerProductId = req.params.id;

  try {
    if (offerPercentage === undefined || offerPercentage < 0) {
      return res.status(400).json({ success: false, message: "Invalid offer percentage" });
    }

    const updatedOffer = await OfferProduct.findByIdAndUpdate(
      offerProductId,
      { offerPercentage },   
      { new: true }
    ).populate({
      path: "product",
      populate: {
        path: "category",
        model: "Category"
      }
    });


    if (!updatedOffer) {
      return res.status(404).json({ success: false, message: "Offer product not found" });
    }

    res.json({ success: true, updatedOffer });
  } catch (error) {
    console.error("Error updating offer product:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};



export const deleteOfferProduct = async (req, res) => {
  const offerProductId = req.params.id;

  try {
    const deletedOffer = await OfferProduct.findByIdAndDelete(offerProductId);

    if (!deletedOffer) {
      return res.status(404).json({ success: false, message: "Offer product not found" });
    }

    res.json({ success: true, message: "Offer product deleted successfully" });
  } catch (error) {
    console.error("Error deleting offer product:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
