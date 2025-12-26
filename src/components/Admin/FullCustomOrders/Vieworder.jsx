import React, { useState, useEffect } from 'react';

import Breadcrumbs from "../../../components/Admin/Breadcrumb";
import { Link } from 'react-router-dom';
import axios from 'axios';
import { BASE_URL } from '../../helpers/config';
import Papa from 'papaparse';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { Button, Card, CardBody, CardHeader, Col, Container, ListGroup, ListGroupItem, Modal, ModalBody, ModalFooter, Row, ModalHeader } from 'reactstrap';
import useDebounce from '../../../Hooks/useDebounce';
import Pagination from '../../pagination/Pagination';
const FullCustomViewOrder = () => {
    const [orders, setOrders] = useState([]);
    const [modal_list, setModalList] = useState(false);
    const [modal_delete, setModalDelete] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const [modal_list1, setModalList1] = useState(false);
    const [orderId, setOrderId] = useState('');
    const [dueDate, setDueDate] = useState('');
    const [searchQuery, setSearchQuery] = useState('');

            const [currentPage, setCurrentPage] = useState(1);
            const itemsPerPage = 10;
            const [pagetrigger, setPageTrigger] = useState(false);
            const [totalPages,setTotalPages] = useState(1)
            const [itemCount,setItemCount] = useState(1)
           const debouncedValue = useDebounce(searchQuery)
        const handlePageChange = (page) => {
        setCurrentPage(page);
        setPageTrigger(e => !e);
    };


    const fetchOrders = async () => {
        try {
            const response = await axios.get(`${BASE_URL}/products/full-customized-approved/`,{
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

        if (order.due_date) {
            const parsedDueDate = new Date(order.due_date).toISOString().split('T')[0];
            setDueDate(parsedDueDate);
        } else {
            setDueDate('');
        }
        setModalList1(!modal_list1);
    };

    const tog_delete = () => {
        setModalDelete(!modal_delete);
    }; const tog_list = (order) => {
        console.log("Selected Order:", order);
        setSelectedItem(order);
        setModalList(!modal_list);
    };





    const handleGenerateOrderId = async () => {
        if (!selectedItem || !selectedItem.id) {
            console.error("Selected item or order ID is missing.", selectedItem.id);
            alert("Cannot generate Order ID. Please select an order first.");
            return;
        }
    
        try {
        
            const payload = {
                ordercode: orderId
            };
    
            if (dueDate) {
        
                payload.due_date = new Date(dueDate).toISOString();   
            }
    
            const response = await axios.patch(`${BASE_URL}/products/custom-full-orders/${selectedItem.id}/generate-order-id/`, payload);
            
    
            console.log("Order ID generated:", response.data);
            alert("Order ID Created Successfully");
            fetchOrders();
            setModalList1(false);
            setOrderId('');
            setDueDate('');
        } catch (error) {
            console.error("Error saving Order ID:", error.response ? error.response.data : error);
            alert("There was an error saving the Order ID. Please try again.");
        }
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

    return (
        <React.Fragment>
            <div className="main-content">
                <div className="page-content ">
                    <Container fluid>
                        <Breadcrumbs title="Orders" breadcrumbItem="View Full Custom Orders" />

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
                                                <table className="table align-middle table-nowrap" id="customerTable">
                                                    <thead className="table-light">
                                                        <tr>
                                                            <th className="sort" data-sort="shop_name">OrderId</th>
                                                            <th className="sort" data-sort="shop_name">Shop Name</th>

                                                            <th className="sort" data-sort="gram">Product Category</th>
                                                            <th className="sort" data-sort="cent">Product Size</th>
                                                            <th className="sort" data-sort="cent">Quantity</th>

                                                            <th className="sort" data-sort="shop_name">Status</th>
                                                            <th className="sort" data-sort="action">Action</th>
                                                        </tr>


                                                    </thead>
                                                    <tbody className="list form-check-all">
                                                        {orders.length > 0 ? (
                                                            orders.map((order) => (
                                                                <tr key={order.id}>
                                                                    <td>{order.ordercode}</td>
                                                                    <td>{order.user?.company_name}</td>

                                                                    <td>{order.category?.category_name}</td>
                                                                    <td>{order.size}</td>
                                                                    <td>{order.quantity}</td>

                                                                    <td className="bgbutton">{order.new_status}</td>
                                                                   <td>
                                                                                <div className="d-flex gap-2" style={{ minWidth: '200px', alignItems: 'center' }}>
                                                                            
                                                                               <button
                                                                                    onClick={() => tog_list1(order)}
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
                                                                                    onMouseOver={(e) => e.target.style.backgroundColor = '#d1d5db'}
                                                                                    onMouseOut={(e) => e.target.style.backgroundColor = '#e5e7eb'}
                                                                                >
                                                                                    Generate Order ID
                                                                                </button>
                                                                         
                                                                            <div className="edit">
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
                <Modal
                    isOpen={modal_list1}
                    toggle={tog_list1}
                    centered
                    style={{ maxWidth: '600px', width: '90%' }}
                >
                    <ModalHeader className="bg-light p-3" id="exampleModalLabel" toggle={tog_list1}>
                        Generate Order ID
                    </ModalHeader>
                    <ModalBody style={{ padding: '20px' }}>
                        <Row>
                            <label htmlFor="orderId" className="col-md-4 col-form-label">Enter Order ID:</label>
                            <div className="col-md-8">
                                <input
                                    type="text"
                                    className="form-control"
                                    id="orderId"
                                    value={orderId}
                                    onChange={(e) => setOrderId(e.target.value)}
                                />
                            </div>
                        </Row>
                        <Row className='duedate'>
                            <label htmlFor="dueDate" className="col-md-4 col-form-label">Due Date:</label>
                            <div className="col-md-8">
                                <input
                                    type="date"
                                    className="form-control"
                                    id="dueDate"
                                    value={dueDate}
                                    onChange={(e) => setDueDate(e.target.value)}
                                />
                            </div>
                        </Row>
                    </ModalBody>
                    <ModalFooter>
                        <Button color="primary" onClick={handleGenerateOrderId}>Save</Button>
                        <Button color="secondary" onClick={tog_list1}>Cancel</Button>
                    </ModalFooter>
                </Modal>


        </React.Fragment>
    );
};

export default FullCustomViewOrder;
