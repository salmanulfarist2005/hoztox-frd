import React, { useState, useEffect } from 'react';
import { Button, Card, CardBody, Col, Container, Modal, ModalBody, ModalFooter, Row, ModalHeader } from 'reactstrap';
import Breadcrumbs from "../../../components/Admin/Breadcrumb";
import axios from 'axios';
import List from 'list.js';
import { BASE_URL } from '../../helpers/config';
import Papa from 'papaparse';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import useDebounce from '../../../Hooks/useDebounce';
const Outview = () => {
    const [orders, setOrders] = useState([]);
    const [modal_list1, setModalList1] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const [orderId, setOrderId] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    // const [filteredOrders, setFilteredOrders] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages,setTotalPages] = useState(1)
    const [pagetrigger, setPageTrigger] = useState(false);

       const debouncedValue = useDebounce(searchQuery)
    
    const fetchOrders = async () => {
        try {
            const response = await axios.get(`${BASE_URL}/products/orders/pending/`,{
                    params:{
                    is_paginated:true,
                    page:currentPage,
                    limit:10,
                    search:searchQuery
                }


            });
            if(!response.error){
            const productes = response.data.message.results;
            const totalPages = Math.ceil(response.data.message.count / 10);
            setOrders(productes);
            setTotalPages(totalPages)
            }

        } catch (error) {
            console.error("Error fetching orders:", error);
            setOrders([]);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, [pagetrigger,debouncedValue]);

    const handleNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage((prev)=>prev+1);
                  setPageTrigger(e=>!e)

        }
    };

    const handlePreviousPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
            setPageTrigger(e=>!e)

        }
    };

    const handleGenerateOrderId = async () => {
        if (!selectedItem || !selectedItem.id) {
            console.error("No selected item or item ID for generating order ID");
            alert("Error: No order selected.");
            return;
        }
        try {
            await axios.patch(`${BASE_URL}/products/ordersid/${selectedItem.id}/`, {
                ordercode: orderId,
            });
            setOrders(prevOrders =>
                prevOrders.map(order =>
                    order.id === selectedItem.id ? { ...order, ordercode: orderId } : order
                )
            );
            setModalList1(false);
            setOrderId('');
        } catch (error) {
            console.error("Error saving Order ID:", error);
            alert("There was an error saving the Order ID. Please try again.");
        }
    };

    const tog_list1 = (order) => {
        console.log("tog_list1 triggered with order:", order);
        if (order && order.id) {
            setSelectedItem(order);
            setOrderId(order.ordercode || '');
        }
        setModalList1(prevState => {
            console.log("Modal state before toggle:", prevState);
            const newState = !prevState;
            console.log("Modal state after toggle:", newState);
            return newState;
        });
    };

    // useEffect(() => {
    //     console.log("Search Query:", searchQuery);
    //     if (searchQuery) {
    //         const lowercasedQuery = searchQuery.toLowerCase();
    //         const results = orders.filter(order => {
    //             if (!order) return false;
    //             return (
    //                 (order.ordercode && order.ordercode.toLowerCase().includes(lowercasedQuery)) ||
    //                 (order.user?.company_name && order.user.company_name.toLowerCase().includes(lowercasedQuery)) ||
    //                 (order.order_items && Array.isArray(order.order_items) && order.order_items.some(item =>
    //                     item.product?.product_name && item.product.product_name.toLowerCase().includes(lowercasedQuery)
    //                 ))
    //             );
    //         });
    //         setFilteredOrders(results);
    //     } else {
    //         setFilteredOrders(orders);
    //     }
    //     console.log("Filtered Orders:", filteredOrders);
    // }, [searchQuery, orders]);

    const handleDeleteOrder = async (orderId) => {
        if (!orderId) {
            console.error("Invalid order ID for deletion");
            return;
        }
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
    const downloadFullOrderCSV = (orderid) => {
        if (!orderid) {
            console.error("Invalid order ID for CSV download");
            return;
        }
        const order = orders.find(order => String(order.id) === String(orderid));
        if (!order) {
            console.error(`Order with ID ${orderid} not found.`);
            return;
        }
        if (!order.order_items || !Array.isArray(order.order_items) || order.order_items.length === 0) {
            console.error("No order items available for this order.");
            return;
        }
        const orderData = order.order_items.map(item => ({
            OrderId: order.ordercode || "N/A",
            ShopName: order.user?.company_name || "N/A",
            SKU: item.product?.SKU || "N/A",
            ProductName: item.product?.product_name || "N/A",
            ProductCategory: item.product?.category_name || "N/A",
            Quantity: item.quantity || "N/A",
            ProductColor: item.color || "N/A",
            AdditionalNotes: item.additional_notes || "N/A",
            ShippingAddress: order.user?.shipping_address || "N/A",
            MobileNumber: order.user?.mobile_number || "N/A",
            WhatsAppNumber: order.user?.whatsapp_number || "N/A",
            Email: order.user?.company_email || "N/A",
        }));
        try {
            const csv = Papa.unparse(orderData);
            const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.setAttribute('download', `order_${order.ordercode || 'details'}.csv`);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch (error) {
            console.error("Error generating CSV:", error);
        }
    };

    return (
        <React.Fragment>
            <div className="main-content">
                <div className="page-content">
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
                                                                className="form-control rounded border-gray-300 focus:ring-2 focus:ring-blue-400"
                                                                placeholder="Search..."
                                                                value={searchQuery}
                                                                onChange={(e) => setSearchQuery(e.target.value)}
                                                                style={{ paddingRight: '30px' }}
                                                            />
                                                            <i className="ri-search-line" style={{
                                                                position: 'absolute',
                                                                right: '10px',
                                                                top: '50%',
                                                                transform: 'translateY(-50%)',
                                                                pointerEvents: 'none',
                                                                color: '#6b7280'
                                                            }}></i>
                                                        </div>
                                                    </div>
                                                </Col>
                                            </Row>

                                            <div className="table-responsive table-card mt-3 mb-1">
                                                <table className="table align-middle table-nowrap">
                                                    <thead className="table-light bg-gray-50">
                                                        <tr>
                                                            <th className="font-medium text-gray-600">Order ID</th>
                                                            <th className="font-medium text-gray-600">Shop Name</th>
                                                            <th className="font-medium text-gray-600">Status</th>
                                                            <th className="font-medium text-gray-600">Action</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {orders.length > 0 ? (
                                                            orders.map((order, index) => {
                                                                if (!order || !order.id) {
                                                                    console.error(`Invalid order at index ${index}:`, order);
                                                                    return (
                                                                        <tr key={`invalid-${index}`}>
                                                                            <td colSpan="4" className="text-center text-red-500">
                                                                                Invalid order data
                                                                            </td>
                                                                        </tr>
                                                                    );
                                                                }
                                                                console.log(`Rendering order ${order.id}:`, order);
                                                                return (
                                                                    <tr key={order.id} className="hover:bg-gray-100">
                                                                        <td className="text-gray-700">{order.ordercode || 'N/A'}</td>
                                                                        <td className="text-gray-700">{order.user?.company_name || 'N/A'}</td>
                                                                        <td>


                                                                            <select
                                                                                value={order.status || "pending"}
                                                                                onChange={(e) => handleStatusChange(order.id, e.target.value)}
                                                                                className="border rounded p-1 focus:ring-2 focus:ring-blue-400 text-sm"
                                                                            >
                                                                                <option value="pending">Pending</option>
                                                                                <option value="accepted">Accepted</option>
                                                                                <option value="delivered">Delivered</option>
                                                                            </select>
                                                                        </td>
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
                                                                                <button
                                                                                    onClick={() => window.location.href = `/view-order/${order.id}`}
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
                                                                                <button
                                                                                    onClick={() => downloadFullOrderCSV(order.id)}
                                                                                    title="Download CSV"
                                                                                    style={{
                                                                                        background: 'none',
                                                                                        border: 'none',
                                                                                        padding: '5px',
                                                                                        cursor: 'pointer',
                                                                                        display: 'inline-block'
                                                                                    }}
                                                                                >
                                                                                    <i className="ri-download-line" style={{ fontSize: '18px', color: '#6b7280' }}></i>
                                                                                </button>
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
                                                                );
                                                            })
                                                        ) : (
                                                            <tr>
                                                                <td colSpan="4" className="text-center text-gray-500">No orders found.</td>
                                                            </tr>
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
                isOpen={modal_list1}
                toggle={() => tog_list1(null)}
                centered
                style={{ maxWidth: '600px', width: '90%' }}
            >
                <ModalHeader className="bg-light p-3" toggle={() => tog_list1(null)}>
                    Generate Order ID
                </ModalHeader>
                <ModalBody style={{ padding: '20px' }}>
                    <Row>
                        <label htmlFor="orderId" className="col-md-4 col-form-label font-medium text-gray-600">Enter Order ID:</label>
                        <div className="col-md-8">
                            <input
                                type="text"
                                className="form-control rounded border-gray-300 focus:ring-2 focus:ring-blue-400"
                                id="orderId"
                                value={orderId}
                                onChange={(e) => setOrderId(e.target.value)}
                            />
                        </div>
                    </Row>
                </ModalBody>
                <ModalFooter>
                    <Button
                        onClick={handleGenerateOrderId}
                        style={{
                            backgroundColor: '#3b82f6',
                            color: 'white',
                            padding: '8px 16px',
                            borderRadius: '4px',
                            border: 'none'
                        }}
                    >
                        Save
                    </Button>

                </ModalFooter>
            </Modal>
        </React.Fragment>
    );
};

export default Outview;