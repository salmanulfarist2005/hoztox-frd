import React, { useState, useEffect } from 'react';
import Breadcrumbs from "../../../components/Admin/Breadcrumb";
import { Link } from 'react-router-dom';
import axios from 'axios';
import { BASE_URL } from '../../helpers/config';
import { Button, Card, CardBody, CardHeader, Col, Container, Row, Modal, ModalBody, ModalFooter, ModalHeader, Input } from 'reactstrap';
import Papa from 'papaparse';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import CompletedCustumOrdersFullPage from '../FullCustomOrders/CompletedOrder'



const CompletedOrder = ({ order, onStatusUpdate }) => {
    const [orders, setOrders] = useState([]);
    const [modal_list, setModalList] = useState(false);
    const [modal_delete, setModalDelete] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const [modal_list1, setModalList1] = useState(false);
    const [orderId, setOrderId] = useState('');
    const [status, setStatus] = useState(order?.status || 'N/A');


    const [editedOrderCode, setEditedOrderCode] = useState('');
    const [editedQuantity, setEditedQuantity] = useState('');

    const fetchOrders = async () => {
        try {
            const response = await axios.get(`${BASE_URL}/products/delivered-orders/`);
            setOrders(response.data || []);
            console.log("response", response.data);
        } catch (error) {
            console.error("Error fetching orders:", error);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    const tog_list1 = (order) => {
        if (!order) return;
        console.log("Selected Item for Order ID:", order);
        setSelectedItem(order);
        setOrderId(order.ordercode || '');
        setEditedOrderCode(order.ordercode || '');
        setEditedQuantity(order.quantity || '');
        setModalList1(!modal_list1);
    };

    const tog_list = (order) => {
        setSelectedItem(order);
        setModalList(!modal_list);
        setModalList1(false);
    }

    const handleSaveChanges = async () => {
        if (!selectedItem) return;

        try {

            await axios.patch(`${BASE_URL}/products/custom-orders/${selectedItem.id}/`, {
                ordercode: editedOrderCode,
                quantity: editedQuantity,
            });


            setOrders((prevOrders) => {

                const updatedOrders = prevOrders.map((order) =>
                    order.id === selectedItem.id
                        ? { ...order, ordercode: editedOrderCode, quantity: editedQuantity }
                        : order
                );


                return updatedOrders.sort((a, b) => a.id - b.id);
            });

            alert("Updated Successfully");
            setModalList1(false);
        } catch (error) {
            console.error("Error saving changes:", error);
            alert("There was an error saving the changes. Please try again.");
        }
    };

    const downloadCSV = () => {
        if (!selectedItem) return;

        const orderData = {
            OrderId: selectedItem.order?.ordercode,
            ShopName: selectedItem.order?.user?.company_name,
            SKU: selectedItem.order?.product?.SKU,
            ProductName: selectedItem.order?.product?.product_name,
            ProductCategory: selectedItem.order?.product?.category_name,
            Quantity: selectedItem.order?.quantity,
            ProductColor: selectedItem.order?.product?.color,
            ProductSize: selectedItem.order?.product?.product_size,
            AdditionalNotes: selectedItem.order?.additional_notes,
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


        const rows = [
            ["Order ID", selectedItem.order?.ordercode || "N/A"],
            ["Shop Name", selectedItem.order?.user?.company_name || "N/A"],
            ["SKU", selectedItem.item?.product?.SKU || "N/A"],
            ["Product Name", selectedItem.order?.product?.product_name || "N/A"],
            ["Product Category", selectedItem.order?.product?.category_name || "N/A"],
            ["Quantity", selectedItem.order?.quantity || "N/A"],
            ["Product Color", selectedItem.order?.product?.color || "N/A"],
            ["Product Size", selectedItem.order?.product?.product_size || "N/A"],
            ["Additional Notes", selectedItem.order?.additional_notes || "N/A"],
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
                await axios.delete(`${BASE_URL}/products/custom-orders/${orderId}/delete/`);
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
                (order.order_items && order.order_items.some(item =>
                    item.product?.product_name.toLowerCase().includes(lowercasedQuery)
                ))
            );
            setFilteredOrders(results);
        } else {
            setFilteredOrders(orders);
        }
    }, [searchQuery, orders]);
    const [editingOrderId, setEditingOrderId] = useState(null);
    const [newStatus, setNewStatus] = useState({});
    const [showConfirm, setShowConfirm] = useState(false);
    const [isEditing, setIsEditing] = useState(false);

    const handleStatusChange = (orderId, value) => {
        setStatus(value);
        setEditingOrderId(orderId);
        setIsEditing(true);
    };

    const handleConfirm = async (orderId) => {
        if (orderId) {
            const requestData = {
                new_status: status,
            };

            try {
                await axios.patch(`${BASE_URL}/products/orders/${orderId}/update-status/`, requestData);

                // Update the specific order directly in the state
                setOrders((prevOrders) =>
                    prevOrders.map((order) =>
                        order.id === orderId ? { ...order, new_status: status } : order
                    )
                );

                alert("Status updated successfully!");
            } catch (error) {
                console.error("There was an error updating the status:", error);
                alert("Failed to update status. Please try again.");
            } finally {
                setEditingOrderId(null);
                setStatus('');
            }
        }
    };





    const newStatusChoices = [
        { value: 'processed', label: 'Processed', className: 'badge bg-warning text-dark' },
        { value: 'cad', label: 'CAD', className: 'badge bg-secondary' },
        { value: 'cam', label: 'CAM', className: 'badge bg-success' },
        { value: 'wax', label: 'WAX', className: 'badge bg-danger' },
        { value: 'casting', label: 'Casting', className: 'badge bg-warning' },
        { value: 'grilling', label: 'Grilling', className: 'badge bg-info' },
        { value: 'filling', label: 'Filling', className: 'badge bg-success' },
        { value: 'pre polish', label: 'Pre Polish', className: 'badge bg-dark' },
        { value: 'setting', label: 'Setting', className: 'badge bg-primary' },
        { value: 'final polish', label: 'Final Polish', className: 'badge bg-secondary' },
        { value: 'rhoium', label: 'Rhoium', className: 'badge bg-success' },
        { value: 'final qc', label: 'Final QC', className: 'badge bg-danger' },
        { value: 'certification', label: 'Certification', className: 'badge bg-warning' },
        { value: 'invoice', label: 'Invoice', className: 'badge bg-info' },
        { value: 'out for delivery', label: 'Out For Delivery', className: 'badge bg-secondary' },
        { value: 'delivered', label: 'Delivered', className: 'badge bg-success' },
    ];


    const getBadgeClass = (status) => {
        const statusChoice = newStatusChoices.find(choice => choice.value === status);
        return statusChoice ? statusChoice.className : 'badge-default';
    };
    return (
        <React.Fragment>
            <div className="main-content">
                <div className="page-content ">
                    <Container fluid>
                        <Breadcrumbs title="Orders" breadcrumbItem="Manage Custom Orders" />

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
                                                <table className="table align-middle table-nowrap min-500" id="customerTable">
                                                    <thead className="table-light">
                                                        <tr>
                                                            <th className="sort" data-sort="shop_name">Order Id</th>
                                                            <th className="sort" data-sort="shop_name">Order Date</th>
                                                            <th className="sort" data-sort="shop_name">Shop Name</th>
                                                            <th className="sort" data-sort="order_id">SKU</th>
                                                            <th className="sort" data-sort="size">Product Name</th>
                                                            <th className="sort" data-sort="gram">Product Category</th>
                                                            <th className="sort" data-sort="cent">Quantity</th>
                                                            <th className="sort" data-sort="cent">Status</th>
                                                            <th className="sort" data-sort="action">Action</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody className="list form-check-all manage-product">


                                                        {filteredOrders.length > 0 ? (
                                                            filteredOrders.map((order) => (
                                                                <tr key={order.id}>

                                                                    <td>{order.ordercode}</td>
                                                                    <td> {new Date(order.created_at).toLocaleDateString('en-US', {
                                                                        day: 'numeric',
                                                                        month: 'numeric',
                                                                        year: 'numeric',
                                                                    })}</td>
                                                                    <td>{order.user?.company_name || "N/A"}</td>
                                                                    <td>{order.product?.SKU || "N/A"}</td>
                                                                    <td>{order.product?.product_name || "N/A"}</td>
                                                                    <td>{order.product?.category_name || "N/A"}</td>
                                                                    <td>{order.quantity}</td>
                                                                    <td>
                                                                        {editingOrderId === order.id ? (
                                                                            <div className="d-flex gap-2 align-items-center">
                                                                                <Input
                                                                                    type="select"
                                                                                    value={status}
                                                                                    onChange={(e) => setStatus(e.target.value)}
                                                                                    className="form-select form-select-sm"
                                                                                    style={{ width: 'auto' }}
                                                                                >
                                                                                    {newStatusChoices.map((choice) => (
                                                                                        <option key={choice.value} value={choice.value}>
                                                                                            {choice.label}
                                                                                        </option>
                                                                                    ))}
                                                                                </Input>

                                                                                <button
                                                                                    onClick={() => handleConfirm(order.id)}
                                                                                    title="Confirm"
                                                                                    style={{
                                                                                        background: 'none',
                                                                                        border: 'none',
                                                                                        padding: '5px',
                                                                                        cursor: 'pointer',
                                                                                        display: 'inline-block'
                                                                                    }}
                                                                                >
                                                                                    <i className="ri-check-line" style={{ fontSize: '18px', color: '#10b981' }}></i>
                                                                                </button>

                                                                                <button
                                                                                    onClick={() => setEditingOrderId(null)}
                                                                                    title="Cancel"
                                                                                    style={{
                                                                                        background: 'none',
                                                                                        border: 'none',
                                                                                        padding: '5px',
                                                                                        cursor: 'pointer',
                                                                                        display: 'inline-block'
                                                                                    }}
                                                                                >
                                                                                    <i className="ri-close-line" style={{ fontSize: '18px', color: '#6b7280' }}></i>
                                                                                </button>


                                                                            </div>
                                                                        ) : (
                                                                            <div className="d-flex gap-2 align-items-center ">
                                                                                <span
                                                                                    className={`badge ${getBadgeClass(order.new_status)} px-3 py-2`}
                                                                                    style={{
                                                                                        width: '140px',
                                                                                        textAlign: 'center',
                                                                                        whiteSpace: 'nowrap',
                                                                                        overflow: 'hidden',
                                                                                        textOverflow: 'ellipsis',
                                                                                    }}
                                                                                >
                                                                                    {newStatusChoices.find(
                                                                                        (choice) => choice.value === order.new_status
                                                                                    )?.label || order.new_status}
                                                                                </span>

                                                                                <button
                                                                                    className='min-ll-500'
                                                                                    size="sm"
                                                                                    color="primary"
                                                                                    onClick={() => {
                                                                                        setEditingOrderId(order.id);
                                                                                        setStatus(order.new_status);
                                                                                    }}
                                                                                    style={{
                                                                                        backgroundColor: '#e5e7eb',
                                                                                        border: '1px solid #d1d5db',
                                                                                        padding: '4px 8px',
                                                                                        borderRadius: '4px',
                                                                                        cursor: 'pointer',
                                                                                        display: 'inline-block',
                                                                                        color: '#374151',
                                                                                        fontSize: '14px',
                                                                                        transition: 'background-color 0.2s'
                                                                                    }}
                                                                                >
                                                                                    Change Status
                                                                                </button>
                                                                            </div>
                                                                        )}
                                                                    </td>

                                                                    <td>
                                                                        <div className="d-flex gap-2">
                                                                            {/* View Button with Icon */}
                                                                            <button
                                                                                onClick={() => tog_list({ order })}
                                                                                title="View"
                                                                                style={{
                                                                                    background: 'none',
                                                                                    border: 'none',
                                                                                    padding: '5px',
                                                                                    cursor: 'pointer',
                                                                                    display: 'inline-block'
                                                                                }}
                                                                            >
                                                                                <i className="ri-eye-line" style={{ fontSize: '18px', color: '#6b7280' }}></i>
                                                                            </button>

                                                                            {/* Edit Button with Icon */}
                                                                            <button
                                                                                onClick={() => tog_list1(order)}
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

                                                                            {/* Delete Button with Icon */}
                                                                            <button
                                                                                onClick={() => handleDeleteOrder(order.id)}
                                                                                title="Delete"
                                                                                style={{
                                                                                    background: 'none',
                                                                                    border: 'none',
                                                                                    padding: '5px',
                                                                                    cursor: 'pointer',
                                                                                    display: 'inline-block'
                                                                                }}
                                                                            >
                                                                                <i className="ri-delete-bin-line" style={{ fontSize: '18px', color: '#6b7280' }}></i>
                                                                            </button>
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
            <CompletedCustumOrdersFullPage />
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
                                        alt={`Image of ${selectedItem.order?.product?.product_name}`}
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
                                    <Button color="primary" onClick={downloadCSV} className="me-2">
                                        Download CSV
                                    </Button>
                                    <Button color="primary" onClick={downloadPDF}>
                                        Download PDF
                                    </Button>
                                </Col>
                            </Row>
                        </>
                    ) : (
                        <div>No order selected.</div>
                    )}
                </ModalBody>
            </Modal>
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
                    <Button color="primary" onClick={handleSaveChanges}>Save </Button>
                    
                </ModalFooter>
            </Modal>
        </React.Fragment>
    );
};

export default CompletedOrder;
