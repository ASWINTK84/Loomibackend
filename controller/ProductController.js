import slugify from "slugify";
import ProductModel from "../models/ProductModel.js";
import cloudinary from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// CREATE PRODUCT
export const createProductController = async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      quantity,
      category,
      shipping,
      colors = [],
      sizes = [],
      imageUrl,
    } = req.body;

    // Validation for required fields
    if (!name || !description || !price || !quantity || !category) {
      return res.status(400).json({ success: false, message: "All fields required" });
    }

    // Validate colors and sizes arrays (optional)
    const allowedColors = ['red', 'green', 'white', 'black', 'blue'];
    const allowedSizes = ['s', 'm', 'l', 'xl', 'xxl'];

    const validColors = colors.every((c) => allowedColors.includes(c));
    const validSizes = sizes.every((s) => allowedSizes.includes(s));

    if (!validColors) {
      return res.status(400).json({ success: false, message: "Invalid color value(s)" });
    }
    if (!validSizes) {
      return res.status(400).json({ success: false, message: "Invalid size value(s)" });
    }

    const product = new ProductModel({
      name,
      slug: slugify(name),
      description,
      price,
      quantity,
      shipping,
      category,
      colors,
      sizes,
      imageUrl, // optional Cloudinary image URL
    });

    await product.save();

    res.status(201).json({
      success: true,
      message: "Product created successfully",
      product,
    });
  } catch (error) {
    console.error("Create Product Error:", error);
    res.status(500).json({
      success: false,
      message: "Error while creating product",
      error,
    });
  }
};

// GET ALL PRODUCTS (exclude photo field, populate category if needed)
export const getProductController = async (req, res) => {
  try {
    const products = await ProductModel.find({})
      //.populate("category") // uncomment if category is a ref
      .select("-photo")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      countTotal: products.length,
      message: "All products fetched successfully",
      products,
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({
      success: false,
      message: "Error while getting products",
      error,
    });
  }
};

// GET SINGLE PRODUCT BY SLUG
export const getSingleProductBySlugController = async (req, res) => {
  try {
    const { slug } = req.params;

    const product = await ProductModel.findOne({ slug })
      //.populate("category")
      .select("-photo");

    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    res.status(200).json({ success: true, product });
  } catch (error) {
    console.error("Error fetching product by slug:", error);
    res.status(500).json({
      success: false,
      message: "Something went wrong while getting the product",
      error,
    });
  }
};

// GET PRODUCT PHOTO
export const productPhotoController = async (req, res) => {
  try {
    const product = await ProductModel.findById(req.params.pid).select("photo");

    if (product?.photo?.data) {
      res.set("Content-Type", product.photo.contentType);
      return res.status(200).send(product.photo.data);
    } else {
      return res.status(404).json({ success: false, message: "Photo not found" });
    }
  } catch (error) {
    console.error("Error fetching photo:", error);
    res.status(500).json({
      success: false,
      message: "Error while fetching photo",
      error,
    });
  }
};

// DELETE PRODUCT
export const deleteProductController = async (req, res) => {
  try {
    const product = await ProductModel.findByIdAndDelete(req.params.pid).select("-photo");

    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    res.status(200).json({
      success: true,
      message: "Product deleted successfully",
      product,
    });
  } catch (error) {
    console.error("Error deleting product:", error);
    res.status(500).json({
      success: false,
      message: "Error while deleting product",
      error,
    });
  }
};

// UPDATE PRODUCT (Supports Partial Updates)



// GET PRODUCTS BY CATEGORY
export const getProductsByCategoryController = async (req, res) => {
  try {
    const categoryId = req.params.cid;
    const products = await ProductModel.find({ category: categoryId }).select("-photo");

    res.status(200).json({ success: true, products });
  } catch (error) {
    console.error("Error fetching products by category:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch products by category",
      error,
    });
  }
};

// PRODUCT FILTERS (filter by category, price range, sizes, colors, etc.)
export const productFiltersController = async (req, res) => {
  try {
    const {
      checked = [], // array of category IDs
      radio = [], // price range [min, max]
      sizes = [], // selected sizes
      colors = [], // selected colors
      page = 1,
      limit = 12,
    } = req.body;

    let filterArgs = {};

    if (checked.length > 0) filterArgs.category = { $in: checked };
    if (radio.length === 2) filterArgs.price = { $gte: radio[0], $lte: radio[1] };
    if (sizes.length > 0) filterArgs.sizes = { $in: sizes };
    if (colors.length > 0) filterArgs.colors = { $in: colors };

    const skip = (page - 1) * limit;

    const products = await ProductModel.find(filterArgs)
      .select("-photo")
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const total = await ProductModel.countDocuments(filterArgs);

    res.status(200).json({
      success: true,
      products,
      total,
    });
  } catch (error) {
    console.error("Error filtering products:", error);
    res.status(500).json({
      success: false,
      message: "Error while filtering products",
      error,
    });
  }
};

// PRODUCT LIST PAGINATION (for home page or shop page)
export const productListController = async (req, res) => {
  try {
    const perPage = parseInt(req.query.limit) || 12;
    const page = req.params.page ? parseInt(req.params.page) : 1;

    const products = await ProductModel.find({})
      .select("-photo")
      .skip((page - 1) * perPage)
      .limit(perPage)
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, products });
  } catch (error) {
    console.error("Error in product list pagination:", error);
    res.status(400).json({
      success: false,
      message: "Error in product list pagination controller",
      error,
    });
  }
};

// PRODUCT COUNT
export const productCountController = async (req, res) => {
  try {
    const total = await ProductModel.estimatedDocumentCount();

    res.status(200).json({
      success: true,
      total,
    });
  } catch (error) {
    console.error("Error in product count:", error);
    res.status(400).json({
      success: false,
      message: "Error in product count",
      error,
    });
  }
};

// SEARCH PRODUCTS BY NAME
export const searchProductController = async (req, res) => {
  try {
    const keyword = req.params.keyword;

    const products = await ProductModel.find({
      name: { $regex: keyword, $options: "i" },
    }).select("-photo");

    res.status(200).json(products);
  } catch (error) {
    console.error("Search error:", error);
    res.status(500).json({ error: "Search failed" });
  }
};

// GET PRODUCT BY ID
export const getProductByIdController = async (req, res) => {
  try {
    const product = await ProductModel.findById(req.params.pid);
    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }
    res.status(200).json({ success: true, product });
  } catch (error) {
    console.error("Error fetching product by ID:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};







export const updateProductController = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      name,
      description,
      price,
      quantity,
      category,
      shipping,
    } = req.fields;

    let colors = req.fields.colors || [];
    let sizes = req.fields.sizes || [];

    // If coming as stringified arrays (from FormData), parse them
    if (typeof colors === "string") {
      colors = JSON.parse(colors);
    }
    if (typeof sizes === "string") {
      sizes = JSON.parse(sizes);
    }

    // Validation
    const allowedColors = ["red", "green", "white", "black", "blue"];
    const allowedSizes = ["s", "m", "l", "xl", "xxl"];

    const isValidColors = colors.every((c) => allowedColors.includes(c));
    const isValidSizes = sizes.every((s) => allowedSizes.includes(s));

    if (!isValidColors) {
      return res.status(400).json({ success: false, message: "Invalid color values" });
    }
    if (!isValidSizes) {
      return res.status(400).json({ success: false, message: "Invalid size values" });
    }

    // Find the product
    const product = await ProductModel.findById(id);
    if (!product) return res.status(404).json({ success: false, message: "Product not found" });

    // Update fields
    product.name = name;
    product.slug = slugify(name);
    product.description = description;
    product.price = price;
    product.quantity = quantity;
    product.category = category;
    product.shipping = shipping === "1" || shipping === true;
    product.colors = colors;
    product.sizes = sizes;

    // Optional: update photo
    if (req.files?.photo) {
      const result = await cloudinary.uploader.upload(req.files.photo.path, {
        folder: "ecommerce/products",
      });
      product.imageUrl = result.secure_url;
    }

    await product.save();

    res.status(200).json({
      success: true,
      message: "Product updated successfully",
      product,
    });
  } catch (error) {
    console.error("Update Product Error:", error);
    res.status(500).json({
      success: false,
      message: "Error while updating product",
      error,
    });
  }
};