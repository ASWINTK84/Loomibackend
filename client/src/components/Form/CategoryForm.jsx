import React, { useState } from "react";
import { Form, Button } from "react-bootstrap";

const CategoryForm = ({ handleSubmit, value, setValue }) => {
  const [error, setError] = useState("");

  const onSubmit = (e) => {
    e.preventDefault();
    if (!value.trim()) {
      setError("Category name cannot be empty.");
      return;
    }
    handleSubmit();
    setError("");
  };

  return (
    <Form onSubmit={onSubmit} className="mb-4">
      <Form.Group controlId="categoryName">
        <Form.Label>Category Name</Form.Label>
        <Form.Control
          type="text"
          placeholder="Enter category name"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className="shadow-sm"
        />
        {error && <div className="text-danger mt-1">{error}</div>}
      </Form.Group>
      <Button type="submit" variant="success" className="mt-3 px-4">
        Add Category
      </Button>
    </Form>
  );
};

export default CategoryForm;
