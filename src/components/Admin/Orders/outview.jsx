import React, { useState, useEffect } from 'react';
import { Button, Card, CardBody, CardHeader, Col, Container, ListGroup, ListGroupItem, Modal, ModalBody, ModalFooter, Row, ModalHeader } from 'reactstrap';
import Breadcrumbs from "../../../components/Admin/Breadcrumb";
import { Link } from 'react-router-dom';
import axios from 'axios';
import List from 'list.js';
import { BASE_URL } from '../../helpers/config';
import Papa from 'papaparse';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

const Outview = () => {
    const [images, setImages] = useState([]);
    const [orders, setOrders] = useState([]);
    const [modal_list, setModalList] = useState(false);
    const [modal_delete, setModalDelete] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const [modal_list1, setModalList1] = useState(false);
    const [orderId, setOrderId] = useState('');



    const fetchOrders = async () => {
        try {
            const response = await axios.get(`${BASE_URL}/products/orders/pending/`);
            const data = response.data;
            setOrders(data || []);
            console.log("response orderssssssss", response.data)
        } catch (error) {
            console.error("Error fetching orders:", error);
        }
    };
    useEffect(() => {
        fetchOrders();

    }, []);


    const handleGenerateOrderId = async () => {

        try {
            await axios.patch(`${BASE_URL}/products/ordersid/${selectedItem.id}/`, {
                ordercode: orderId,
            });
            setModalList1(false);
            setOrderId('');
            fetchOrders()

        } catch (error) {
            console.error("Error saving Order ID:", error);
            alert("There was an error saving the Order ID. Please try again.");
        }
    };



    const tog_list = (order) => {
        console.log("Selected Order:", order);
        setSelectedItem(order);
        setModalList(!modal_list);
    };

    const tog_list1 = (order) => {
        console.log("Selected Item for Order ID:", order);
        setSelectedItem(order);
        setOrderId(order.ordercode || '');
        setModalList1(!modal_list1);
    };


    const tog_delete = () => {
        setModalDelete(!modal_delete);
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
            ProductSize: selectedItem.item?.product?.product_size,
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


        const rows = [
            ["Order ID", selectedItem.order?.ordercode || "N/A"],
            ["Shop Name", selectedItem.order?.user?.company_name || "N/A"],
            ["SKU", selectedItem.item?.product?.SKU || "N/A"],
            ["Product Name", selectedItem.item?.product?.product_name || "N/A"],
            ["Product Category", selectedItem.item?.product?.category_name || "N/A"],
            ["Quantity", selectedItem.item?.quantity || "N/A"],
            ["Product Color", selectedItem.item?.product?.color || "N/A"],
            ["Product Size", selectedItem.item?.product?.product_size || "N/A"],
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
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredOrders, setFilteredOrders] = useState([]);
    useEffect(() => {
        console.log("Search Query:", searchQuery);
        if (searchQuery) {
            const lowercasedQuery = searchQuery.toLowerCase();
            const results = orders.filter(order =>
                (order.ordercode && order.ordercode.toLowerCase().includes(lowercasedQuery)) ||
                order.user?.company_name.toLowerCase().includes(lowercasedQuery) ||
                (order.order_items && order.order_items.some(item =>
                    item.product?.product_name.toLowerCase().includes(lowercasedQuery)
                ))
            );
            setFilteredOrders(results);
        } else {
            setFilteredOrders(orders);
        }
        console.log("Filtered Orders after search:", filteredOrders);
    }, [searchQuery, orders]);

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
    const handleStatusChange = async (orderid, newStatus) => {
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
                                                <table className="table align-middle table-nowrap" id="customerTable">
                                                    <thead className="table-light">
                                                        <tr>
                                                            <th className="sort" data-sort="sku">OrderId</th>
                                                            <th className="sort" data-sort="sku">Shop Name</th>


                                                            <th className="sort" data-sort="action">Status</th>
                                                            <th className="sort" data-sort="action">Action</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody className="list form-check-all">
                                                        {filteredOrders.length > 0 ? (
                                                            filteredOrders.map((order) => (
                                                                <tr key={order.id}>
                                                                    <td className="OrderId">{order.ordercode}</td>
                                                                    <td className="OrderId">{order.user?.company_name}</td>
                                                                    <td>
                                                                        {order.status && (
                                                                            <select
                                                                                value={order.status || "pending"}
                                                                                onChange={(e) => handleStatusChange(order.id, e.target.value)}
                                                                            >
                                                                                <option value="pending">Pending</option>
                                                                                <option value="delivered">Delivered</option>
                                                                            </select>
                                                                        )}
                                                                    </td>
                                                                    <td>
                                                                        <div className="d-flex gap-2">
                                                                            <div className="edit">
                                                                                <button
                                                                                    className="btn btn-sm btn-success edit-item-btn"
                                                                                    onClick={() => tog_list1(order)}
                                                                                >
                                                                                    Generate OrderId
                                                                                </button>
                                                                            </div>
                                                                            <div className="edit">
                                                                                <Link
                                                                                    to={`/view-order/${order.id}`}
                                                                                    className="btn btn-sm btn-success edit-item-btn"
                                                                                >
                                                                                    View Order
                                                                                </Link>
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
                </ModalBody>
                <ModalFooter>
                    <Button color="primary" onClick={handleGenerateOrderId}>Save</Button>
                    <Button color="secondary" onClick={tog_list1}>Cancel</Button>
                </ModalFooter>
            </Modal>



        </React.Fragment>
    );
};

export default Outview;
