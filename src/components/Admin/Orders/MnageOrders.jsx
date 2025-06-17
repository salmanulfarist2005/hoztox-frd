import React, { useState, useEffect } from 'react';
import {
    Button, Card, CardBody, CardHeader, Col, Container, ListGroup, ListGroupItem,
    Modal, ModalBody, ModalFooter, Row, ModalHeader, Input
} from 'reactstrap';
import Breadcrumbs from "../../../components/Admin/Breadcrumb";
import { Link } from 'react-router-dom';
import axios from 'axios';
import List from 'list.js';
import { BASE_URL } from '../../helpers/config';
import Papa from 'papaparse';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

const ManageOrder = () => {
    const [orders, setOrders] = useState([]);
    const [modal_list, setModalList] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const [editedOrderCode, setEditedOrderCode] = useState('');
    const [editedQuantity, setEditedQuantity] = useState('');
    const [modal_list1, setModalList1] = useState(false);

    // Fetch orders from backend
    const fetchOrders = async () => {
        try {
            const response = await axios.get(`${BASE_URL}/products/orders/pending/`);
            setOrders(response.data || []);
        } catch (error) {
            console.error("Error fetching orders:", error);
        }
    };


    useEffect(() => {
        fetchOrders();

        const optionsList = {
            valueNames: ['contact-name', 'contact-message']
        };
        new List('contact-existing-list', optionsList);
        new List('fuzzysearch-list', { valueNames: ['name'] });
        new List('pagination-list', { valueNames: ['pagi-list'], page: 3, pagination: true });
    }, []);


    const tog_list1 = (order) => {
        setSelectedItem(order);
        setEditedOrderCode(order.order.ordercode);
        setEditedQuantity(order.item.quantity);
        setModalList1(!modal_list1);
        setModalList(false);
    };
    const tog_list = (order) => {
        setSelectedItem(order);
        setModalList(!modal_list);
        setModalList1(false);
    }

    // Handle save changes
    const handleSaveChanges = async () => {
        try {
            if (!selectedItem || !selectedItem.item) {
                throw new Error("Selected item is not valid.");
            }
    
            const updatedOrder = {
                ordercode: editedOrderCode,
                order_items: [
                    {
                        id: selectedItem.item.id,
                        product: {
                            id: selectedItem.item.product.id
                        },
                        quantity: editedQuantity
                    }
                ]
            };
    
            console.log("updatedOrder", updatedOrder);
    
            // Send the update request
            await axios.patch(`${BASE_URL}/products/orders/${selectedItem.order.id}/update/`, updatedOrder);
    
            // Update the orders list locally in the state
            setOrders((prevOrders) => 
                prevOrders.map((order) =>
                    order.id === selectedItem.order.id
                        ? { ...order, ordercode: editedOrderCode, order_items: updatedOrder.order_items }
                        : order
                )
            );
    
            setModalList1(false);  // Close the modal
            alert("Order updated successfully!");
        } catch (error) {
            console.error("Error updating order:", error.response ? error.response.data : error.message);
            alert("Error updating order. Please try again.");
        }
    };
    
    const downloadCSV = () => {
        if (!selectedItem) return;

        const orderData = {
            OrderId: selectedItem.order?.ordercode,
            ShopName: selectedItem.order?.user?.company_name,
            SKU: selectedItem.item?.product?.SKU,
            ProductName: selectedItem.item?.product?.product_name,
            ProductCategory: selectedItem.item?.product?.category_name,
            Quantity: selectedItem.item?.quantity,
            ProductColor: selectedItem.item?.product?.color,
            
            AdditionalNotes: selectedItem.item?.additional_notes,
            ShippingAddress: selectedItem.order?.user?.shipping_address,
            MobileNumber: selectedItem.order?.user?.mobile_number,
            WhatsAppNumber: selectedItem.order?.user?.whatsapp_number,
            Email: selectedItem.order?.user?.company_email,
        };


        const csv = Papa.unparse([orderData]);
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.setAttribute('download', 'order_details.csv');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };



    const downloadPDF = () => {
        if (!selectedItem) return;

        const doc = new jsPDF();
        doc.setFontSize(12);


        const header = [
            "Field",
            "Value"
        ];

        // Create rows for each field-value pair
        const rows = [
            ["Order ID", selectedItem.order?.ordercode || "N/A"],
            ["Shop Name", selectedItem.order?.user?.company_name || "N/A"],
            ["SKU", selectedItem.item?.product?.SKU || "N/A"],
            ["Product Name", selectedItem.item?.product?.product_name || "N/A"],
            ["Product Category", selectedItem.item?.product?.category_name || "N/A"],
            ["Quantity", selectedItem.item?.quantity || "N/A"],
            ["Product Color", selectedItem.item?.product?.color || "N/A"],
            
            ["Additional Notes", selectedItem.item?.additional_notes || "N/A"],
            ["Shipping Address", selectedItem.order?.user?.shipping_address || "N/A"],
            ["Mobile Number", selectedItem.order?.user?.mobile_number || "N/A"],
            ["WhatsApp Number", selectedItem.order?.user?.whatsapp_number || "N/A"],
            ["Email", selectedItem.order?.user?.company_email || "N/A"]
        ];


        doc.setFontSize(16);
        doc.text('Order Details', 14, 20);
        doc.setFontSize(12);
        doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 30);


        doc.text(' ', 14, 40);


        doc.autoTable({
            head: [header],
            body: rows,
            startY: 50,
            theme: 'striped',
            headStyles: { fillColor: [22, 160, 133] },
            styles: {
                cellPadding: 4,
                minCellHeight: 10,
                overflow: 'linebreak',
                halign: 'left',
                valign: 'middle',
            },
        });


        doc.save('order_details.pdf');
    };

    const handleDeleteOrder = async (orderId) => {

        const confirmed = window.confirm("Are you sure you want to delete this order?");
        if (confirmed) {
            try {
                await axios.delete(`${BASE_URL}/products/orders/${orderId}/delete/`);
                fetchOrders();
                alert("Order deleted successfully!");
            } catch (error) {
                console.error("Error deleting order:", error.response ? error.response.data : error.message);
                alert("Failed to delete order.");
            }
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
                order.order_items.some(item =>
                    item.product?.product_name.toLowerCase().includes(lowercasedQuery)
                )
            );
            setFilteredOrders(results);
        } else {
            setFilteredOrders(orders);
        }
    }, [searchQuery, orders]);

const handleStatusChange = async (orderid, newStatus) => {
    const confirmed = window.confirm(`Are you sure you want to change the status to "${newStatus}"?`);
    if (!confirmed) return; // Exit if user cancels

    try {
        const response = await axios.patch(`${BASE_URL}/products/order/${orderid}/update-status/`, {
            status: newStatus
        });

        setOrders((prevOrders) =>
            prevOrders.map((order) =>
                order.id === orderid ? { ...order, status: newStatus } : order
            )
        );

        alert("Status Updated Successfully");
        console.log("status.....", response.data);
        fetchOrders();
    } catch (error) {
        console.error("Error updating status:", error);
        alert("There was an error updating the status. Please try again.");
    }
};

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
                                                                onChange={(e) => setSearchQuery(e.target.value)} // Update search query
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
                                                <table className="table align-middle table-nowrap min-500" id="customerTable">
                                                    <thead className="table-light">
                                                        <tr>
                                                            <th>OrderId</th>
                                                            <th>Order Date</th>
                                                            <th>Shop Name</th>
                                                            <th>SKU</th>
                                                            <th>Product Name</th>
                                                            <th>Product Category</th>
                                                            <th>Quantity</th>
                                                            <th>Status</th>
                                                            <th>Action</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody className="list form-check-all manage-product">
                                                        {filteredOrders.length > 0 ? (
                                                            filteredOrders.map((order) =>
                                                                order.order_items.map((item) => (
                                                                    <tr key={`${order.id}-${item.id}`}>
                                                                        <td className="OrderId">{order.ordercode}</td>
                                                                        <td> {new Date(order.created_at).toLocaleDateString('en-US', {
                                                                        day: 'numeric',
                                                                        month: 'numeric',
                                                                        year: 'numeric',
                                                                    })}</td>
                                                                        <td className="OrderId">{order.user?.company_name}</td>
                                                                        <td className="sku">{item.product?.SKU}</td>
                                                                        <td className="product_name">{item.product?.product_name}</td>
                                                                        <td className="product_category">{item.product?.category_name}</td>
                                                                        <td className="quantity">{item.quantity}</td>
                                                                        <td>
                                                                                {order.status && (
                                                                                    <select
                                                                                value={order.status || "pending"}
                                                                                onChange={(e) => handleStatusChange(order.id, e.target.value)}
                                                                                className="border rounded p-1 focus:ring-2 focus:ring-blue-400 text-sm"
                                                                            >
                                                                                <option value="pending">Pending</option>
                                                                                <option value="accepted">Accepted</option>
                                                                                <option value="delivered">Delivered</option>
                                                                            </select>
                                                                                )}
                                                                            </td>
                                                                        <td>
                                                                            <div className="d-flex gap-2">
                                                                                <div className="d-flex gap-2">
                                                                                    <button
                                                                                        className="btn btn-sm btn-success"
                                                                                        onClick={() => tog_list1({ order, item })}
                                                                                    >
                                                                                        Edit
                                                                                    </button>
                                                                                </div>
                                                                                <div className="edit">
                                                                                    <button
                                                                                        className="btn btn-sm btn-success edit-item-btn"
                                                                                        onClick={() => tog_list({ order, item })}
                                                                                    >
                                                                                        View  
                                                                                    </button>
                                                                                </div>
                                                                                <div className="edit">
                                                                                    <button
                                                                                        className="btn btn-sm btn-danger edit-item-btn"
                                                                                        onClick={() => handleDeleteOrder(order.id)}
                                                                                    >
                                                                                        Delete
                                                                                    </button>
                                                                                </div>

                                                                            </div>
                                                                        </td>
                                                                    </tr>
                                                                ))
                                                            )
                                                        ) : (
                                                            <tr>
                                                                <td colSpan="7" className="text-center">No orders found.</td>
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
                <Modal isOpen={modal_list1} toggle={() => setModalList1(!modal_list1)} centered style={{ maxWidth: '900px', width: '90%' }}>
                    <ModalHeader className="bg-light p-3" toggle={() => setModalList1(!modal_list1)}>
                        Edit Order
                    </ModalHeader>
                    <ModalBody style={{ padding: '20px' }}>
                        {selectedItem ? (
                            <>
                                <Row className="mb-3 mt-2">
                                    <label className="col-md-2 col-form-label">Order ID</label>
                                    <div className="col-md-10">
                                        <Input
                                            type="text"
                                            value={editedOrderCode}
                                            onChange={(e) => setEditedOrderCode(e.target.value)}
                                        />
                                    </div>
                                </Row>
                                <Row className="mb-3">
                                    <label className="col-md-2 col-form-label">Quantity</label>
                                    <div className="col-md-10">
                                        <Input
                                            type="number"
                                            value={editedQuantity}
                                            onChange={(e) => setEditedQuantity(e.target.value)}
                                        />
                                    </div>
                                </Row>
                            </>
                        ) : null}
                    </ModalBody>
                    <ModalFooter>
                        <Button color="primary" onClick={handleSaveChanges}>Save Changes</Button>
                        {/* <Button color="secondary" onClick={() => setModalList1(false)}>Close</Button> */}
                    </ModalFooter>
                </Modal>

                <Modal isOpen={modal_list} toggle={() => setModalList(!modal_list)} centered style={{ maxWidth: '1100px', width: '90%' }}>
                    <ModalHeader className="bg-light p-3" toggle={() => setModalList(!modal_list)}></ModalHeader>
                    <ModalBody style={{ padding: '20px' }}>
                        {console.log("Selected Item:", selectedItem)}
                        {selectedItem ? (
                            <>
                                <Row className="mb-3 mt-2">
                                    <label className="col-md-2 col-form-label">Product Image</label>
                                    <div className="col-md-10">
                                        <img
                                            src={`${BASE_URL}${selectedItem.item?.product?.product_image}`}
                                            alt={selectedItem.item?.product?.product_image}
                                            style={{ width: '100px', height: '100px' }}
                                        />
                                    </div>
                                </Row>
                                <Row className="mb-3">
                                    <label className="col-md-2 col-form-label">OrderId</label>
                                    <div className="col-md-10">
                                        <input
                                            className="form-control"
                                            type="text"
                                            value={selectedItem.order?.ordercode}
                                            readOnly
                                        />
                                    </div>
                                </Row>
                                <Row className="mb-3">
                                    <label className="col-md-2 col-form-label">SKU</label>
                                    <div className="col-md-10">
                                        <input
                                            className="form-control"
                                            type="text"
                                            value={selectedItem.item?.product?.SKU}
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
                                            value={selectedItem.item?.product?.product_name}
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
                                            value={selectedItem.item?.product?.category_name}
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
                                        value={
                                            selectedItem.item?.color
                                                ? selectedItem.item.color.charAt(0).toUpperCase() + selectedItem.item.color.slice(1)
                                                : ''  
                                        }
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
                                            value={selectedItem.item?.quantity}
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
                                <Row className="mb-3">
                                    <label className="col-md-2 col-form-label">Additional Notes</label>
                                    <div className="col-md-10">
                                        <textarea
                                            className="form-control"
                                            rows="4"
                                            value={selectedItem.item?.additional_notes}
                                            readOnly
                                        />
                                    </div>
                                </Row>
                                <Row className="mt-3">
                                    <Col className="text-end">
                                        <Button color="primary" onClick={downloadCSV} className="me-2">
                                            Download CSV
                                        </Button>
                                        
                                    </Col>
                                </Row>
                            </>
                        ) : null}
                    </ModalBody>


 
                </Modal>

        </React.Fragment>
    );
};

export default ManageOrder;
