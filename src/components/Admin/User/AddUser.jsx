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

const generateRandomPassword = (length = 12) => {
  const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+";
  let password = "";
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charset.length);
    password += charset[randomIndex];
  }
  return password;
};

const AddUser = () => {
  document.title = " Caratree Diamonds-Dahboard";

  const [userTypes, setUserTypes] = useState([]);
  const [selectedUserTypes, setSelectedUserTypes] = useState([]);
  const [selectedUserType, setSelectedUserType] = useState('');
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    mobile_number: '',
    whatsapp_number: '',
    company_name: '',
    shipping_address: '',
    company_logo: null,
    company_email: '',
    company_website: '',
    username: '',
    password: '',
    confirm_password: '',
    usertypes: '',
  });
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [errors, setErrors] = useState({});
  
  const handleUserTypeChange = (event) => {
    setSelectedUserType(event.target.value);
  };

  const handleGeneratePassword = () => {
    const password = generateRandomPassword();
    setFormData({ ...formData, password, confirm_password: password });
  };

  // Toggle password visibility
  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const handleCheckboxChange = (event) => {
    const { value } = event.target;
    setSelectedUserTypes((prevSelected) => {
      const userTypeId = parseInt(value, 10);
      if (prevSelected.includes(userTypeId)) {
        return prevSelected.filter((id) => id !== userTypeId);
      } else {
        return [...prevSelected, userTypeId];
      }
    });
  };

  const fetchUserTypes = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/products/usertypes_list/`);
      const userTypesData = response.data;

      if (Array.isArray(userTypesData)) {
        setUserTypes(userTypesData);
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

  const handleChange = (event) => {
    const { name, value } = event.target;
    
    // Validation for phone number fields - only numbers and + allowed
    if (name === 'mobile_number' || name === 'whatsapp_number') {
      const phoneRegex = /^[0-9+]*$/;
      if (!phoneRegex.test(value)) {
        return; // Don't update if invalid characters
      }
    }
    
    // Validation for text-only fields - only letters and spaces
    if (name === 'full_name' || name === 'company_name') {
      const textRegex = /^[a-zA-Z\s]*$/;
      if (!textRegex.test(value)) {
        return; // Don't update if invalid characters
      }
    }
    
    setFormData({ ...formData, [name]: value });
    // Clear error for this field on change
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const handleFileChange = (event) => {
    setFormData({ ...formData, company_logo: event.target.files[0] });
  };

  const validateForm = () => {
    const newErrors = {};

    // Full name minimum 3 characters
    if (formData.full_name.length < 3) {
      newErrors.full_name = 'Full name must be at least 3 characters long.';
    }

    // Username minimum 3 characters
    if (formData.username.length < 3) {
      newErrors.username = 'Username must be at least 3 characters long.';
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address.';
    }

    // Password match validation
    if (formData.password !== formData.confirm_password) {
      newErrors.confirm_password = 'Passwords do not match.';
    }

    // User type selection required
    if (!selectedUserType) {
      newErrors.usertypes = 'Please select a user type.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Client-side validation
    if (!validateForm()) {
      return;
    }

    const userData = { ...formData, usertypes: selectedUserType };  

    console.log("formData", userData);

    try {
        const response = await axios.post(`${BASE_URL}/products/users/create/`, userData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });

        alert("User Created successfully!");
        console.log("User created:", response.data);

        // Clear form and errors
        setFormData({
            full_name: '',
            email: '',
            mobile_number: '',
            whatsapp_number: '',
            company_name: '',
            shipping_address: '',
            company_logo: null,
            company_email: '',
            company_website: '',
            username: '',
            password: '',
            confirm_password: '',
            usertypes: '',  
        });
        setErrors({});
        setSelectedUserType('');
    } catch (error) {
        console.error('Error creating user:', error);
        // Handle backend validation errors (e.g., email already exists, username already exists)
        if (error.response && error.response.data) {
          const backendErrors = {};
          Object.keys(error.response.data).forEach((key) => {
            const msg = Array.isArray(error.response.data[key]) 
              ? error.response.data[key].join(', ') 
              : error.response.data[key];
            backendErrors[key] = msg;
          });
          setErrors(backendErrors);
        } else {
          alert('An error occurred while creating the user. Please try again.');
        }
    }
  };

  const renderError = (field) => {
    if (errors[field]) {
      return (
        <div className="invalid-feedback d-block text-danger">
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
            <Breadcrumbs title="Users" breadcrumbItem=" Add a User" />
            <Row>
              <Col>
                <Card>
                  <CardBody>
                    <form onSubmit={handleSubmit}>
                      <Row className="mb-3">
                        <label htmlFor="full_name" className="col-md-2 col-form-label">Full Name</label>
                        <div className="col-md-10">
                          <input
                            className={`form-control ${errors.full_name ? 'is-invalid' : ''}`}
                            type="text"
                            name="full_name"
                            value={formData.full_name}
                            onChange={handleChange}
                            placeholder="Full Name"
                            required
                          />
                          {renderError('full_name')}
                        </div>
                      </Row>
                      <Row className="mb-3">
                        <label htmlFor="email" className="col-md-2 col-form-label">Email</label>
                        <div className="col-md-10">
                          <input
                            className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="Email"
                            required
                          />
                          {renderError('email')}
                        </div>
                      </Row>
                      <Row className="mb-3">
                        <label htmlFor="mobile_number" className="col-md-2 col-form-label">Mobile Number</label>
                        <div className="col-md-10">
                          <input
                            className="form-control"
                            type="text"
                            name="mobile_number"
                            value={formData.mobile_number}
                            onChange={handleChange}
                            placeholder="Mobile Number"
                            required
                          />
                        </div>
                      </Row>
                      <Row className="mb-3">
                        <label htmlFor="whatsapp_number" className="col-md-2 col-form-label">WhatsApp Number</label>
                        <div className="col-md-10">
                          <input
                            className="form-control"
                            type="text"
                            name="whatsapp_number"
                            value={formData.whatsapp_number}
                            onChange={handleChange}
                            placeholder="WhatsApp Number"
                          />
                        </div>
                      </Row>
                      <Row className="mb-3">
                        <label htmlFor="company_name" className="col-md-2 col-form-label">Company Name</label>
                        <div className="col-md-10">
                          <input
                            className="form-control"
                            type="text"
                            name="company_name"
                            value={formData.company_name}
                            onChange={handleChange}
                            placeholder="Company Name"
                            required
                          />
                        </div>
                      </Row>
                     
                      <Row className="mb-3">
                        <label htmlFor="shipping_address" className="col-md-2 col-form-label">Address</label>
                        <div className="col-md-10">
                          <input
                            className="form-control"
                            type="text"
                            name="shipping_address"
                            value={formData.shipping_address}
                            onChange={handleChange}
                            placeholder="Shipping Address"
                            required
                          />
                        </div>
                      </Row>
                      <Row className="mb-3">
                        <label htmlFor="company_logo" className="col-md-2 col-form-label">Company Logo</label>
                        <div className="col-md-10">
                          <input
                            className="form-control"
                            type="file"
                            name="company_logo"
                            accept="image/*"
                            onChange={handleFileChange}
                          />
                        </div>
                      </Row>
                      <Row className="mb-3">
                        <label htmlFor="company_email" className="col-md-2 col-form-label">Company Email</label>
                        <div className="col-md-10">
                          <input
                            className="form-control"
                            type="email"
                            name="company_email"
                            value={formData.company_email}
                            onChange={handleChange}
                            placeholder="Company Email"
                          />
                        </div>
                      </Row>
                      <Row className="mb-3">
                        <label htmlFor="company_website" className="col-md-2 col-form-label">Company Website</label>
                        <div className="col-md-10">
                          <input
                            className="form-control"
                            type="text"
                            name="company_website"
                            value={formData.company_website}
                            onChange={handleChange}
                            placeholder="Company Website"
                          />
                        </div>
                      </Row>
                      <Row className="mb-3">
                        <label htmlFor="username" className="col-md-2 col-form-label">Username</label>
                        <div className="col-md-10">
                          <input
                            className={`form-control ${errors.username ? 'is-invalid' : ''}`}
                            type="text"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            placeholder="Username"
                            required
                          />
                          {renderError('username')}
                        </div>
                      </Row>
                      <Row className="mb-3">
                        <label htmlFor="usertypes" className="col-md-2 d-flex  align-items-center">User Types <span className="text-danger">*</span></label>
                        <div className="col-md-10 d-flex flex-wrap">
                          {renderError('usertypes')}
                          {userTypes.map((userType) => (
                            <div key={userType.id} className="form-check me-4">
                              <input
                                type="radio"
                                className="form-check-input"
                                id={`usertype-${userType.id}`}
                                name="usertype"
                                value={userType.id}
                                onChange={handleUserTypeChange}
                                checked={selectedUserType === userType.id.toString()}
                              />
                              <label htmlFor={`usertype-${userType.id}`} className="form-check-label">
                                {userType.usertype}
                              </label>
                            </div>
                          ))}
                        </div>
                      </Row>

                      <Row className="mb-3">
                        <label htmlFor="password" className="col-md-2 col-form-label">Password</label>
                        <div className="col-md-10">
                          <input
                            className={`form-control ${passwordVisible ? 'show-password' : ''}`}
                            type={passwordVisible ? "text" : "password"}
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="Password"
                            required
                          />
                        </div>
                      </Row>
                      <Row className="mb-3">
                        <label htmlFor="confirm_password" className="col-md-2 col-form-label">Confirm Password</label>
                        <div className="col-md-10">
                          <input
                            className={`form-control ${errors.confirm_password ? 'is-invalid' : ''} ${passwordVisible ? 'show-password' : ''}`}
                            type={passwordVisible ? "text" : "password"}
                            name="confirm_password"
                            value={formData.confirm_password}
                            onChange={handleChange}
                            placeholder="Confirm Password"
                            required
                          />
                          {renderError('confirm_password')}
                        </div>
                      </Row>
                      <Row className="mb-3 d-flex justify-content-start">
                        <div className="col-md-10 offset-md-2 d-flex">
                          <button type="button" onClick={handleGeneratePassword} className="btn btn-secondary me-2">Generate Password</button>
                          <button type="button" onClick={togglePasswordVisibility} className="btn btn-outline-secondary">
                            {passwordVisible ? 'Hide Password' : 'Show Password'}
                          </button>
                        </div>
                      </Row>

                      <Row className="mb-3">
                        <div className="d-flex justify-content-end">
                          <button type="submit" className="btn btn-primary">Add User</button>
                        </div>
                      </Row>
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

export default AddUser;