import React, { useEffect, useState } from "react";
import axios from "axios";
import AdminMenu from "../../components/layout/AdminMenu";
import { Modal, Button, Form } from "react-bootstrap";
import CategoryForm from "../../components/Form/CategoryForm"; 

const Createcategory = () => {
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [updatedName, setUpdatedName] = useState("");
  const [show, setShow] = useState(false);

  // Fetch all categories
  const getAllCategories = async () => {
    try {
      const { data } = await axios.get("/api/v1/category/get-category");
      if (data?.success) {
        setCategories(data.category);
      }
    } catch (error) {
      console.log("Error fetching categories", error);
    }
  };

  useEffect(() => {
    getAllCategories();
  }, []);

  // Create new category
  const handleCreate = async () => {
    try {
      const { data } = await axios.post("/api/v1/category/create-category", { name });
      if (data?.success) {
        setName("");
        getAllCategories(); // refresh list
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error("Error creating category", error);
    }
  };

  const handleEdit = (category) => {
    setSelectedCategory(category);
    setUpdatedName(category.name);
    setShow(true);
  };

  const handleUpdate = async () => {
    try {
      const { data } = await axios.put(`/api/v1/category/update-category/${selectedCategory._id}`, {
        name: updatedName,
      });
      if (data?.success) {
        setShow(false);
        getAllCategories();
      }
    } catch (error) {
      console.log("Error updating category", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      const { data } = await axios.delete(`/api/v1/category/delete-category/${id}`);
      if (data?.success) {
        getAllCategories();
      }
    } catch (error) {
      console.log("Error deleting category", error);
    }
  };

  return (
    <div className="container-fluid mt-4">
      <div className="row" style={{ minHeight: "100vh" }}>
        <div className="col-md-3 border-end bg-light">
          <AdminMenu />
        </div>
        <div className="col-md-9 px-4">
          <h4 className="mb-4">Manage Categories</h4>

          {/* New Category Form */}
          <CategoryForm handleSubmit={handleCreate} value={name} setValue={setName} />

          {/* List of categories */}
          <table className="table table-hover shadow-sm">
            <thead className="table-light">
              <tr>
                <th>#</th>
                <th>Category Name</th>
                <th className="text-end">Actions</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((cat, index) => (
                <tr key={cat._id}>
                  <td>{index + 1}</td>
                  <td>{cat.name}</td>
                  <td className="text-end">
                    <Button variant="outline-primary" size="sm" className="me-2" onClick={() => handleEdit(cat)}>
                      Edit
                    </Button>
                    <Button variant="outline-danger" size="sm" onClick={() => handleDelete(cat._id)}>
                      Delete
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Modal */}
      <Modal show={show} onHide={() => setShow(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Edit Category</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="categoryName">
              <Form.Label>Category Name</Form.Label>
              <Form.Control
                type="text"
                value={updatedName}
                onChange={(e) => setUpdatedName(e.target.value)}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShow(false)}>Cancel</Button>
          <Button variant="primary" onClick={handleUpdate}>Update</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Createcategory;
