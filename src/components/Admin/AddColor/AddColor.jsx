import React, { useState, useEffect } from 'react';
import {
    Button, Card, CardBody, CardHeader,
    Col, Container, Row, Modal, ModalBody,
    ModalFooter, ModalHeader
} from 'reactstrap';
import Breadcrumbs from "../../../components/Admin/Breadcrumb";

import { Link } from 'react-router-dom';
import axios from 'axios';
import { BASE_URL } from '../../helpers/config';

const AddColor = () => {
    const [colors, setColors] = useState([]);
    const [currentColor, setCurrentColor] = useState({ id: null, color: "" });
    const [isEditMode, setIsEditMode] = useState(false);
    const [modal_list, setModalList] = useState(false);
    const [modal_list1, setModalList1] = useState(false);
    const [formData, setFormData] = useState({ color: '' });
    const [searchTerm, setSearchTerm] = useState("");
    const [errors, setErrors] = useState({});

    const toggleAddModal = () => {
        setModalList(!modal_list);
        setIsEditMode(false);
        clearForm();
    };

    const toggleEditModal = (color) => {
        setModalList1(!modal_list1);
        setIsEditMode(true);
        if (color) {
            setCurrentColor(color);
            setFormData({ color: color.color });
            console.log("Editing Color:", color.color);
        } else {
            clearForm();
        }
    };

    const fetchColors = async () => {
        try {
            const response = await axios.get(`${BASE_URL}/products/colors_list/`);
            console.log("Response data:", response.data);

            if (Array.isArray(response.data)) {
                setColors(response.data);
            } else {
                console.warn("Unexpected data format:", response);
                setColors([]);
            }
        } catch (error) {
            console.error('Error fetching colors:', error);
            setColors([]);
        }
    };

    useEffect(() => {
        fetchColors();
    }, []);

    const filteredColors = colors.filter(color =>
        color.color && color.color.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        
        // Validation for text-only field - only letters and spaces allowed
        if (name === 'color') {
            const textRegex = /^[a-zA-Z\s]*$/;
            if (!textRegex.test(value)) {
                return; // Don't update if invalid characters
            }
        }
        
        // Clear error when user starts typing
        if (errors[name]) {
            setErrors((prevErrors) => {
                const newErrors = { ...prevErrors };
                delete newErrors[name];
                return newErrors;
            });
        }
        
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.color || !formData.color.trim()) {
            newErrors.color = 'This field is required';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const addColor = async (e) => {
        e.preventDefault();

        // Client-side validation
        if (!validateForm()) {
            return;
        }

        try {
            await axios.post(`${BASE_URL}/products/colors/`, { color: formData.color });
            fetchColors();
            toggleAddModal();
            alert("Color added successfully!");
        } catch (error) {
            console.error('Error adding color:', error);
            
            // Handle backend validation errors
            if (error.response && error.response.data) {
                const backendErrors = {};
                const errorData = error.response.data;
                
                // Check for general error message
                if (errorData.error) {
                    const errorMsg = errorData.error;
                    if (errorMsg.toLowerCase().includes('color') || 
                        errorMsg.toLowerCase().includes('already exists') ||
                        errorMsg.toLowerCase().includes('exist') ||
                        errorMsg.toLowerCase().includes('unique')) {
                        backendErrors.color = errorMsg;
                    } else {
                        alert(errorMsg);
                    }
                }
                
                // Handle field-specific errors from serializer
                Object.keys(errorData).forEach((key) => {
                    if (key === 'error') return;
                    
                    let msg = Array.isArray(errorData[key]) 
                        ? errorData[key].join(', ') 
                        : errorData[key];
                    
                    if (key === 'color') {
                        const msgLower = msg.toLowerCase();
                        if (msgLower.includes('already exists') || 
                            msgLower.includes('exist') ||
                            msgLower.includes('unique') ||
                            msgLower.includes('duplicate')) {
                            msg = 'This color already exists. Please use a unique color name.';
                        }
                    }
                    
                    backendErrors[key] = msg;
                });
                
                // Handle non-field errors
                if (errorData.non_field_errors) {
                    const nonFieldMsg = Array.isArray(errorData.non_field_errors) 
                        ? errorData.non_field_errors.join(', ') 
                        : errorData.non_field_errors;
                    
                    if (nonFieldMsg.toLowerCase().includes('color') && 
                        (nonFieldMsg.toLowerCase().includes('exists') || 
                         nonFieldMsg.toLowerCase().includes('unique'))) {
                        backendErrors.color = 'This color already exists. Please use a unique color name.';
                    } else {
                        alert(nonFieldMsg);
                    }
                }
                
                setErrors(backendErrors);
            } else {
                alert('Error adding color. Please try again.');
            }
        }
    };

    const updateColor = async (e) => {
        e.preventDefault();

        // Client-side validation
        if (!validateForm()) {
            return;
        }

        if (!currentColor || !currentColor.id) {
            console.error('No color selected.');
            return;
        }

        try {
            await axios.put(`${BASE_URL}/products/colors/${currentColor.id}/`, { color: formData.color });
            fetchColors();
            toggleEditModal(null);
            alert("Color updated successfully!");
        } catch (error) {
            console.error('Error updating color:', error);
            
            // Handle backend validation errors
            if (error.response && error.response.data) {
                const backendErrors = {};
                const errorData = error.response.data;
                
                // Check for general error message
                if (errorData.error) {
                    const errorMsg = errorData.error;
                    if (errorMsg.toLowerCase().includes('color') || 
                        errorMsg.toLowerCase().includes('already exists') ||
                        errorMsg.toLowerCase().includes('exist') ||
                        errorMsg.toLowerCase().includes('unique')) {
                        backendErrors.color = errorMsg;
                    } else {
                        alert(errorMsg);
                    }
                }
                
                // Handle field-specific errors
                Object.keys(errorData).forEach((key) => {
                    if (key === 'error') return;
                    
                    let msg = Array.isArray(errorData[key]) 
                        ? errorData[key].join(', ') 
                        : errorData[key];
                    
                    if (key === 'color') {
                        const msgLower = msg.toLowerCase();
                        if (msgLower.includes('already exists') || 
                            msgLower.includes('exist') ||
                            msgLower.includes('unique') ||
                            msgLower.includes('duplicate')) {
                            msg = 'This color already exists. Please use a unique color name.';
                        }
                    }
                    
                    backendErrors[key] = msg;
                });
                
                // Handle non-field errors
                if (errorData.non_field_errors) {
                    const nonFieldMsg = Array.isArray(errorData.non_field_errors) 
                        ? errorData.non_field_errors.join(', ') 
                        : errorData.non_field_errors;
                    
                    if (nonFieldMsg.toLowerCase().includes('color') && 
                        (nonFieldMsg.toLowerCase().includes('exists') || 
                         nonFieldMsg.toLowerCase().includes('unique'))) {
                        backendErrors.color = 'This color already exists. Please use a unique color name.';
                    } else {
                        alert(nonFieldMsg);
                    }
                }
                
                setErrors(backendErrors);
            } else {
                alert('Error updating color. Please try again.');
            }
        }
    };

    const deleteColor = async (colorId) => {
        if (window.confirm("Are you sure you want to delete this color?")) {
            try {
                await axios.delete(`${BASE_URL}/products/colors/${colorId}/`);
                fetchColors();
                alert("Color deleted successfully!");
            } catch (error) {
                console.error('Error deleting color:', error);
                alert("Error deleting color. Please try again.");
            }
        }
    };

    const clearForm = () => {
        setFormData({ color: '' });
        setCurrentColor({ id: null, color: "" });
        setErrors({});
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
                    <Container fluid>
                        <Breadcrumbs title="Products" breadcrumbItem="Colors" />
                        <Row>
                            <Col lg={12}>
                                <Card>
                                    <CardBody>
                                        <div id="colorList">
                                            <Row className="g-4 mb-3">
                                                <Col className="col-sm-auto">
                                                    <div className="d-flex gap-1">
                                                        <Button color="primary" onClick={toggleAddModal} id="create-btn">
                                                            <i className="ri-add-line align-bottom me-1"></i> Add Color
                                                        </Button>
                                                    </div>
                                                </Col>
                                                <Col className="col-sm">
                                                    <div className="d-flex justify-content-sm-end">
                                                        <div className="search-box ms-2" style={{ position: 'relative' }}>
                                                            <input
                                                                type="text"
                                                                className="form-control search"
                                                                placeholder="Search..."
                                                                style={{ paddingRight: '30px' }}
                                                                value={searchTerm}
                                                                onChange={handleSearchChange}
                                                            />
                                                            <i className="ri-search-line search-icon" style={{
                                                                position: 'absolute',
                                                                right: '10px',
                                                                top: '50%',
                                                                transform: 'translateY(-50%)',
                                                                pointerEvents: 'none'
                                                            }}></i>
                                                        </div>
                                                    </div>
                                                </Col>
                                            </Row>

                                            <div className="table-responsive table-card mt-3 mb-1">
                                                <table className="table align-middle table-nowrap">
                                                    <thead className="table-light">
                                                        <tr>
                                                            <th scope="col">Color Name</th>
                                                            <th scope="col">Action</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {filteredColors.length > 0 ? (
                                                            filteredColors.map(color => (
                                                                <tr key={color.id}>
                                                                    <td>{color.color}</td>
                                                                    <td>
                                                                        <div className="d-flex gap-2">
                                                                            <button
                                                                                onClick={() => toggleEditModal(color)}
                                                                                title="Edit"
                                                                                style={{
                                                                                    background: 'none',
                                                                                    border: 'none',
                                                                                    padding: '5px',
                                                                                    cursor: 'pointer',
                                                                                    display: 'inline-block'
                                                                                }}
                                                                            >
                                                                                <i className="ri-pencil-line" style={{ fontSize: '18px', color: '#10b981' }}></i>
                                                                            </button>

                                                                            <button
                                                                                onClick={() => deleteColor(color.id)}
                                                                                title="Delete"
                                                                                style={{
                                                                                    background: 'none',
                                                                                    border: 'none',
                                                                                    padding: '5px',
                                                                                    cursor: 'pointer',
                                                                                    display: 'inline-block'
                                                                                }}
                                                                            >
                                                                                <i className="ri-delete-bin-line" style={{ fontSize: '18px', color: '#ef4444' }}></i>
                                                                            </button>
                                                                        </div>
                                                                    </td>
                                                                </tr>
                                                            ))
                                                        ) : (
                                                            <tr>
                                                                <td colSpan="2" className="text-center">No colors found</td>
                                                            </tr>
                                                        )}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    </CardBody>
                                </Card>
                            </Col>
                        </Row>
                    </Container>
                </div>
            </div>

            {/* Add Color Modal */}
            <Modal isOpen={modal_list} toggle={toggleAddModal} centered>
                <ModalHeader toggle={toggleAddModal}>Add Color</ModalHeader>
                <form onSubmit={addColor}>
                    <ModalBody style={{ padding: '20px' }}>
                        <div className="mb-3">
                            <label htmlFor="color-add" className="form-label">
                                Color Name <span className="text-danger">*</span>
                            </label>
                            <input
                                type="text"
                                className={`form-control ${errors.color ? 'is-invalid' : ''}`}
                                id="color-add"
                                name="color"
                                value={formData.color}
                                onChange={handleInputChange}
                            />
                            {renderError('color')}
                        </div>
                    </ModalBody>
                    <ModalFooter>
                        <Button color="secondary" onClick={toggleAddModal}>Cancel</Button>
                        <Button color="primary" type="submit">Add</Button>
                    </ModalFooter>
                </form>
            </Modal>

            {/* Edit Color Modal */}
            <Modal isOpen={modal_list1} toggle={() => toggleEditModal(null)} centered>
                <ModalHeader toggle={() => toggleEditModal(null)}>Edit Color</ModalHeader>
                <form onSubmit={updateColor}>
                    <ModalBody style={{ padding: '20px' }}>
                        <div className="mb-3">
                            <label htmlFor="color-edit" className="form-label">
                                Color Name <span className="text-danger">*</span>
                            </label>
                            <input
                                type="text"
                                className={`form-control ${errors.color ? 'is-invalid' : ''}`}
                                id="color-edit"
                                name="color"
                                value={formData.color}
                                onChange={handleInputChange}
                            />
                            {renderError('color')}
                        </div>
                    </ModalBody>
                    <ModalFooter>
                        <Button color="secondary" onClick={() => toggleEditModal(null)}>Cancel</Button>
                        <Button color="primary" type="submit">Update</Button>
                    </ModalFooter>
                </form>
            </Modal>

        </React.Fragment>
    );
};

export default AddColor;