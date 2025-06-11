import React, { useEffect, useState } from "react";
import axios from "axios";
import { Container, Row, Col, Card, Table, Button, Alert } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import AdminMenu from "../../components/layout/AdminMenu";

const Product = () => {
  const [categoriesWithProducts, setCategoriesWithProducts] = useState([]);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      const catRes = await axios.get("/api/v1/category/get-category");
      if (catRes?.data?.success) {
        const categories = catRes.data.category;

        const categoryData = await Promise.all(
          categories.map(async (cat) => {
            const productRes = await axios.get(
              `/api/v1/product/products-by-category/${cat._id}`
            );
            return {
              category: cat.name,
              categoryId: cat._id,
              products: productRes?.data?.products || [],
            };
          })
        );

        setCategoriesWithProducts(categoryData);
      }
    } catch (err) {
      console.error("Error loading categories or products", err);
      setError("Failed to load products. Please try again.");
    }
  };

  const handleEdit = (productId) => {
    navigate(`/dashboard/admin/update-product/${productId}`);
  };

  const handleDelete = async (productId, categoryId) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;

    try {
      const { data } = await axios.delete(`/api/v1/product/delete-product/${productId}`);

      if (data.success) {
        setSuccessMsg("Product deleted successfully.");

        // Update state: remove deleted product from products list
        setCategoriesWithProducts((prev) =>
          prev.map((catGroup) =>
            catGroup.categoryId === categoryId
              ? {
                  ...catGroup,
                  products: catGroup.products.filter((p) => p._id !== productId),
                }
              : catGroup
          )
        );
      } else {
        setError("Failed to delete product.");
      }
    } catch (error) {
      console.error("Delete failed", error);
      setError("Something went wrong during delete.");
    }

    // Clear messages after 3 seconds
    setTimeout(() => {
      setError("");
      setSuccessMsg("");
    }, 3000);
  };

  return (
    <Container fluid className="mt-4">
      <Row>
        <Col md={3}>
          <AdminMenu />
        </Col>
        <Col md={9}>
          <Card className="p-4 shadow-sm">
            <h4 className="mb-4 text-center">All Products by Category</h4>

            {error && <Alert variant="danger">{error}</Alert>}
            {successMsg && <Alert variant="success">{successMsg}</Alert>}

            {categoriesWithProducts.map((catGroup) => (
              <div key={catGroup.categoryId} className="mb-5">
                <h5 className="mb-3">{catGroup.category}</h5>
                <Table striped bordered hover responsive>
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Description</th>
                      <th>Price</th>
                      <th>Quantity</th>
                      <th>Shipping</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {catGroup.products.map((product) => (
                      <tr key={product._id}>
                        <td>{product.name}</td>
                        <td>{product.description}</td>
                        <td>₹{product.price}</td>
                        <td>{product.quantity}</td>
                        <td>{product.shipping ? "Yes" : "No"}</td>
                        <td>
                          <Button
                            variant="warning"
                            size="sm"
                            className="me-2"
                            onClick={() => handleEdit(product._id)}
                          >
                            Edit
                          </Button>
                          <Button
                            variant="danger"
                            size="sm"
                            onClick={() => handleDelete(product._id, catGroup.categoryId)}
                          >
                            Delete
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            ))}
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Product;
