import React, { useEffect, useState } from "react";
import AdminMenu from "../../components/layout/AdminMenu";
import axios from "axios";
import { Form, Button, Container, Row, Col, Alert, Card, Image } from "react-bootstrap";

const CreateProduct = () => {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [productData, setProductData] = useState({
    name: "",
    description: "",
    price: "",
    quantity: "",
    shipping: "",
  });
  const [photo, setPhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [message, setMessage] = useState("");

  // Load categories
  useEffect(() => {
    const getCategories = async () => {
      try {
        const { data } = await axios.get("/api/v1/category/get-category");
        if (data?.success) setCategories(data.category);
      } catch (err) {
        console.log("Error fetching categories", err);
      }
    };
    getCategories();
  }, []);

  // Handle input change
  const handleChange = (e) => {
    setProductData({ ...productData, [e.target.name]: e.target.value });
  };

  // Handle category selection
  const handleCategorySelect = (e) => {
    setSelectedCategory(e.target.value);
    setMessage("");
  };

  // Handle photo selection and preview
  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    setPhoto(file);
    if (file) {
      setPhotoPreview(URL.createObjectURL(file));
    } else {
      setPhotoPreview(null);
    }
  };

  // Submit product form
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedCategory) {
      setMessage("Please select a category first.");
      return;
    }
    try {
      const formData = new FormData();
      formData.append("category", selectedCategory);
      Object.keys(productData).forEach((key) => formData.append(key, productData[key]));
      if (photo) formData.append("photo", photo);

      const { data } = await axios.post("/api/v1/product/create-product", formData);
      if (data?.success) {
        setMessage("Product created successfully!");
        setProductData({ name: "", description: "", price: "", quantity: "", shipping: "" });
        setSelectedCategory("");
        setPhoto(null);
        setPhotoPreview(null);
      }
    } catch (err) {
      console.log("Product creation failed", err);
      setMessage("Something went wrong.");
    }
  };

  return (
    <Container fluid className="mt-4">
      <Row>
        <Col md={3}>
          <AdminMenu />
        </Col>

        <Col md={9}>
          <Card className="p-4 shadow-sm">
            <h4 className="mb-4 text-center">Create New Product</h4>

            {message && <Alert variant="info">{message}</Alert>}

            {/* Step 1: Select Category */}
            <Form.Group className="mb-4">
              <Form.Label><strong>Select Category</strong></Form.Label>
              <Form.Select
                value={selectedCategory}
                onChange={handleCategorySelect}
                aria-label="Select Category"
              >
                <option value="">-- Select a category --</option>
                {categories.map((cat) => (
                  <option key={cat._id} value={cat._id}>
                    {cat.name}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>

            {/* Step 2: Show product form only if category selected */}
            {selectedCategory && (
              <Form onSubmit={handleSubmit} encType="multipart/form-data">
                <Form.Group className="mb-3">
                  <Form.Label>Product Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="name"
                    value={productData.name}
                    onChange={handleChange}
                    placeholder="Enter product name"
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Description</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    name="description"
                    value={productData.description}
                    onChange={handleChange}
                    placeholder="Enter product description"
                    required
                  />
                </Form.Group>

                <Row>
                  <Col md={4}>
                    <Form.Group className="mb-3">
                      <Form.Label>Price</Form.Label>
                      <Form.Control
                        type="number"
                        name="price"
                        value={productData.price}
                        onChange={handleChange}
                        placeholder="Enter price"
                        required
                      />
                    </Form.Group>
                  </Col>

                  <Col md={4}>
                    <Form.Group className="mb-3">
                      <Form.Label>Quantity</Form.Label>
                      <Form.Control
                        type="number"
                        name="quantity"
                        value={productData.quantity}
                        onChange={handleChange}
                        placeholder="Enter quantity"
                        required
                      />
                    </Form.Group>
                  </Col>

                  <Col md={4}>
                    <Form.Group className="mb-3">
                      <Form.Label>Shipping</Form.Label>
                      <Form.Select
                        name="shipping"
                        value={productData.shipping}
                        onChange={handleChange}
                        required
                      >
                        <option value="">Select shipping option</option>
                        <option value="0">No</option>
                        <option value="1">Yes</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>
                </Row>

                <Form.Group className="mb-3">
                  <Form.Label>Product Photo</Form.Label>
                  <Form.Control
                    type="file"
                    name="photo"
                    onChange={handlePhotoChange}
                    accept="image/*"
                  />
                </Form.Group>

                {/* Show small image preview */}
                {photoPreview && (
                  <div className="mb-3">
                    <Image
                      src={photoPreview}
                      alt="Preview"
                      thumbnail
                      style={{ width: "150px", height: "150px", objectFit: "cover" }}
                    />
                  </div>
                )}

                <Button variant="success" type="submit">
                  Create Product
                </Button>
              </Form>
            )}
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default CreateProduct;
