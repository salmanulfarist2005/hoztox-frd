import React, { useState, useEffect } from 'react';
import { Button, Card, CardBody, CardHeader, Col, Container, ListGroup, ListGroupItem, Modal, ModalBody, ModalFooter, Row, ModalHeader } from 'reactstrap';

import { Link } from 'react-router-dom';
import axios from 'axios';
import Breadcrumbs from "../../../components/Admin/Breadcrumb";

import { BASE_URL } from '../../helpers/config';


const UserType = () => {
    const [userTypes, setUserTypes] = useState([]);
    const [currentUserType, setCurrentUserType] = useState({ id: null, usertype: "" });
    const [isEditMode, setIsEditMode] = useState(false);

    const [modal_list, setmodal_list] = useState(false);
    const [modal_list1, setmodal_list1] = useState(false);

    const [formData, setFormData] = useState({ usertype: '' });


    function tog_list() { setmodal_list(!modal_list); setIsEditMode(false); clearForm(); }
    const tog_list1 = (userType) => {
        setmodal_list1(!modal_list1);
        setIsEditMode(true);
        if (userType) {
            setCurrentUserType(userType);
            setFormData({ usertype: userType.usertype });
        } else {
            setCurrentUserType({ id: null, usertype: "" });
            setFormData({ usertype: '' });
        }
    };




    const fetchUserTypes = async () => {
        try {
            const response = await axios.get(`${BASE_URL}/products/usertypes_list/`);
            const userTypesData = response.data;

            if (Array.isArray(userTypesData)) {
                setUserTypes(userTypesData);
                console.log("userstypes", response.data)
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

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };



    const addUserType = async (e) => {
        e.preventDefault();
        try {
            await axios.post(`${BASE_URL}/products/usertypes/`, formData);

            fetchUserTypes();
            tog_list();
            alert("User type added successfully!");
            console.log("formdata", formData)
        } catch (error) {
            console.error('Error adding user type:', error);
        }
    };

    const updateUserType = async (e) => {
        e.preventDefault();
    
        if (!currentUserType || !currentUserType.id) {
            console.error('No current user type selected.');
            return;
        }
    
        try {
            // Send the update request
            await axios.put(`${BASE_URL}/products/usertypes/${currentUserType.id}/`, formData);
    
            // Update the user type in the state directly
            setUserTypes((prevUserTypes) => 
                prevUserTypes.map((userType) => 
                    userType.id === currentUserType.id ? { ...userType, ...formData } : userType
                )
            );
    
            tog_list1(null); // Close the modal or list view
    
            alert("User type updated successfully!");
        } catch (error) {
            console.error('Error updating user type:', error);
            alert("Error updating user type. Please try again.");
        }
    };
    

    const deleteUserType = async (userTypeId) => {
        if (window.confirm("Are you sure you want to delete this user type?")) {
            try {
                await axios.delete(`${BASE_URL}/products/usertypes/${userTypeId}/`);
                fetchUserTypes();
                alert("User type deleted successfully!");
            } catch (error) {
                console.error('Error deleting user type:', error);
                alert("Error deleting user type. Please try again.");
            }
        }
    };

    const clearForm = () => {
        setFormData({ usertype: '' });
        setCurrentUserType({ id: null, usertype: "" });
    };
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedUserTypes, setSelectedUserTypes] = useState([]);
    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
    };

    // Filter user types based on search term
    const filteredUserTypes = userTypes.filter(userType =>
        userType.usertype.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleCheckboxChange = (userTypeId) => {
        setSelectedUserTypes(prevSelected =>
            prevSelected.includes(userTypeId)
                ? prevSelected.filter(id => id !== userTypeId)
                : [...prevSelected, userTypeId]
        );
    };
    const deleteMultipleUserTypes = async () => {
        if (window.confirm("Are you sure you want to delete selected user types?")) {
            try {
                await Promise.all(selectedUserTypes.map(userTypeId =>
                    axios.delete(`${BASE_URL}/products/usertypes/${userTypeId}/`)
                ));
                fetchUserTypes();
                setSelectedUserTypes([]);
                alert("Selected user types deleted successfully!");
            } catch (error) {
                console.error('Error deleting user types:', error);
                alert("Error deleting user types. Please try again.");
            }
        }
    };

    const [isAllSelected, setIsAllSelected] = useState(false);
    const handleSelectAllChange = () => {
        if (isAllSelected) {
            setSelectedUserTypes([]);
        } else {
            setSelectedUserTypes(filteredUserTypes.map(userType => userType.id));
        }
        setIsAllSelected(!isAllSelected);
    };
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    const totalPages = Math.ceil(filteredUserTypes.length / itemsPerPage);


    const indexOfLastUserTypes = currentPage * itemsPerPage;
    const indexOfFirstUserTypes = indexOfLastUserTypes - itemsPerPage;
    const currentUserTypes = filteredUserTypes.slice(indexOfFirstUserTypes, indexOfLastUserTypes);


    const handleNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };

    const handlePreviousPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };
    return (
        <React.Fragment>
            <div className="main-content">
                <div className="page-content ">
                    <Container fluid>
                        <Breadcrumbs title="Users" breadcrumbItem="UserType" />

                        <Row>
                            <Col lg={12}>
                                <Card>
                                    <CardBody>
                                        <div id="customerList">
                                            {/* <Row className="g-4 mb-3"> */}
                                            <Row className="g-4 mb-3">
                                                <Col className="col-sm-auto">
                                                    <div className="d-flex gap-1">
                                                        <Button color="success" className="add-btn" onClick={() => tog_list()} id="create-btn"><i className="ri-add-line align-bottom me-1"></i> Add</Button>
                                                        <Button color="soft-danger"
                                                            onClick={deleteMultipleUserTypes}
                                                        ><i className="ri-delete-bin-2-line"></i></Button>
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
                                                <table className="table align-middle table-nowrap" id="customerTable">
                                                    <thead className="table-light">
                                                        <tr>
                                                            <th scope="col" style={{ width: "50px" }}>
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
                                                            <th className="sort" data-sort="customer_name">User Type</th>
                                                            <th className="sort" data-sort="action">Action</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody className="list form-check-all">
                                                        {Array.isArray(filteredUserTypes) && filteredUserTypes.length > 0 ? (

                                                            currentUserTypes.map(userType => (
                                                                <tr key={userType.id}>
                                                                    <th scope="row">
                                                                        <div className="form-check">
                                                                            <input
                                                                                className="form-check-input"
                                                                                type="checkbox"
                                                                                checked={selectedUserTypes.includes(userType.id)}
                                                                                onChange={() => handleCheckboxChange(userType.id)}
                                                                            />
                                                                        </div>
                                                                    </th>
                                                                    <td>{userType.usertype}</td>
                                                                    <td>
                                                                        <div className="d-flex gap-2">
                                                                            <div className="edit">
                                                                                <button onClick={() => tog_list1(userType)} className="btn btn-sm btn-success edit-item-btn">Edit</button>
                                                                            </div>
                                                                            <div className="remove">
                                                                                <button onClick={() => deleteUserType(userType.id)} className="btn btn-sm btn-danger remove-item-btn" data-bs-toggle="modal" data-bs-target="#deleteRecordModal">Remove</button>
                                                                            </div>
                                                                        </div>
                                                                    </td>
                                                                </tr>
                                                            ))
                                                        ) : (
                                                            <tr>
                                                                <td colSpan="3" className="text-center">No user types found</td>
                                                            </tr>
                                                        )}
                                                    </tbody>
                                                </table>
                                            </div>
                                            <div className="d-flex justify-content-end">
                                                <div className="pagination-wrap hstack gap-2">
                                                    <Link onClick={() => handlePreviousPage(currentPage - 1)}
                                                        disabled={currentPage === 1} className="page-item pagination-prev disabled" to="#">
                                                        Previous
                                                    </Link>
                                                    <ul className="pagination listjs-pagination mb-0"></ul>
                                                    <Link onClick={() => handleNextPage(currentPage + 1)}
                                                        disabled={currentPage === totalPages} className="page-item pagination-next" to="#">
                                                        Next
                                                    </Link>
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
            {/* Add User Type Modal */}
            <Modal isOpen={modal_list} toggle={() => tog_list()} centered>
                <ModalHeader className="bg-light p-3" toggle={() => tog_list()}>Add User Type</ModalHeader>
                <form onSubmit={addUserType}>
                <ModalBody style={{ padding: '20px' }}> 
                        <div className="mb-3">
                            <label htmlFor="usertype-field" className="form-label">User Type</label>
                            <input type="text" name="usertype" value={formData.usertype} onChange={handleInputChange} id="usertype-field" className="form-control" placeholder="Enter User Type" required />
                        </div>
                    </ModalBody>
                    <ModalFooter>
                        <button type="button" className="btn btn-light" onClick={() => tog_list()}>Close</button>
                        <button type="submit" className="btn btn-success">Add</button>
                    </ModalFooter>
                </form>
            </Modal>

            <Modal isOpen={modal_list1} toggle={() => tog_list1(null)} centered
                style={{ maxWidth: '900px', width: '40%' }}>
                <ModalHeader className="bg-light p-" toggle={() => tog_list1(null)}>
                    Edit User Type
                </ModalHeader>
                <form onSubmit={updateUserType}>
                    <ModalBody style={{ padding: '20px' }}>  
                        <div className="mb-3">
                            <label htmlFor="usertype-field" className="form-label">User Type</label>
                            <input
                                type="text"
                                name="usertype"
                                value={formData.usertype || ''}

                                onChange={handleInputChange}
                                id="usertype-field"
                                className="form-control"
                                placeholder="Enter User Type"
                                required
                            />
                        </div>
                    </ModalBody>
                    <ModalFooter>
                        <button type="button" className="btn btn-light" onClick={() => tog_list1(null)}>Close</button>
                        <button type="submit" className="btn btn-success">Update</button>
                    </ModalFooter>
                </form>
            </Modal>

        </React.Fragment>
    );
};

export default UserType;
