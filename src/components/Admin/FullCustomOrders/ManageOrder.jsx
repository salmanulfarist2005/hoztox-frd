import React, { useState, useEffect } from 'react';

import Breadcrumbs from "../../../components/Admin/Breadcrumb";
import { Link } from 'react-router-dom';
import axios from 'axios';
import { BASE_URL } from '../../helpers/config';
import Papa from 'papaparse';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import useDebounce from '../../../Hooks/useDebounce';
import { Button, Card, CardBody, CardHeader, Col, Container, Row, Modal, ModalBody, ModalFooter, ModalHeader, Input } from 'reactstrap';
import Pagination from '../../pagination/Pagination';
const FullCustomManageOrder = (order) => {
    const [orders, setOrders] = useState([]);
    const [modal_list, setModalList] = useState(false);
    const [modal_delete, setModalDelete] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const [modal_list1, setModalList1] = useState(false);
    const [orderId, setOrderId] = useState('');
    const [editedOrderCode, setEditedOrderCode] = useState('');
    const [editedQuantity, setEditedQuantity] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const [status, setStatus] = useState(order?.status || 'N/A');
    const [searchQuery, setSearchQuery] = useState('');

                const [currentPage, setCurrentPage] = useState(1);
                const itemsPerPage = 10;
                const [pagetrigger, setPageTrigger] = useState(false);
                const [totalPages,setTotalPages] = useState(1)
                const [itemCount,setItemCount] = useState(1)
               const debouncedValue = useDebounce(searchQuery)
    
    const fetchOrders = async () => {
        try {
            const response = await axios.get(`${BASE_URL}/products/full-customized-approved/`,{
                    headers: { Authorization: `Bearer ${localStorage.getItem('authToken')}` },
                    params:{
                    is_paginated:true,
                    page:currentPage,
                    limit:10,
                    search:searchQuery
                }

            });
                                                if(!response.error){
                    const orders = response.data.message.results;
                    const totalPages = Math.ceil(response.data.message.count / itemsPerPage);
                    setOrders(orders);
                    setItemCount(response.data.message.count)
                    setTotalPages(totalPages)
            }

        } catch (error) {
            console.error("Error fetching orders:", error);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, [pagetrigger,debouncedValue]);



    const tog_list1 = (order) => {
        console.log("Selected Item for Order ID:", order);
        setSelectedItem(order);
        setOrderId(order.ordercode || '');
        setEditedOrderCode(order.ordercode || '');
        setEditedQuantity(order.quantity || '');
        setModalList1(!modal_list1);
    };


    const tog_delete = () => {
        setModalDelete(!modal_delete);
    }; const tog_list = (order) => {
        console.log("Selected Order:", order);
        setSelectedItem(order);
        setModalList(!modal_list);
    };





    const downloadCSV = () => {
        if (!selectedItem) return;

        const orderData = {
            OrderId: selectedItem.order?.ordercode,
            ShopName: selectedItem.order?.user?.company_name,

            ProductCategory: selectedItem.order?.category?.category_name,
            Quantity: selectedItem.order?.quantity,
            ProductColor: selectedItem.order?.category?.color,
            ProductSize: selectedItem.order?.size,

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
            ["Product Category", selectedItem.order?.category?.category_name || "N/A"],
            ["Quantity", selectedItem.order?.quantity || "N/A"],
            ["Product Color", selectedItem.order?.color?.color || "N/A"],
            ["Product Size", selectedItem.order?.size || "N/A"],
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


    const handleSaveChanges = async () => {
        if (!selectedItem) return;
        console.log("selectedItem", selectedItem);

        try {
            // Perform the update request
            await axios.patch(`${BASE_URL}/products/custom-full-orders/${selectedItem.id}/`, {
                ordercode: editedOrderCode,
                quantity: editedQuantity,
            },{
                headers: {
                    "Authorization": `Bearer ${localStorage.getItem('authToken')}`,
                }
            });

            // After updating, update the state to reflect the changes
            setOrders((prevOrders) => {
                // Update the specific order based on the selected item
                const updatedOrders = prevOrders.map((order) =>
                    order.id === selectedItem.id
                        ? { ...order, ordercode: editedOrderCode, quantity: editedQuantity }  // Update the changed fields
                        : order
                );

                // Optionally, you can sort the orders by an appropriate field, for example, order ID
                return updatedOrders.sort((a, b) => a.id - b.id);  // Sorting by `id`, adjust based on your needs
            });

            // Fetch orders again if necessary
            // fetchOrders();  // Optional, if you still want to fetch orders again

            alert("Updated Successfully");
            setModalList1(false);
        } catch (error) {
            console.error("Error saving changes:", error);
            alert("There was an error saving the changes. Please try again.");
        }
    };


    const handleDeleteOrder = async (orderId) => {

        const confirmed = window.confirm("Are you sure you want to delete this order?");
        if (confirmed) {
            try {
                await axios.delete(`${BASE_URL}/products/custom-full-orders/${orderId}/delete/`,{
                    headers: {
                    "Authorization": `Bearer ${localStorage.getItem('authToken')}`,
                }
                });
                fetchOrders();
                alert("Order deleted successfully!");
            } catch (error) {
                console.error("Error deleting order:", error.response ? error.response.data : error.message);
                alert("Failed to delete order.");
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

    const [editingOrderId, setEditingOrderId] = useState(null);
    const getBadgeClass = (status) => {
        const statusChoice = newStatusChoices.find(choice => choice.value === status);
        return statusChoice ? statusChoice.className : 'badge-default';
    };

          const handlePageChange = (page) => {
        setCurrentPage(page);
        setPageTrigger(e => !e);
    };


    const handleStatusChange = (orderId, value) => {
        setStatus(value);
        setEditingOrderId(orderId);
        setIsEditing(true);
    };
    const handleConfirm = async () => {
        if (editingOrderId) {
            console.log("editingOrderId", editingOrderId);

            const requestData = {
                new_status: status,
            };
            console.log("Request Data:", requestData);

            try {
                const response = await axios.patch(
                    `${BASE_URL}/products/full-orders/${editingOrderId}/update-status/`,
                    requestData,{
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem('authToken')}`,
                        },
                    }
                );
                console.log("Response:", response);

                // Update the specific order directly in the state
                setOrders((prevOrders) =>
                    prevOrders.map((order) =>
                        order.id === editingOrderId ? { ...order, new_status: status } : order
                    )
                );

                alert("Status updated successfully!");
            } catch (error) {
                console.error("There was an error updating the status:", error);
                alert("Failed to update status. Please try again.");
            } finally {
                setIsEditing(false);
                setEditingOrderId(null);
                setStatus('');
            }
        }
    };



    return (
        <React.Fragment>
            <div className="main-content">
                <div className="page-content ">
                    <Container fluid>
                        <Breadcrumbs title="Orders" breadcrumbItem="Manage Full Custom Orders" />

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
                                                                onChange={(e) => {setSearchQuery(e.target.value)
                                                                    setCurrentPage(1)
                                                                }}
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
                                                            <th className="sort" data-sort="shop_name">OrderId</th>
                                                            <th className="sort" data-sort="shop_name">Order Date</th>
                                                            <th className="sort" data-sort="shop_name">Shop Name</th>

                                                            <th className="sort" data-sort="gram">Product Category</th>
                                                            <th className="sort" data-sort="cent">Product Size</th>
                                                            <th className="sort" data-sort="cent">Quantity</th>

                                                            <th className="sort" data-sort="cent">Status</th>
                                                            <th className="sort" data-sort="action">Action</th>
                                                        </tr>


                                                    </thead>
                                                    <tbody className="list form-check-all manage-product">
                                                        {orders.length > 0 ? (
                                                            orders.map((order) => (
                                                                <tr key={order.id}>
                                                                    <td>{order.ordercode}</td>
                                                                    <td> {new Date(order.created_at).toLocaleDateString('en-US', {
                                                                        day: 'numeric',
                                                                        month: 'numeric',
                                                                        year: 'numeric',
                                                                    })}</td>
                                                                    <td>{order.user?.company_name}</td>

                                                                    <td>{order.category?.category_name}</td>
                                                                    <td>{order.size}</td>
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

                                            <div className="d-flex justify-content-end mt-3">
                                                    <Pagination
                                                        currentPage={currentPage}
                                                        totalPages={totalPages}
                                                        totalItems={itemCount}
                                                        onPageChange={handlePageChange}
                                                        showTotal={true}
                                                    />
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
                style={{ maxWidth: '1100px', width: '90%' }}
            >
                <ModalHeader className="bg-light p-3" id="exampleModalLabel" toggle={tog_list}>
                    View Product
                </ModalHeader>
                <ModalBody style={{ padding: '20px' }}>
                    {console.log("Selected Item:", selectedItem)}
                    {selectedItem ? (
                        <>
                            <Row className="mb-3 mt-2">
                                <label className="col-md-2 col-form-label">Product Images</label>
                                <div className="col-md-10">
                                    {console.log("Selected Item:", selectedItem)}
                                    {Array.isArray(selectedItem.order?.additional_images) && selectedItem.order?.additional_images.length > 0 ? (
                                        selectedItem.order?.additional_images.map((imageObj, index) => (
                                            <img
                                                key={index}
                                                src={BASE_URL + imageObj.image}
                                                alt={`Image ${index + 1} of ${selectedItem.order?.product?.product_name}`}
                                                style={{ width: '100px', height: '100px', marginRight: '5px' }}
                                                onError={(e) => { e.target.src = 'path/to/placeholder-image.png'; }}
                                            />
                                        ))
                                    ) : (
                                        <div>No images available.</div>
                                    )}
                                </div>
                            </Row>







                            <Row className="mb-3">
                                <label className="col-md-2 col-form-label">Product Category</label>
                                <div className="col-md-10">
                                    <input
                                        className="form-control"
                                        type="text"
                                        value={selectedItem.order?.category?.category_name}
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
                                        value={selectedItem.order?.color?.color}
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
                                        value={selectedItem.order?.size}
                                        readOnly
                                    />
                                </div>
                            </Row>
                            <Row className="mb-3">
                                <label className="col-md-2 col-form-label">Gram</label>
                                <div className="col-md-10">
                                    <input
                                        className="form-control"
                                        type="text"
                                        value={selectedItem.order?.gram}
                                        readOnly
                                    />
                                </div>
                            </Row>
                            <Row className="mb-3">
                                <label className="col-md-2 col-form-label">Cent</label>
                                <div className="col-md-10">
                                    <input
                                        className="form-control"
                                        type="text"
                                        value={selectedItem.order?.cent}
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
                                        value={selectedItem.order?.description}
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
                    <Button color="primary" onClick={handleSaveChanges}>Save</Button>
             
                </ModalFooter>
            </Modal>

        </React.Fragment>
    );
};

export default FullCustomManageOrder;
