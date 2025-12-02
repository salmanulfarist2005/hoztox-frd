import React, { useState } from "react";
import {
    Card,
    CardBody,
    Col,
    Row,
    Container,
} from "reactstrap";
import Breadcrumbs from "../../../components/Admin/Breadcrumb";

import { BASE_URL } from '../../helpers/config';
import axios from 'axios';

const AddCategory = () => {
    document.title = "Caratree Diamonds-Dashboard";
    const [categoryName, setCategoryName] = useState(""); 
    const [image, setImage] = useState(null);
    const [errors, setErrors] = useState({});

    const handleImageChange = (e) => {
        const selectedFile = e.target.files[0];  
        setImage(selectedFile);
        
        // Clear error when image is selected
        if (errors.image) {
            setErrors((prevErrors) => {
                const newErrors = { ...prevErrors };
                delete newErrors.image;
                return newErrors;
            });
        }
    };

    // Handle text-only input for category name
    const handleCategoryNameChange = (e) => {
        const value = e.target.value;
        
        // Allow only letters, spaces, and common punctuation
        const regex = /^[a-zA-Z\s\-'&.]*$/;
        
        if (regex.test(value) || value === '') {
            setCategoryName(value);
            
            // Clear error when user starts typing
            if (errors.category_name) {
                setErrors((prevErrors) => {
                    const newErrors = { ...prevErrors };
                    delete newErrors.category_name;
                    return newErrors;
                });
            }
        }
    };

    const validateForm = () => {
        const newErrors = {};

        // Category name validation - required field
        if (!categoryName || !categoryName.trim()) {
            newErrors.category_name = 'This field is required';
        }

        // Image validation - required field
        if (!image) {
            newErrors.image = 'This field is required';
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

        const formData = new FormData();
        formData.append("category_name", categoryName);
        if (image) {
            formData.append("image", image);
        }

        try {
            await axios.post(`${BASE_URL}/products/categories/create/`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',  
                },
            });

            setCategoryName("");
            setImage(null);
            setErrors({});

            // Reset file input
            const fileInput = document.getElementById('example-image-input');
            if (fileInput) {
                fileInput.value = '';
            }

            alert("Category added successfully!");
            console.log("Form data:", formData);
        } catch (error) {
            console.error('Error adding category:', error);
            console.log('Error response data:', error.response?.data);
            
            // Handle backend validation errors
            if (error.response && error.response.data) {
                const backendErrors = {};
                const errorData = error.response.data;
                
                // Check for general error message
                if (errorData.error) {
                    const errorMsg = errorData.error;
                    if (errorMsg.toLowerCase().includes('category') || 
                        errorMsg.toLowerCase().includes('already exists') ||
                        errorMsg.toLowerCase().includes('exist') ||
                        errorMsg.toLowerCase().includes('unique')) {
                        backendErrors.category_name = errorMsg;
                    } else {
                        alert(errorMsg);
                    }
                }
                
                // Handle field-specific errors from serializer
                Object.keys(errorData).forEach((key) => {
                    if (key === 'error') return; // Skip as already handled above
                    
                    let msg = Array.isArray(errorData[key]) 
                        ? errorData[key].join(', ') 
                        : errorData[key];
                    
                    // Check for uniqueness errors in category_name field
                    if (key === 'category_name') {
                        // Convert any serializer uniqueness error to user-friendly message
                        const msgLower = msg.toLowerCase();
                        if (msgLower.includes('already exists') || 
                            msgLower.includes('exist') ||
                            msgLower.includes('unique') ||
                            msgLower.includes('duplicate') ||
                            msgLower.includes('must be unique') ||
                            msgLower.includes('category') && msgLower.includes('this')) {
                            msg = 'This category name already exists. Please use a unique name.';
                        }
                    }
                    
                    backendErrors[key] = msg;
                });
                
                // Handle non-field errors if present
                if (errorData.non_field_errors) {
                    const nonFieldMsg = Array.isArray(errorData.non_field_errors) 
                        ? errorData.non_field_errors.join(', ') 
                        : errorData.non_field_errors;
                    
                    // Check if non-field error is about category uniqueness
                    if (nonFieldMsg.toLowerCase().includes('category') && 
                        (nonFieldMsg.toLowerCase().includes('exists') || 
                         nonFieldMsg.toLowerCase().includes('unique'))) {
                        backendErrors.category_name = 'This category name already exists. Please use a unique name.';
                    } else {
                        alert(nonFieldMsg);
                    }
                }
                
                setErrors(backendErrors);
                
                // Scroll to the first error
                const firstErrorField = Object.keys(backendErrors)[0];
                if (firstErrorField) {
                    const element = document.getElementById(
                        firstErrorField === 'category_name' ? 'category-name' : 'example-image-input'
                    );
                    if (element) {
                        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
                        element.focus();
                    }
                }
            } else {
                alert("Error adding category! Please try again."); 
            }
        }
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
                        <Breadcrumbs title="Product Categories" breadcrumbItem="Add Category" />

                        <Row>
                            <Col>
                                <Card>
                                    <CardBody>
                                        <form onSubmit={handleSubmit}>
                                            <Row className="mb-3">
                                                <label
                                                    htmlFor="category-name"
                                                    className="col-md-2 col-form-label"
                                                >
                                                    Category Name <span className="text-danger">*</span>
                                                </label>
                                                <div className="col-md-10">
                                                    <input
                                                        className={`form-control ${errors.category_name ? 'is-invalid' : ''}`}
                                                        type="text"
                                                        id="category-name"
                                                        placeholder="Category Name"
                                                        value={categoryName}
                                                        onChange={handleCategoryNameChange}
                                                    />
                                                    {renderError('category_name')}
                                                </div>
                                            </Row>

                                            <Row className="mb-3">
                                                <label
                                                    htmlFor="example-image-input"
                                                    className="col-md-2 col-form-label"
                                                >
                                                    Category Logo/Image <span className="text-danger">*</span>
                                                </label>
                                                <div className="col-md-10">
                                                    <input
                                                        className={`form-control ${errors.image ? 'is-invalid' : ''}`}
                                                        type="file"
                                                        id="example-image-input"
                                                        accept="image/*"
                                                        onChange={handleImageChange}
                                                    />
                                                    {renderError('image')}
                                                </div>
                                            </Row>

                                            <div className="d-flex justify-content-end">
                                                <button type="submit" className="btn btn-primary">
                                                    Submit
                                                </button>
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

export default AddCategory;