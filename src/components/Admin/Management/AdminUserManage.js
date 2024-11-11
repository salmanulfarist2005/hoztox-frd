import React, { useState, useEffect } from 'react';
import { Button, Card, CardBody, CardHeader, Col, Container, ListGroup, ListGroupItem, Modal, ModalBody, ModalFooter, Row, ModalHeader } from 'reactstrap';
import Breadcrumbs from "../../components/Common/Breadcrumb";
import SimpleBar from 'simplebar-react';
import { Link } from 'react-router-dom';
import List from 'list.js';
// Import Flatepicker
import Flatpickr from "react-flatpickr";

 

const AdminUser = () => {

    const [modal_list, setmodal_list] = useState(false);
    function tog_list() {
        setmodal_list(!modal_list);
    }

    const [modal_delete, setmodal_delete] = useState(false);
    function tog_delete() {
        setmodal_delete(!modal_delete);
    }

    const [modal_list1, setmodal_list1] = useState(false);
    function tog_list1() {
        setmodal_list1(!modal_list1);
    }

    const [modal_delete1, setmodal_delete1] = useState(false);
    function tog_delete1() {
        setmodal_delete1(!modal_delete1);
    }
    

    return (
        <React.Fragment>
            <div className="page-content">
                <Container fluid>
                    <Breadcrumbs title="Management" breadcrumbItem="Admin User Management" />

                    <Row>
                        <Col lg={12}>
                            <Card>
                                 

                                <CardBody>
                                    <div id="customerList">
                                        <Row className="g-4 mb-3">
                                            <Col className="col-sm-auto">
                                                <div className="d-flex gap-1">
                                                    <Button color="success" className="add-btn" onClick={() => tog_list()} id="create-btn"><i className="ri-add-line align-bottom me-1"></i> Add</Button>
                                                    <Button color="soft-danger"
                                                    // onClick="deleteMultiple()"
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
                                                                <input className="form-check-input" type="checkbox" id="checkAll" value="option" />
                                                            </div>
                                                        </th>
                                                        <th className="sort" data-sort="customer_name">Usename</th>
                                                         
                                                        <th className="sort" data-sort="action">Action</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="list form-check-all">
                                                    <tr>
                                                        <th scope="row">
                                                            <div className="form-check">
                                                                <input className="form-check-input" type="checkbox" name="chk_child" value="option1" />
                                                            </div>
                                                        </th>
                                                        <td className="id" style={{ display: "none" }}><Link to="#" className="fw-medium link-primary">#VZ2101</Link></td>
                                                        <td className="customer_name">Mary Cousar</td>
                                                         
                                                    
                                                        <td>
                                                            <div className="d-flex gap-2">
                                                                <div className="edit">
                                                                    <button onClick={() => tog_list1()}  className="btn btn-sm btn-success edit-item-btn"
                                                                        data-bs-toggle="modal" data-bs-target="#showModal">Edit</button>
                                                                </div>
                                                                <div className="remove">
                                                                    <button className="btn btn-sm btn-danger remove-item-btn" data-bs-toggle="modal" data-bs-target="#deleteRecordModal">Remove</button>
                                                                </div>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                    
                                                     
                                                </tbody>
                                            </table>
                                            
                                        </div>

                                        <div className="d-flex justify-content-end">
                                            <div className="pagination-wrap hstack gap-2">
                                                <Link className="page-item pagination-prev disabled" to="#">
                                                    Previous
                                                </Link>
                                                <ul className="pagination listjs-pagination mb-0"></ul>
                                                <Link className="page-item pagination-next" to="#">
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

            
            <Modal isOpen={modal_list} toggle={() => { tog_list(); }} centered >
                <ModalHeader className="bg-light p-3" id="exampleModalLabel" toggle={() => { tog_list(); }}> Add Admin User </ModalHeader>
                <form className="tablelist-form">
                    <ModalBody>
                        

                        <div className="mb-3">
                            <label htmlFor="customername-field" className="form-label">Username</label>
                            <input type="text" id="customername-field" className="form-control" placeholder="Enter Username" required />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="customername-field" className="form-label">Password</label>
                            <input type="text" id="customername-field" className="form-control" placeholder="Enter Password" required />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="customername-field" className="form-label">Confirm Password</label>
                            <input type="text" id="customername-field" className="form-control" placeholder="Enter Password" required />
                        </div>
                    </ModalBody>
                    <ModalFooter>
                        <div className="hstack gap-2 justify-content-end">
                            <button type="button" className="btn btn-light" onClick={() => setmodal_list(false)}>Close</button>
                            <button type="submit" className="btn btn-success" id="add-btn">Add  </button>
                            
                        </div>
                    </ModalFooter>
                </form>
            </Modal>

            <Modal isOpen={modal_list1} toggle={() => { tog_list1(); }} centered >
                <ModalHeader className="bg-light p-3" id="exampleModalLabel" toggle={() => { tog_list1(); }}>  Edit Admin User </ModalHeader>
                <form className="tablelist-form">
                    <ModalBody>
                        
                    <div className="mb-3">
                            <label htmlFor="customername-field" className="form-label">Username</label>
                            <input type="text" id="customername-field" className="form-control" placeholder="Enter Username" required />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="customername-field" className="form-label">Password</label>
                            <input type="text" id="customername-field" className="form-control" placeholder="Enter Password" required />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="customername-field" className="form-label">Confirm Password</label>
                            <input type="text" id="customername-field" className="form-control" placeholder="Enter Password" required />
                        </div>
                    </ModalBody>
                    <ModalFooter>
                        <div className="hstack gap-2 justify-content-end">
                            <button type="button" className="btn btn-light" onClick={() => setmodal_list1(false)}>Close</button>
                            <button type="submit" className="btn btn-success" id="add-btn">Update </button>
                            
                        </div>
                    </ModalFooter>
                </form>
            </Modal>
         
        </React.Fragment>
    );
};

export default  AdminUser;
