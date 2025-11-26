import React, { useState, useEffect } from "react";
import {
  Card,
  CardBody,
  Col,
  Row,
  Container,
} from "reactstrap";

import axios from "axios";
import Breadcrumbs from "../../../components/Admin/Breadcrumb";

import { BASE_URL } from '../../helpers/config';

const AddProduct = () => {
  document.title = "Caratree Diamonds-Dashboard ";
  const [category, setCategory] = useState([]);
  const [formData, setFormData] = useState({
    SKU: "",
    product_name: "",
    category: "",
    gross_weight: "",
    diamond_weight: "",
    colour_stones: "",
    net_weight: "",
    product_image: null,
    description: "",
    usertypes: []
  });

  const [images, setImages] = useState([]);
  const [categories, setCategories] = useState([]);
  const [userTypes, setUserTypes] = useState([]);
  const [errors, setErrors] = useState({});
  const [selectedUserTypes, setSelectedUserTypes] = useState([]);

  const handleImageChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setImages((prevImages) => [...prevImages, ...selectedFiles]);
  };

  const handleRemoveImage = (index) => {
    setImages((prevImages) => prevImages.filter((_, i) => i !== index));
  };

  const renderImagePreviews = () => {
    return images.map((image, index) => (
      <div key={index} style={{ position: 'relative', margin: '5px' }}>
        <img
          src={URL.createObjectURL(image)}
          alt={`preview ${index + 1}`}
          style={{ width: '100px', height: '100px' }}
        />
        <button
          onClick={() => handleRemoveImage(index)}
          style={{
            position: 'absolute',
            top: '5px',
            right: '5px',
            background: 'gray',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
          }}
        >
          X
        </button>
      </div>
    ));
  };

  const fetchCategory = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/products/categories/`);
      const category = response.data;

      if (Array.isArray(category)) {
        setCategories(category);
        console.log("response", response.data)
      } else {
        console.warn("Unexpected data format:", category);
        setCategory([]);
      }
    } catch (error) {
      console.error('Error fetching category:', error);
      setCategory([]);
    }
  };

  useEffect(() => {
    fetchCategory();
  }, []);

  const fetchUserTypes = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/products/usertypes_list/`);
      console.log("Full response:", response.data);
  
      const userTypesData = response.data;
  
      if (Array.isArray(userTypesData)) {
        setUserTypes(userTypesData);
        const allUserTypeIds = userTypesData.map((userType) => userType.id);
        setSelectedUserTypes(allUserTypeIds);
  
        setFormData((prevData) => ({
          ...prevData,
          usertypes: allUserTypeIds,
        }));
  
        console.log("Selected user types (default):", allUserTypeIds);
      } else {
        console.warn("Unexpected data format:", userTypesData);
        setUserTypes([]);
      }
    } catch (error) {
      console.error('Error fetching user types:', error);
      setUserTypes([]);
    }
  };
  
  useEffect(() => {
    fetchUserTypes();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Clear error for this field on change
    if (errors[name]) {
      setErrors((prevErrors) => {
        const newErrors = { ...prevErrors };
        delete newErrors[name];
        return newErrors;
      });
    }
  
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const validateForm = () => {
    const newErrors = {};

    // SKU validation - required field
    if (!formData.SKU || !formData.SKU.trim()) {
      newErrors.SKU = 'This field is required';
    }

    // Product name validation - required field
    if (!formData.product_name || !formData.product_name.trim()) {
      newErrors.product_name = 'This field is required';
    }

    // Category validation - required field
    if (!formData.category) {
      newErrors.category = 'This field is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Client-side validation
    if (!validateForm()) {
      return;
    }
  
    const productFormData = new FormData();
    console.log("productFormData", formData);
  
    for (const key in formData) {
      if (key === "usertypes") {
        selectedUserTypes.forEach((userTypeId) => {
          productFormData.append("usertypes", String(userTypeId));
        });
      } else if (key === "description" && !formData[key]) {
        continue;
      } else {
        productFormData.append(key, formData[key]);
      }
    }
  
    images.forEach((image) => {
      productFormData.append("additional_images", image);
    });
  
    try {
      const response = await axios.post(`${BASE_URL}/products/products/`, productFormData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
  
      console.log("Product added:", response.data);
      alert("Product added successfully!");
  
      setFormData({
        SKU: "",
        product_name: "",
        category: "",
        gross_weight: "",
        diamond_weight: "",
        colour_stones: "",
        net_weight: "",
        product_image: null,
        description: "",  
        usertypes: [],
      });
      setErrors({});
      setImages([]);
      setSelectedUserTypes([]);
    } catch (error) {
      console.error("Error adding product:", error.response ? error.response.data : error.message);
      
      // Handle backend validation errors
      if (error.response && error.response.data) {
        const backendErrors = {};
        
        Object.keys(error.response.data).forEach((key) => {
          // Map backend keys to frontend field names
          const frontendKey = key === 'sku' ? 'SKU' : key;
          const msg = Array.isArray(error.response.data[key]) 
            ? error.response.data[key].join(', ') 
            : error.response.data[key];
          backendErrors[frontendKey] = msg;
        });
        
        // Handle non-field errors if present
        if (error.response.data.non_field_errors) {
          alert(Array.isArray(error.response.data.non_field_errors) 
            ? error.response.data.non_field_errors.join(', ') 
            : error.response.data.non_field_errors);
        }
        
        setErrors(backendErrors);
      } else {
        alert('An error occurred while adding the product. Please try again.');
      }
    }
  };

  const handleCheckboxChange = (event) => {
    const { value } = event.target;
    const userTypeId = parseInt(value, 10);
  
    setSelectedUserTypes((prevSelected) => {
      const updatedSelection = prevSelected.includes(userTypeId)
        ? prevSelected.filter((id) => id !== userTypeId)  
        : [...prevSelected, userTypeId]; 
  
      setFormData((prevData) => ({
        ...prevData,
        usertypes: updatedSelection,
      }));
  
      return updatedSelection;
    });
  };

  const renderError = (field) => {
    if (errors[field]) {
      return (
        <div className="invalid-feedback d-block text-danger" style={{ fontSize: '0.875rem', marginTop: '0.25rem' }}>
          {errors[field]}
        </div>
      );
    }
    return null;
  };

  return (
    <React.Fragment>
      <div className="main-content">
        <div className="page-content ">
          <Container fluid={true}>
            <Breadcrumbs title="Products" breadcrumbItem="Add Products" />
            <Row>
              <Col>
                <Card>
                  <CardBody>
                    <form onSubmit={handleSubmit}>
                      <Row className="mb-3 mt-2">
                        <label htmlFor="SKU" className="col-md-2 col-form-label">
                          SKU <span className="text-danger">*</span>
                        </label>
                        <div className="col-md-10">
                          <input
                            className={`form-control ${errors.SKU ? 'is-invalid' : ''}`}
                            type="text"
                            name="SKU"
                            placeholder="SKU"
                            value={formData.SKU}
                            onChange={handleChange}
                          />
                          {renderError('SKU')}
                        </div>
                      </Row>
                      
                      <Row className="mb-3">
                        <label htmlFor="product_name" className="col-md-2 col-form-label">
                          Product Name <span className="text-danger">*</span>
                        </label>
                        <div className="col-md-10">
                          <input
                            className={`form-control ${errors.product_name ? 'is-invalid' : ''}`}
                            type="text"
                            name="product_name"
                            value={formData.product_name}
                            placeholder="Product Name"
                            onChange={handleChange}
                          />
                          {renderError('product_name')}
                        </div>
                      </Row>
                      
                      <Row className="mb-3">
                        <label htmlFor="category" className="col-md-2 col-form-label">
                          Product Category <span className="text-danger">*</span>
                        </label>
                        <div className="col-md-10">
                          <select 
                            className={`form-control ${errors.category ? 'is-invalid' : ''}`} 
                            value={formData.category} 
                            name="category" 
                            onChange={handleChange}
                          >
                            <option value="">Select Product Category</option>
                            {categories.map((category) => (
                              <option key={category.id} value={category.id}>
                                {category.category_name}
                              </option>
                            ))}
                          </select>
                          {renderError('category')}
                        </div>
                      </Row>

                      <Row className="mb-3">
                        <label htmlFor="gross_weight" className="col-md-2 col-form-label">Gross Weight (gm)</label>
                        <div className="col-md-10">
                          <input
                            className="form-control"
                            type="text"
                            name="gross_weight"
                            placeholder="Gross Weight"
                            value={formData.gross_weight}
                            onChange={handleChange}
                          />
                        </div>
                      </Row>
                      
                      <Row className="mb-3">
                        <label htmlFor="diamond_weight" className="col-md-2 col-form-label">Diamond Weight (gm)</label>
                        <div className="col-md-10">
                          <input
                            className="form-control"
                            type="text"
                            name="diamond_weight"
                            placeholder="Diamond Weight"
                            value={formData.diamond_weight}
                            onChange={handleChange}
                          />
                        </div>
                      </Row>
                      
                      <Row className="mb-3">
                        <label htmlFor="colour_stones" className="col-md-2 col-form-label">Colour Stones (gm)</label>
                        <div className="col-md-10">
                          <input
                            className="form-control"
                            type="text"
                            name="colour_stones"
                            placeholder="Colour Stones"
                            value={formData.colour_stones}
                            onChange={handleChange}
                          />
                        </div>
                      </Row>
                      
                      <Row className="mb-3">
                        <label htmlFor="net_weight" className="col-md-2 col-form-label">Net Weight (gm)</label>
                        <div className="col-md-10">
                          <input
                            className="form-control"
                            type="text"
                            name="net_weight"
                            placeholder="Net Weight"
                            value={formData.net_weight}
                            onChange={handleChange}
                          />
                        </div>
                      </Row>
                      
                      <Row className="mb-3">
                        <label htmlFor="product_image" className="col-md-2 col-form-label">Product Image</label>
                        <div className="col-md-10">
                          <input
                            className="form-control"
                            type="file"
                            name="product_image"
                            accept="image/*"
                            onChange={(e) => setFormData({ ...formData, product_image: e.target.files[0] })}
                          />
                        </div>
                      </Row>
                      
                      <Row className="mb-3">
                        <label htmlFor="additional_images" className="col-md-2 col-form-label">Product Gallery</label>
                        <div className="col-md-10">
                          <input
                            className="form-control"
                            type="file"
                            accept="image/*"
                            multiple
                            onChange={handleImageChange}
                          />
                        </div>
                      </Row>
                      
                      <div>
                        {images.length > 0 && <h5>Image Previews:</h5>}
                        <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                          {renderImagePreviews()}
                        </div>
                      </div>
                      
                      <Row className="mb-3">
                        <label htmlFor="description" className="col-md-2 col-form-label">Description</label>
                        <div className="col-md-10">
                          <textarea
                            className="form-control"
                            name="description"
                            placeholder="Description"
                            value={formData.description}
                            onChange={handleChange}
                            rows="3"
                          />
                        </div>
                      </Row>
                      
                      <Row className="mb-3">
                        <label htmlFor="usertypes" className="col-md-2 d-flex align-items-center">User Types</label>
                        <div className="col-md-10 d-flex flex-wrap">
                          {userTypes.map((userType) => (
                            <div key={userType.id} className="form-check me-4">
                              <input
                                type="checkbox"
                                className="form-check-input"
                                id={`usertype-${userType.id}`}
                                value={userType.id}
                                onChange={handleCheckboxChange}
                                checked={selectedUserTypes.includes(userType.id)}
                              />
                              <label htmlFor={`usertype-${userType.id}`} className="form-check-label">
                                {userType.usertype}
                              </label>
                            </div>
                          ))}
                        </div>
                      </Row>
                      
                      <div className="d-flex justify-content-end">
                        <button type="submit" className="btn btn-primary">Add Product</button>
                      </div>
                    </form>
                  </CardBody>
                </Card>
              </Col>
            </Row>
          </Container>
        </div>
      </div>
    </React.Fragment>
  );
};

export default AddProduct;