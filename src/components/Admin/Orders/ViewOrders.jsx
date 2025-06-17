
import React, { useState, useEffect } from 'react';
import { Button, Card, CardBody, CardHeader, Col, Container, Input, ListGroup, ListGroupItem, Modal, ModalBody, ModalFooter, Row, ModalHeader } from 'reactstrap';
import Breadcrumbs from "../../../components/Admin/Breadcrumb";
import { Link } from 'react-router-dom';
import axios from 'axios';
import List from 'list.js';
import { BASE_URL } from '../../helpers/config';
import Papa from 'papaparse';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { useParams } from 'react-router-dom';

const ViewOrder = () => {
    const [images, setImages] = useState([]);
    const [orders, setOrders] = useState([]);
    const [modal_list, setModalList] = useState(false);
    const [modal_delete, setModalDelete] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const [modal_list1, setModalList1] = useState(false);
    const [editedOrderCode, setEditedOrderCode] = useState('');
    const [editedQuantity, setEditedQuantity] = useState('');
    const { orderId } = useParams();

    const fetchOrders = async () => {
        if (!orderId) {
            console.error("Order ID is not provided.");
            return;
        }
        try {
            const response = await axios.get(`${BASE_URL}/products/orders/${orderId}/`);
            const data = response.data;
            setOrders(data || []);
            console.log("response orderssssssss", response.data);
        } catch (error) {
            console.error("Error fetching orders:", error);
        }
    };

    useEffect(() => {
        fetchOrders();

    }, []);





    const tog_list = (order) => {
        console.log("Selected Order:", order);
        setSelectedItem(order);
        setModalList(!modal_list);
    };

    const tog_list1 = (order) => {
        setSelectedItem(order);
        setEditedOrderCode(order.order.ordercode);
        setEditedQuantity(order.item.quantity);
        setModalList1(!modal_list1);
        setModalList(false);
    };


    const tog_delete = () => {
        setModalDelete(!modal_delete);
    };

    const downloadFullOrderCSV = () => {
        if (!orderId) {
            console.error("No orderId provided.");
            return;
        }


        console.log("Looking for order with orderId:", orderId);
        console.log("Fetched orders:", orders);


        const order = orders.find(order => String(order.id) === String(orderId));


        if (!order) {
            console.error(`Order with orderId ${orderId} not found`);
            return;
        }


        if (!order.order_items || order.order_items.length === 0) {
            console.error("No order_items available for this order");
            return;
        }

        // Prepare order data for CSV
        const orderData = orders.flatMap(order =>
            order.order_items.map(item => ({
              
                OrderCode: order.ordercode || '',
                
                Status: order.status || '',

                // Totals
                TotalGrossWeight: order.total_gross_weight || '',
                TotalNetWeight: order.total_net_weight || '',
                TotalDiamondWeight: order.total_diamond_weight || '',
                TotalColourStones: order.total_colour_stones || '',

                // User Info
                UserFullName: order.user?.full_name || '',
                CompanyName: order.user?.company_name || '',
                CompanyEmail: order.user?.company_email || '',
                CompanyWebsite: order.user?.company_website || '',
                ShippingAddress: order.user?.shipping_address || '',
                MobileNumber: order.user?.mobile_number || '',
                WhatsAppNumber: order.user?.whatsapp_number || '',
                Email: order.user?.email || '',

                // Order Item Info
               
                SKU: item.product?.SKU || '',
                ProductName: item.product?.product_name || '',
                Category: item.product?.category?.category_name || '', // Assuming `category` is an object
                Quantity: item.quantity || '',
                AdditionalNotes: item.additional_notes || '',

                // Optional Product Details (add as needed)
                ProductGrossWeight: item.product?.gross_weight || '',
                ProductNetWeight: item.product?.net_weight || '',
                ProductDiamondWeight: item.product?.diamond_weight || '',
                ProductColourStones: item.product?.colour_stones || '',
            }))
        );

        console.log("Order Data for CSV:", orderData);

        try {
            const csv = Papa.unparse(orderData);
            const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.setAttribute('download', `order_${order.ordercode}_details.csv`);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch (error) {
            console.error("Error while serializing order data to CSV:", error);
        }
    };




    const downloadCSV = () => {
        if (!selectedItem) return;

       const orderData = {
    // Order Info
   
    OrderCode: selectedItem.order?.ordercode || '',
    CreatedAt: selectedItem.order?.created_at || '',
    Status: selectedItem.order?.status || '',

    // Totals
    TotalGrossWeight: selectedItem.order?.total_gross_weight || '',
    TotalNetWeight: selectedItem.order?.total_net_weight || '',
    TotalDiamondWeight: selectedItem.order?.total_diamond_weight || '',
    TotalColourStones: selectedItem.order?.total_colour_stones || '',

    // User Info
    FullName: selectedItem.order?.user?.full_name || '',
    CompanyName: selectedItem.order?.user?.company_name || '',
    CompanyEmail: selectedItem.order?.user?.company_email || '',
    CompanyWebsite: selectedItem.order?.user?.company_website || '',
    ShippingAddress: selectedItem.order?.user?.shipping_address || '',
    MobileNumber: selectedItem.order?.user?.mobile_number || '',
    WhatsAppNumber: selectedItem.order?.user?.whatsapp_number || '',
    Email: selectedItem.order?.user?.email || '',
    ProfileImage: selectedItem.order?.user?.prof_image || '',
    CompanyLogo: selectedItem.order?.user?.company_logo || '',

    // Order Item Info
   
    Quantity: selectedItem.item?.quantity || '',
    ProductColor: selectedItem.item?.color || '',
    AdditionalNotes: selectedItem.item?.additional_notes || '',

    // Product Info
    
    SKU: selectedItem.item?.product?.SKU || '',
    ProductName: selectedItem.item?.product?.product_name || '',
    ProductCategory: selectedItem.item?.product?.category?.name || selectedItem.item?.product?.category_name || '',
    ProductGrossWeight: selectedItem.item?.product?.gross_weight || '',
    ProductNetWeight: selectedItem.item?.product?.net_weight || '',
    ProductDiamondWeight: selectedItem.item?.product?.diamond_weight || '',
    ProductColourStones: selectedItem.item?.product?.colour_stones || '',
    ProductImages: selectedItem.item?.product?.additional_images?.join(', ') || '', // optional: join array to string
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
        console.log("Orders:", orders);
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
            fetchOrders();
            setModalList1(false);
            alert("Order updated successfully!");
        } catch (error) {
            console.error("Error updating order:", error.response ? error.response.data : error.message);
            alert("Error updating order. Please try again.");
        }
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
                                                    <Button color="primary" onClick={downloadFullOrderCSV} className="me-2">
                                                        Download CSV
                                                    </Button>
                                                </Col>
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


                                                            <th className="sort" data-sort="sku">SKU</th>
                                                            <th className="sort" data-sort="product_name">Product Name</th>
                                                            <th className="sort" data-sort="product_category">Product Category</th>

                                                            <th className="sort" data-sort="quantity">Quantity</th>

                                                            <th className="sort" data-sort="action">Action</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody className="list form-check-all">
                                                        {filteredOrders.length > 0 ? (
                                                            filteredOrders.map((order) =>
                                                                order.order_items.map((item) => (
                                                                    <tr key={`${order.id}-${item.id}`}>


                                                                        <td className="sku">{item.product?.SKU}</td>
                                                                        <td className="product_name">{item.product?.product_name}</td>
                                                                        <td className="product_category">{item.product?.category?.category_name}</td>
                                                                        <td className="quantity">{item.quantity}</td>


                                                                        <td>
                                                                            <div className="d-flex gap-2">
                                                                                <button
                                                                                    onClick={() => tog_list1({ order, item })}
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
                                                                                {/* View Icon */}
                                                                                <button
                                                                                    onClick={() => tog_list({ order, item })}
                                                                                    title="View"
                                                                                    style={{
                                                                                        background: 'none',
                                                                                        border: 'none',
                                                                                        padding: '5px',
                                                                                        cursor: 'pointer',
                                                                                        display: 'inline-block'
                                                                                    }}
                                                                                >
                                                                                    <i className="ri-eye-line" style={{ fontSize: '18px', color: '#3b82f6' }}></i>
                                                                                </button>

                                                                                {/* Edit Icon */}


                                                                                {/* Delete Icon */}
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
                                                                                    <i className="ri-delete-bin-line" style={{ fontSize: '18px', color: '#ef4444' }}></i>
                                                                                </button>
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
                                        value={selectedItem.item?.product?.category?.category_name}
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
                                <label className="col-md-2 col-form-label">Address</label>
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



                {/* <ModalFooter>
                    <Button color="secondary" onClick={tog_list}>Close</Button>
                </ModalFooter> */}
            </Modal>
            <Modal isOpen={modal_list1} toggle={() => setModalList1(!modal_list1)} centered style={{ maxWidth: '900px', width: '90%' }}>
                <ModalHeader className="bg-light p-3" toggle={() => setModalList1(!modal_list1)}>
                    Edit Order
                </ModalHeader>
                <ModalBody style={{ padding: '20px' }}>
                    {selectedItem ? (
                        <>

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

        </React.Fragment>
    );
};

export default ViewOrder;
