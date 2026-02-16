import React, { useState, useEffect } from "react";
import { Container, Card, Form, Button } from "react-bootstrap";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { TAXONOMY_DATA } from "../services/constants";
import auditService from "../services/audit";

const DefineTaxonomy = () => {
  const { module } = useParams();
  const navigate = useNavigate();
  const [subCategories, setSubCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedSubCategory, setSelectedSubCategory] = useState("");
  const [loading, setLoading] = useState("");
  const handleCategoryChange = (e) => {
    const key = e.target.value;
    setSelectedCategory(key);
    setSelectedSubCategory("");
    const selected = TAXONOMY_DATA[module][key];
    setSubCategories(selected?.subCategories || []);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedCategory || !selectedSubCategory) {
      alert("Both fields are required");
      return;
    }

    try {
      setLoading("true");
      const data = {
        "category": selectedCategory,
        "sub_category": selectedSubCategory,
        "module": module
      };
      const response = await auditService.saveTaxonomy(data);
      if (response?.data) {
        setLoading(false);
        navigate('/' + module + '/under_process');
      }
    } catch (error) {
      console.error("API Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="py-5 d-flex justify-content-center ">
      <Card  style={{ width: '100%', maxWidth: '600px' }} className="shadow-sm border-0 p-4">
        <Card.Body>
          <h3 className="fw-bold mb-4 text-center">
            Define Taxonomy Structure
          </h3>

          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-4"> 
              <Form.Select value={selectedCategory} onChange={handleCategoryChange}>
                <option value="">Select Category</option>
                {Object.entries(TAXONOMY_DATA[module] || {}).map(
                  ([key, value]) => (
                    <option key={key} value={key}>
                      {value.label}
                    </option>
                  )
                )}
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-4">

              <Form.Select
                value={selectedSubCategory}
                onChange={(e) => setSelectedSubCategory(e.target.value)}
                disabled={!selectedCategory}
              >
                <option value="">Select Subcategory</option>
                {subCategories.map((sub) => (
                  <option key={sub.key} value={sub.key}>
                    {sub.label}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>

            <div className="text-center">
              <Button type="submit" disabled={loading}>
                {loading ? "Submitting..." : "Submit"}
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default DefineTaxonomy;
