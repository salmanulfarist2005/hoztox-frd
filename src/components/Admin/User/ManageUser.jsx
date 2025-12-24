import React, { useState, useEffect } from 'react';
import { Button, Card, CardBody, CardHeader, Col, Container, Row, Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';

import { Link } from 'react-router-dom';
import axios from 'axios';
import Breadcrumbs from "../../../components/Admin/Breadcrumb";

import { BASE_URL } from '../../helpers/config';
import useDebounce from '../../../Hooks/useDebounce';
const ManageUser = () => {
    const [users, setUsers] = useState([]);
    const [userTypes, setUserTypes] = useState([]);
    const [selectedUserType, setSelectedUserType] = useState('');
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [loading, setLoading] = useState(true);
    const [modal_list, setModalList] = useState(false);
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

    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState("");
    const [pagetrigger, setPageTrigger] = useState(false);
    const [totalPages,setTotalPages] = useState(1)

   const debouncedValue = useDebounce(searchTerm)



    const fetchUsers = async () => {
        try {

            const response = await axios.get(`${BASE_URL}/products/users/`,{
                                    params:{
                    is_paginated:true,
                    page:currentPage,
                    limit:10,
                    search:searchTerm
                }


            });
           if(!response.error){
            const users = response.data.message.results;
            const totalPages = Math.ceil(response.data.message.count / 10);

            
            setUsers(users);
            setTotalPages(totalPages)
            }

        } catch (error) {
            console.error('Error fetching users:', error);
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        fetchUsers();
    }, [pagetrigger,debouncedValue]);

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
    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setCurrentLogo(reader.result); // Update the preview image
            };
            reader.readAsDataURL(file);
            setFormData((prevData) => ({
                ...prevData,
                company_logo: file, // Store the new file object
            }));
        } else {

            setCurrentLogo(formData.company_logo);
        }
    };


    const tog_list = (user) => {
        if (!user || !user.id) {
            console.error("Invalid user data:", user);
            return;
        }

        setUserId(user.id);

        setFormData({
            full_name: user.full_name || '',
            email: user.email || '',
            mobile_number: user.mobile_number || '',
            whatsapp_number: user.whatsapp_number || '',
            company_name: user.company_name || '',
            shipping_address: user.shipping_address || '',
            company_logo: user.company_logo || '',
            company_email: user.company_email || '',
            company_website: user.company_website || '',
            username: user.username || '',
            password: '',
            confirm_password: '',
            usertypes: user.usertypes || '',
        });

        setCurrentLogo(user.company_logo || '');
        setSelectedUserType(user.usertypes?.toString() || '');
        setModalList(true); // Open modal
    };


    const [userId, setUserId] = useState(null);
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!userId) {
            console.error("User ID is not defined.");
            return;
        }

        const formDataToSubmit = new FormData();

        // Append a new logo if it's selected
        if (formData.company_logo instanceof File) {
            formDataToSubmit.append('company_logo', formData.company_logo);
        }

        // Only append the existing logo if it’s the same one (not changed)
        if (!formData.company_logo || formData.company_logo instanceof File) {
            formDataToSubmit.append('company_logo', currentLogo); // currentLogo should hold the URL of the existing logo
        }

        // Append other fields to FormData
        Object.keys(formData).forEach(key => {
            if (key !== 'company_logo') { // Avoid appending logo here again
                formDataToSubmit.append(key, formData[key]);
            }
        });

        // Handle selected user type
        if (selectedUserType) {
            formDataToSubmit.append('usertypes', selectedUserType);
        }

        try {
            const response = await axios.put(`${BASE_URL}/products/users/${userId}/`, formDataToSubmit, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            if (response.status === 200) {
                alert("User updated successfully!");

                // Directly update the user in the state
                setUsers(prevUsers =>
                    prevUsers.map(user =>
                        user.id === userId ? { ...user, ...formData } : user
                    )
                );
            }

            // Reset form data
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
            setCurrentLogo(null);
            setSelectedUserType('');
            setUserId(null);
            setModalList(false);
            alert("User Updated successfully!");
        } catch (error) {
            console.error('Error updating user:', error);
            alert("Error updating user. Please try again.");
        }
    };





    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData({ ...formData, [name]: value });
    };

    const [currentLogo, setCurrentLogo] = useState(null);



    const handleUserTypeChange = (event) => {
        setSelectedUserType(event.target.value);
    };

    const generateRandomPassword = (length = 12) => {
        const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+";
        let password = "";
        for (let i = 0; i < length; i++) {
            const randomIndex = Math.floor(Math.random() * charset.length);
            password += charset[randomIndex];
        }
        return password;
    };
    const handleGeneratePassword = () => {
        const password = generateRandomPassword();
        setFormData({ ...formData, password, confirm_password: password });
    };

    const togglePasswordVisibility = () => {
        setPasswordVisible(!passwordVisible);
    };

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
        setCurrentPage(1)

    };


    const handleNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
            setPageTrigger(e=>!e)

        }
    };

    const handlePreviousPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
            setPageTrigger(e=>!e)

        }
    };

    const [isAllSelected, setIsAllSelected] = useState(false);
    const [selectedIds, setSelectedIds] = useState([]);
    const handleSelectAllChange = () => {
        if (isAllSelected) {
            setSelectedIds([]);
        } else {
            setSelectedIds(filteredUsers.map(user => user.id));
        }
        setIsAllSelected(!isAllSelected);
    };

    const handleCheckboxChanges = (userId) => {
        setSelectedIds(prevSelected =>
            prevSelected.includes(userId)
                ? prevSelected.filter(id => id !== userId)
                : [...prevSelected, userId]
        );

        setIsAllSelected(filteredUsers.length === selectedIds.length + 1);
    };

    const deleteMultipleCategories = async () => {
        if (selectedIds.length === 0) {
            alert("Please select at least one Product to delete.");
            return;
        }
        if (window.confirm("Are you sure you want to delete the selected users?")) {
            try {
                await Promise.all(selectedIds.map(id =>
                    axios.delete(`${BASE_URL}/products/users/${userId}/delete/`)
                ));
                fetchUsers();
                alert("Selected Users deleted successfully!");
            } catch (error) {
                console.error('Error deleting Users:', error.response ? error.response.data : error.message);
                alert("There was an error deleting the selected Users.");
            }
        }
    };
    const deleteCategory = async (userId) => {
        if (window.confirm("Are you sure you want to delete this user?")) {
            try {
                await axios.delete(`${BASE_URL}/products/users/${userId}/delete/`);
                fetchUsers();
                alert("User deleted successfully!");
            } catch (error) {
                console.error('Error deleting user:', error);
                const errorMessage = error.response ? error.response.data.message || "There was an error deleting the user." : "Network error.";
                alert(errorMessage);
            }
        }
    };
    return (
        <React.Fragment>
            <div className="main-content">
                <div className="page-content ">
                    <Container fluid>
                        <Breadcrumbs title="Users" breadcrumbItem="Manage User" />

                        <Row>
                            <Col lg={12}>
                                <Card>
                                    <CardBody>
                                        <div id="customerList">
                                            <Row className="g-4 mb-3">
                                                <Col className="col-sm-auto">
                                                    <div className="d-flex gap-1">
                                                        <Button color="soft-danger" onClick={deleteMultipleCategories}><i className="ri-delete-bin-2-line"></i></Button>
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
                                                <table className="table align-middle table-nowrap min-500" id="customerTable">
                                                    <thead className="table-light ">
                                                        <tr>
                                                            <th scope="col"  >
                                                                <div className="form-check">
                                                                    <input
                                                                        className="form-check-input"
                                                                        type="checkbox"
                                                                        id="checkAll"
                                                                        checked={isAllSelected}
                                                                        onChange={handleSelectAllChange}
                                                                    />
                                                                </div>
                                                            </th>
                                                            <th className="sort" data-sort="customer_name">Full Name</th>
                                                            <th className="sort" data-sort="email">Email</th>
                                                            <th className="sort" data-sort="phone">Mobile Number</th>
                                                            <th className="sort" data-sort="company">Company Name</th>
                                                            <th className="sort" data-sort="action">Action</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody className="list form-check-all manage-product ">
                                                        {loading ? (
                                                            <tr>

                                                            </tr>
                                                        ) : (
                                                            users.map((user) => (
                                                                <tr key={user.id}>
                                                                    <th scope="row">
                                                                        <div className="form-check">
                                                                            <input
                                                                                className="form-check-input"
                                                                                type="checkbox"
                                                                                value={user.id}
                                                                                checked={selectedIds.includes(user.id)}
                                                                                onChange={(e) => handleCheckboxChanges(user.id)}
                                                                            />
                                                                        </div>
                                                                    </th>
                                                                    <td className="customer_name ">{user.full_name}</td>
                                                                    <td className="email">{user.email}</td>
                                                                    <td className="phone">{user.mobile_number}</td>
                                                                    <td className="company">{user.company_name}</td>
                                                                    <td>
                                                                        <div className="d-flex gap-2">
                                                                            {/* Edit Icon */}
                                                                            <button
                                                                                onClick={() => tog_list(user)}
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

                                                                            {/* Delete Icon */}
                                                                            <button
                                                                                onClick={() => deleteCategory(user.id)}
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
                                                        )}
                                                    </tbody>
                                                </table>
                                            </div>
                                               <div className="d-flex justify-content-end">
                                                <div className="pagination-wrap hstack gap-2">

                                                    <button
                                                    className="page-item pagination-prev"
                                                    disabled={currentPage === 1}
                                                    onClick={() => handlePreviousPage(currentPage - 1)}
                                                    >
                                                    Previous
                                                    </button>

                                                    <ul className="pagination mb-0">
                                                    {Array.from({ length: totalPages }, (_, index) => {
                                                        const page = index + 1;
                                                        return (
                                                        <li
                                                            key={page}
                                                            className={`page-item ${currentPage === page ? "active" : ""}`}
                                                        >
                                                            <button
                                                            style={{
                                                                color: "#212529",
                                                                borderColor: "#212529",
                                                                backgroundColor:
                                                                currentPage === page ? "#212529" : "transparent",
                                                                color: currentPage === page ? "#fff" : "#212529",
                                                            }} 
                                                            className="page-link"
                                                            onClick={() => {setCurrentPage(page)
                                                                 setPageTrigger(e=>!e)
                                                            }}
                                                            >
                                                            {page}
                                                            </button>
                                                        </li>
                                                        );
                                                    })}
                                                    </ul>

                                                    <button
                                                    className="page-item pagination-next"
                                                    disabled={currentPage === totalPages}
                                                    onClick={() => handleNextPage(currentPage + 1)}
                                                    >
                                                    Next
                                                    </button>

                                                </div>
                                                </div>

                                        </div>
                                    </CardBody>
                                </Card>
                            </Col>
                        </Row>
                    </Container>
                </div>
            </div>
            <Modal
                isOpen={modal_list}
                toggle={tog_list}
                centered
                style={{ maxWidth: '1000px', width: '90%' }}
            >
                <ModalHeader className="bg-light p-3" toggle={() => setModalList(false)}> Edit User </ModalHeader>
                <CardBody style={{ padding: '20px' }}>
                    <form onSubmit={handleSubmit}>
                        <Row className="mb-3">
                            <label htmlFor="full_name" className="col-md-2 col-form-label">Full Name</label>
                            <div className="col-md-10">
                                <input
                                    className="form-control"
                                    type="text"
                                    name="full_name"
                                    value={formData.full_name}
                                    onChange={handleChange}
                                    placeholder="Full Name"
                                    required
                                />
                            </div>
                        </Row>
                        <Row className="mb-3">
                            <label htmlFor="email" className="col-md-2 col-form-label">Email</label>
                            <div className="col-md-10">
                                <input
                                    className="form-control"
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="Email"
                                    required
                                />
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

                                {currentLogo && (
                                    <img
                                        src={currentLogo}
                                        alt="Company Logo"
                                        className="mt-3"
                                        style={{ maxWidth: '200px', maxHeight: '200px' }}
                                    />
                                )}
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
                                    className="form-control"
                                    type="text"
                                    name="username"
                                    value={formData.username}
                                    onChange={handleChange}
                                    placeholder="Username"
                                    required
                                />
                            </div>
                        </Row>
                        <Row className="mb-3">
                            <label htmlFor="usertypes" className="col-md-2 d-flex align-items-center">User Types</label>
                            <div className="col-md-10 d-flex flex-wrap">
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
                            <div className="col-md-10 position-relative">
                                <input
                                    className="form-control"
                                    type={passwordVisible ? "text" : "password"}
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    placeholder="Password"
                                />
                                <span
                                    onClick={togglePasswordVisibility}
                                    style={{
                                        position: "absolute",
                                       right: "25px",
                                        top: "50%",
                                        transform: "translateY(-50%)",
                                        cursor: "pointer",
                                        color: "#6b7280"
                                    }}
                                >
                                    <i className={passwordVisible ? "ri-eye-off-line" : "ri-eye-line"}></i>
                                </span>
                            </div>
                        </Row>

                        <Row className="mb-3">
                            <label htmlFor="confirm_password" className="col-md-2 col-form-label">Confirm Password</label>
                            <div className="col-md-10 position-relative">
                                <input
                                    className="form-control"
                                    type={passwordVisible ? "text" : "password"}
                                    name="confirm_password"
                                    value={formData.confirm_password}
                                    onChange={handleChange}
                                    placeholder="Confirm Password"
                                />
                                <span
                                    onClick={togglePasswordVisibility}
                                    style={{
                                        position: "absolute",
                                        right: "25px",
                                        top: "35%",
                                        transform: "translateY(-50%)",
                                        cursor: "pointer",
                                        color: "#6b7280"
                                    }}
                                >
                                    <i className={passwordVisible ? "ri-eye-off-line" : "ri-eye-line"}></i>
                                </span>
                            </div>
                        </Row>
                        <Row className="mb-3 d-flex justify-content-start">
                            <div className="col-md-10 offset-md-2">
                                <button
                                    type="button"
                                    onClick={handleGeneratePassword}
                                    className="btn btn-secondary"
                                >
                                    Generate Password
                                </button>
                            </div>
                        </Row>


                        <ModalFooter>
                            <div className="hstack gap-2 justify-content-end">
                                {/* <button type="button" className="btn btn-light" onClick={() => setModalList(false)}>Close</button> */}
                                <Button type="submit" color='primary' className="btn btn-success" id="add-btn">Update User</Button>

                            </div>
                        </ModalFooter>
                    </form>

                </CardBody>


            </Modal>
        </React.Fragment>
    );
};

export default ManageUser;
