import React, { useState, useEffect } from 'react';

import Breadcrumbs from "../../../components/Admin/Breadcrumb";
import { Link } from 'react-router-dom';
import axios from 'axios';
import { BASE_URL } from '../../helpers/config';
import { Button, Card, CardBody, CardHeader, Col, Container, ListGroup, ListGroupItem, Modal, ModalBody, ModalFooter, Row, ModalHeader } from 'reactstrap';
const CustomPendingOrder = () => {
    const [orders, setOrders] = useState([]);
    const [modal_list, setModalList] = useState(false);
    const [modal_delete, setModalDelete] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const [modal_list1, setModalList1] = useState(false);
    const [orderId, setOrderId] = useState('');

    const fetchOrders = async () => {
        try {
            const response = await axios.get(`${BASE_URL}/products/customized-pending/`);
            const data = response.data;
            setOrders(data || []);
            console.log("response", response.data);
        } catch (error) {
            console.error("Error fetching orders:", error);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);



    const tog_list1 = (order) => {
        console.log("Selected Item for Order ID:", order);
        setSelectedItem(order);
        setOrderId(order.ordercode || '');
        setModalList1(!modal_list1);
    };

    const tog_delete = () => {
        setModalDelete(!modal_delete);
    }; const tog_list = (order) => {
        console.log("Selected Order:", order);
        setSelectedItem(order);
        setModalList(!modal_list);
    };
    const handleApprove = async () => {
        if (!selectedItem || !selectedItem.order?.id) {
            console.error("No order selected or order ID is undefined.", selectedItem.order?.id);
            return;
        }

        try {
            const response = await axios.patch(`${BASE_URL}/products/orders/${selectedItem.order?.id}/approve/`, { approved: true });
            console.log("Approval response:", response.data);

            alert("Order approved successfully!");
            fetchOrders();
            setModalList(false);
            setSelectedItem(null);
        } catch (error) {
            console.error("Error approving the order:", error);
            alert("Failed to approve the order.");
        }
    };
    const handleReject = async () => {
        if (!selectedItem || !selectedItem.order?.id) {
            console.error("No order selected or order ID is undefined.", selectedItem.order?.id);
            return;
        }

        try {
            const response = await axios.patch(`${BASE_URL}/products/orders/${selectedItem.order?.id}/reject/`);
            console.log("Rejection response:", response.data);

            alert("Order rejected successfully!");
            fetchOrders();
            setModalList(false);
            setSelectedItem(null);
        } catch (error) {
            console.error("Error rejecting the order:", error);
            alert("Failed to reject the order.");
        }
    };


    const [searchQuery, setSearchQuery] = useState('');
    const [filteredOrders, setFilteredOrders] = useState([]);
    useEffect(() => {
        if (searchQuery) {
            const lowercasedQuery = searchQuery.toLowerCase();
            const results = orders.filter(order =>
                order.ordercode.toLowerCase().includes(lowercasedQuery) ||
                order.user?.company_name.toLowerCase().includes(lowercasedQuery) ||
                (order.order_items && order.order_items.some(item =>
                    item.product?.product_name.toLowerCase().includes(lowercasedQuery)
                ))
            );
            setFilteredOrders(results);
        } else {
            setFilteredOrders(orders);
        }
    }, [searchQuery, orders]);

    return (
        <React.Fragment>
            <div className="main-content">
                <div className="page-content ">
                    <Container fluid>
                    <Breadcrumbs title="Orders" breadcrumbItem="Manage Orders" />

                        <Row>
                            <Col lg={12}>
                                <Card>
                                    <CardBody>
                                        <div id="customerList">
                                            <Row className="g-4 mb-3">
                                                <Col className="col-sm">
                                                    <div className="d-flex justify-content-sm-end">
                                                        <div className="search-box ms-2" style={{ position: 'relative' }}>
                                                            <input
                                                                type="text"
                                                                className="form-control search"
                                                                placeholder="Search..."
                                                                value={searchQuery}
                                                                onChange={(e) => setSearchQuery(e.target.value)}
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
                                                            <th className="sort" data-sort="order_id">SKU</th>
                                                            <th className="sort" data-sort="shop_name">Shop Name</th>
                                                            <th className="sort" data-sort="size">Product Name</th>
                                                            <th className="sort" data-sort="gram">Product Category</th>
                                                            <th className="sort" data-sort="cent">Quantity</th>


                                                            <th className="sort" data-sort="action">Action</th>
                                                        </tr>


                                                    </thead>
                                                    <tbody className="list form-check-all">
                                                        {filteredOrders.length > 0 ? (
                                                            filteredOrders.map((order) => (
                                                                <tr key={order.id}>
                                                                    <td>{order.product?.SKU}</td>
                                                                    <td>{order.user?.company_name}</td>
                                                                    <td>{order.product?.product_name || "N/A"}</td>
                                                                    <td>{order.product?.category_name}</td>
                                                                    <td>{order.quantity}</td>


                                                                    <td>
                                                                        <div className="d-flex gap-2">
                                                                            <div className="edit">

                                                                            </div>
                                                                            <div className="edit">
                                                                                <button
                                                                                    className="btn btn-sm btn-success edit-item-btn"
                                                                                    onClick={() => tog_list({ order })}
                                                                                >
                                                                                    View Order
                                                                                </button>
                                                                            </div>
                                                                        </div>
                                                                    </td>
                                                                </tr>
                                                            ))
                                                        ) : (
                                                            <tr>
                                                                <td colSpan="8">No orders found.</td>
                                                            </tr>
                                                        )}
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
                </div>
                <Modal
                    isOpen={modal_list}
                    toggle={tog_list}
                    centered
                    style={{ maxWidth: '900px', width: '90%' }}
                >
                    <ModalHeader className="bg-light p-3" id="exampleModalLabel" toggle={tog_list}>
                        View Product
                    </ModalHeader>
                    <ModalBody style={{ padding: '20px' }}>
                        {console.log("Selected Item:", selectedItem)}
                        {selectedItem ? (
                            <>

                                <Row className="mb-3 mt-2">
                                    <label className="col-md-2 col-form-label">Product Image</label>
                                    <div className="col-md-10">
                                        <img
                                            src={`${BASE_URL}${selectedItem.order?.product?.product_image}`}
                                            alt={`Image of ${selectedItem.order?.product?.product_name}`} // Improved alt text
                                            style={{ width: '100px', height: '100px' }}
                                        />
                                    </div>
                                </Row>

                                <Row className="mb-3">
                                    <label className="col-md-2 col-form-label">SKU</label>
                                    <div className="col-md-10">
                                        <input
                                            className="form-control"
                                            type="text"
                                            value={selectedItem.order?.product?.SKU}
                                            readOnly
                                        />
                                    </div>
                                </Row>
                                <Row className="mb-3">
                                    <label className="col-md-2 col-form-label">Product Name</label>
                                    <div className="col-md-10">
                                        <input
                                            className="form-control"
                                            type="text"
                                            value={selectedItem.order?.product?.product_name}
                                            readOnly
                                        />
                                    </div>
                                </Row>
                                <Row className="mb-3">
                                    <label className="col-md-2 col-form-label">Product Category</label>
                                    <div className="col-md-10">
                                        <input
                                            className="form-control"
                                            type="text"
                                            value={selectedItem.order?.product?.category_name}
                                            readOnly
                                        />
                                    </div>
                                </Row>
                                <Row className="mb-3">
                                    <label className="col-md-2 col-form-label">Product Colour</label>
                                    <div className="col-md-10">
                                        <input
                                            className="form-control"
                                            type="text"
                                            value={selectedItem.order?.product?.color}
                                            readOnly
                                        />
                                    </div>
                                </Row>
                                <Row className="mb-3">
                                    <label className="col-md-2 col-form-label">Product Size</label>
                                    <div className="col-md-10">
                                        <input
                                            className="form-control"
                                            type="text"
                                            value={selectedItem.order?.product?.product_size}
                                            readOnly
                                        />
                                    </div>
                                </Row>
                                <Row className="mb-3">
                                    <label className="col-md-2 col-form-label">Quantity</label>
                                    <div className="col-md-10">
                                        <input
                                            className="form-control"
                                            type="text"
                                            value={selectedItem.order?.quantity}
                                            readOnly
                                        />
                                    </div>
                                </Row>
                                <Row className="mb-3">
                                    <label className="col-md-2 col-form-label">Additional Notes</label>
                                    <div className="col-md-10">
                                        <textarea
                                            className="form-control"
                                            rows="4"
                                            value={selectedItem.order?.additional_notes}
                                            readOnly
                                        />
                                    </div>
                                </Row>
                                <Row className="mb-3">
                                    <label className="col-md-2 col-form-label">Description</label>
                                    <div className="col-md-10">
                                        <textarea
                                            className="form-control"
                                            rows="4"
                                            value={selectedItem.order?.product?.description}
                                            readOnly
                                        />
                                    </div>
                                </Row>
                                <Row className="mb-3">
                                    <label className="col-md-2 col-form-label">Shop Name</label>
                                    <div className="col-md-10">
                                        <input
                                            className="form-control"
                                            type="text"
                                            value={selectedItem.order?.user?.company_name}
                                            readOnly
                                        />
                                    </div>
                                </Row>
                                <Row className="mb-3">
                                    <label className="col-md-2 col-form-label">Shipping Address</label>
                                    <div className="col-md-10">
                                        <input
                                            className="form-control"
                                            type="text"
                                            value={selectedItem.order?.user?.shipping_address}
                                            readOnly
                                        />
                                    </div>
                                </Row>
                                <Row className="mb-3">
                                    <label className="col-md-2 col-form-label">Mobile Number</label>
                                    <div className="col-md-10">
                                        <input
                                            className="form-control"
                                            type="text"
                                            value={selectedItem.order?.user?.mobile_number}
                                            readOnly
                                        />
                                    </div>
                                </Row>
                                <Row className="mb-3">
                                    <label className="col-md-2 col-form-label">WhatsApp Number</label>
                                    <div className="col-md-10">
                                        <input
                                            className="form-control"
                                            type="text"
                                            value={selectedItem.order?.user?.whatsapp_number}
                                            readOnly
                                        />
                                    </div>
                                </Row>
                                <Row className="mb-3">
                                    <label className="col-md-2 col-form-label">Email</label>
                                    <div className="col-md-10">
                                        <input
                                            className="form-control"
                                            type="text"
                                            value={selectedItem.order?.user?.company_email}
                                            readOnly
                                        />
                                    </div>
                                </Row>
                                <Row className="mt-3">

                                    <Col className="text-end">
                                        <Button color="primary" onClick={handleApprove} className="me-2">
                                            Approve
                                        </Button>
                                        <Button color="danger" onClick={handleReject}>
                                            Reject
                                        </Button>
                                    </Col>
                                </Row>
                            </>
                        ) : (
                            <div>No order selected.</div>
                        )}
                    </ModalBody>
                </Modal>


        </React.Fragment>
    );
};

export default CustomPendingOrder;
