import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { BASE_URL } from '../helpers/config';
import './Order.css';
import { useNavigate } from 'react-router-dom';

function Order() {
    const [orders, setOrders] = useState([]);
    const [Normalorders, setNormalOrders] = useState([]);
    const [fullorders, setfullOrders] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const token = localStorage.getItem('authToken');
    const navigate = useNavigate();

    useEffect(() => {
        const authToken = localStorage.getItem('authToken');
        if (!authToken) {
            navigate('/');
        }
    }, [navigate]);

    // Fetch user orders
    const fetchUserOrders = async () => {
        try {
            const response = await axios.get(`${BASE_URL}/products/user-fullcus-orders/`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setOrders(response.data);
            console.log("custom orders...........", response.data)
        } catch (error) {
            console.error("Error fetching orders:", error);
            setError("Failed to load orders");
            toast.error("Failed to load orders");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchUserOrders();
    }, []);

    const fetchcusOrders = async () => {
        try {
            const response = await axios.get(`${BASE_URL}/products/user-cus-orders/`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            const data = response.data;
            setfullOrders(data || []);
            console.log("response.data..............", response.data);
        } catch (error) {
            console.error("Error fetching orders:", error);
        }
    };

    useEffect(() => {
        fetchcusOrders();
    }, []);

    const fetchnormalOrders = async () => {
        try {
            const response = await axios.get(`${BASE_URL}/products/my-orders/`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setNormalOrders(response.data);
            console.log("normal pending orders", response.data)
        } catch (error) {
            console.error("Error fetching orders:", error);
            toast.error("Failed to load orders");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchnormalOrders();
    }, []);

    const getProductionSteps = (currentStatus) => {
        const statuses = [
            'cad',
            'cam',
            'wax',
            'casting',
            'grilling',
            'filling',
            'pre polish',
            'setting',
            'final polish',
            'rhoium',
            'final qc',
            'certification',
            'invoice',
        ];

        const currentIndex = statuses.indexOf(currentStatus);

        return statuses.map((step) => {
            const stepIndex = statuses.indexOf(step);
            const isActive = currentIndex !== -1 && stepIndex <= currentIndex;
            return {
                name: step,
                isActive,
            };
        });
    };

    // Function to convert array of objects to CSV
    const convertToCSV = (data) => {
        if (!data || data.length === 0) return '';

        const headers = Object.keys(data[0]);
        const csvContent = [
            headers.join(','),
            ...data.map(row =>
                headers.map(header => {
                    const value = row[header];
                    // Handle null/undefined values and escape commas/quotes
                    if (value === null || value === undefined) return '';
                    const stringValue = String(value);
                    // Escape quotes and wrap in quotes if contains comma, quote, or newline
                    if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
                        return `"${stringValue.replace(/"/g, '""')}"`;
                    }
                    return stringValue;
                }).join(',')
            )
        ].join('\n');

        return csvContent;
    };

    // Function to download CSV
    const downloadCSV = (csvContent, filename) => {
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');

        if (link.download !== undefined) {
            const url = URL.createObjectURL(blob);
            link.setAttribute('href', url);
            link.setAttribute('download', filename);
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    };

    // Function to prepare and download all orders CSV
    // Fixed downloadAllOrdersCSV function - just replace the Custom Orders section

const downloadAllOrdersCSV = () => {
    try {
        const allOrdersData = [];

        // Process Custom Orders (orders) - Full Custom Orders
        orders.forEach(order => {
            const orderData = {
                order_type: 'Full Custom Order',
                order_code: order.ordercode || '',
                 
                size: order.size || '',
                gram: order.gram || '',
                cent: order.cent || '',
                color: order.color?.color || '',
                quantity: order.quantity || '',
                due_date: order.due_date ? new Date(order.due_date).toLocaleString() : '',
                status: order.new_status || '',
                category_name: order.category?.category_name || '', // Fixed: consistent field name
                sku: order.SKU || '',
                gross_weight: order.gross_weight || '',
                diamond_weight: order.diamond_weight || '',
                net_weight: order.net_weight || '',
                colour_stones: order.colour_stones || '',
                order_date: order.created_at ? new Date(order.created_at).toLocaleString() : '',
            };
            allOrdersData.push(orderData);
        });

        // Process Full Orders (fullorders) - Custom Orders with product reference
        fullorders.forEach(order => {
            const orderData = {
                order_type: 'Custom Order',
                order_code: order.ordercode || '',
                 
                size: order.size || '',
                gram: order.gram || '',
                cent: order.cent || '',
                color: order.color?.color || '',
                quantity: order.quantity || '',
                due_date: order.due_date ? new Date(order.due_date).toLocaleString() : '',
                status: order.new_status || '',
                category_name: order.product?.category?.category_name || '', // Fixed: correct nested access
                sku: order.product?.SKU || '',
                gross_weight: order.product?.gross_weight || '',
                diamond_weight: order.product?.diamond_weight || '',
                net_weight: order.product?.net_weight || '',
                colour_stones: order.product?.colour_stones || '',
                order_date: order.created_at ? new Date(order.created_at).toLocaleString() : '',
            };
            allOrdersData.push(orderData);
        });

        // Process Normal Orders (Normalorders) - Fixed category access
        Normalorders.forEach(order => {
            if (order.order_items && order.order_items.length > 0) {
                order.order_items.forEach(item => {
                    const orderData = {
                        order_type: 'Normal Order',
                        order_code: order.ordercode || '',
                         
                        size: item.product?.product_size || '', // Added product size for normal orders
                        gram: '',
                        cent: '',
                        color: item.color ? item.color.charAt(0).toUpperCase() + item.color.slice(1) : '',
                        quantity: item.quantity || '',
                        due_date: order.due_date ? new Date(order.due_date).toLocaleString() : '',
                        status: order.status || order.new_status || '',
                        category_name: item.product?.category?.category_name || '', // Fixed: correct nested access
                        sku: item.product?.SKU || '',
                        gross_weight: item.product?.gross_weight || '',
                        diamond_weight: item.product?.diamond_weight || '',
                        net_weight: item.product?.net_weight || '',
                        colour_stones: item.product?.colour_stones || '',
                        order_date: order.created_at ? new Date(order.created_at).toLocaleString() : '',
                    };
                    allOrdersData.push(orderData);
                });
            }
        });

        if (allOrdersData.length === 0) {
            toast.info('No orders found to export');
            return;
        }

        const csvContent = convertToCSV(allOrdersData);
        const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
        downloadCSV(csvContent, `all_orders_${timestamp}.csv`);
        toast.success(`Successfully exported ${allOrdersData.length} order records`);

    } catch (error) {
        console.error('Error generating CSV:', error);
        toast.error('Failed to generate CSV export');
    }
};


    return (
        <div className="order-container">
            <div className="orders-section">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                    <h2 className='my-order-head'>My Orders</h2>
                    <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                        <button
                            onClick={downloadAllOrdersCSV}
                            style={{
                                backgroundColor: '#145759',
                                color: 'white',
                                border: 'none',
                                padding: '8px 16px',
                                borderRadius: '4px',
                                cursor: 'pointer',
                                fontSize: '14px'
                            }}
                            disabled={isLoading}
                        >
                            📥 Download All Orders CSV
                        </button>

                    </div>
                </div>

                {/* Custom Orders Section */}
                {orders.length > 0 ? (
                    <div className="orders-section-div ">
                        <div className=''>
                            {orders.map(order => (
                                <div className='row mb-order-30' key={order.id}>
                                    <ul className="orders-list">
                                        <li className='order-img-200'>
                                            {order.additional_images && order.additional_images.length > 0 ? (
                                                <img
                                                    src={BASE_URL + order.additional_images[0].image}
                                                    alt="Product"
                                                    className="order-img-200 img"
                                                    onError={(e) => {
                                                        console.error("Failed to load image:", e.target.src);
                                                        e.target.src = 'path/to/fallback/image.jpg';
                                                    }}
                                                />
                                            ) : (
                                                <p>No image available</p>
                                            )}
                                        </li>
                                        <li className="order-item">
                                            <div className="order-items-list">
                                                <div className='order-item-details'>
                                                    <div className='order-description'>
                                                        <p>OrderId: {order.ordercode}</p>
                                                        <p>Size: {order.size}</p>
                                                        <p>Gram: {order.gram} gm</p>
                                                        <p>Cent: {order.cent} gm</p>
                                                        <p>Color: {order.color.color}</p>
                                                        <p>Quantity: {order.quantity}</p>
                                                        <p>Due Date: {order.due_date ? new Date(order.due_date).toLocaleString() : 'N/A'}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </li>
                                        <li>
                                            <div className='order-status mob-mt-20'>
                                                <h5>Order Status</h5>
                                                <div className="Scriptcontent">
                                                    <div className={`step ${order.new_status === 'processed' ? 'step-active' : ''}`}>
                                                        <div>
                                                            {order.new_status === 'processed' || order.new_status === 'production' || order.new_status === 'cad' || order.new_status === 'cam' || order.new_status === 'wax' || order.new_status === 'casting' || order.new_status === 'grilling' || order.new_status === 'filling' || order.new_status === 'pre polish' || order.new_status === 'setting' || order.new_status === 'final polish' || order.new_status === 'rhoium' || order.new_status === 'final qc' || order.new_status === 'certification' || order.new_status === 'invoice' || order.new_status === 'out for delivery' || order.new_status === 'delivered' ? (
                                                                <div className="circle active"><i className="fa fa-check"></i></div>
                                                            ) : (
                                                                <div className="circle">1</div>
                                                            )}
                                                        </div>
                                                        <div>
                                                            <div className="title">Processed</div>
                                                        </div>
                                                    </div>

                                                    <div className={`step ${order.new_status === 'production' || order.new_status === 'cad' || order.new_status === 'cam' || order.new_status === 'wax' || order.new_status === 'casting' || order.new_status === 'grilling' || order.new_status === 'filling' || order.new_status === 'pre polish' || order.new_status === 'setting' || order.new_status === 'final polish' || order.new_status === 'rhoium' || order.new_status === 'final qc' || order.new_status === 'certification' || order.new_status === 'invoice' ? 'step-active' : ''}`}>
                                                        <div>
                                                            {order.new_status === 'production' || order.new_status === 'out for delivery' || order.new_status === 'delivered' || order.new_status === 'cad' || order.new_status === 'cam' || order.new_status === 'wax' || order.new_status === 'casting' || order.new_status === 'grilling' || order.new_status === 'filling' || order.new_status === 'pre polish' || order.new_status === 'setting' || order.new_status === 'final polish' || order.new_status === 'rhoium' || order.new_status === 'final qc' || order.new_status === 'certification' || order.new_status === 'invoice' ? (
                                                                <div className="circle-flow active"><i className="fa fa-check"></i></div>
                                                            ) : (
                                                                <div className="circle-flow">2</div>
                                                            )}
                                                        </div>
                                                        <div>
                                                            <div className="title">Production</div>
                                                            {getProductionSteps(order.new_status).map((step, index) => (
                                                                <div key={index} className={step.isActive ? 'caption pro-step-active' : 'caption'}>
                                                                    {step.name.charAt(0).toUpperCase() + step.name.slice(1)}
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>

                                                    <div className={`step ${order.new_status === 'out for delivery' ? 'step-active' : ''}`}>
                                                        <div>
                                                            {order.new_status === 'out for delivery' || order.new_status === 'delivered' ? (
                                                                <div className="circle active"><i className="fa fa-check"></i></div>
                                                            ) : (
                                                                <div className="circle">3</div>
                                                            )}
                                                        </div>
                                                        <div>
                                                            <div className="title">Out for Delivery</div>
                                                        </div>
                                                    </div>

                                                    <div className={`step ${order.new_status === 'delivered' ? 'step-active' : ''}`}>
                                                        <div>
                                                            {order.new_status === 'delivered' ? (
                                                                <div className="circle active"><i className="fa fa-check"></i></div>
                                                            ) : (
                                                                <div className="circle">4</div>
                                                            )}
                                                        </div>
                                                        <div>
                                                            <div className="title">Delivered</div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </li>
                                    </ul>
                                </div>
                            ))}
                        </div>
                    </div>
                ) : null}





                {fullorders.length > 0 && (
                    <div className="orders-section-div ">
                        <div>
                            {fullorders.map(order => (
                                <div className='row mb-order-30'>
                                    <div className="orders-list" key={order.id}>

                                        <div className="order-img order-img-200">
                                            <img src={BASE_URL + order.product.product_image} alt="" />
                                        </div>

                                        <div className="order-item">
                                            <div className="order-items-list">

                                                <div className="order-description">
                                                    <h5>{order.product.category_name}</h5>
                                                    <p>orderCode: {order.ordercode}</p>
                                                    <p>SKU: {order.product.SKU}</p>
                                                    <p>Color: {order.product.color}</p>
                                                    <p>Size: {order.size}</p>
                                                    <p>Gram: {order.gram} gm</p>
                                                    <p>Cent: {order.cent} gm</p>
                                                    <p>Quantity: {order.quantity}</p>
                                                    <p>Due Date: {order.due_date ? new Date(order.due_date).toLocaleString() : 'N/A'}</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div>
                                            <div className='order-status mob-mt-20'>
                                                <h5>Order Status</h5>
                                                <div className="Scriptcontent">
                                                    {/* Step 1: Approved */}
                                                    <div className={`step ${order.new_status === 'processed' ? 'step-active' : ''}`}>
                                                        <div>
                                                            {order.new_status === 'processed' || order.new_status === 'production' || order.new_status === 'cad' || order.new_status === 'cam' || order.new_status === 'wax' || order.new_status === 'casting' || order.new_status === 'grilling' || order.new_status === 'filling' || order.new_status === 'pre polish' || order.new_status === 'setting' || order.new_status === 'final polish' || order.new_status === 'rhoium' || order.new_status === 'final qc' || order.new_status === 'certification' || order.new_status === 'invoice' || order.new_status === 'out for delivery' || order.new_status === 'delivered' ? (
                                                                <div className="circle active"><i className="fa fa-check"></i></div>
                                                            ) : (
                                                                <div className="circle">1</div>
                                                            )}
                                                        </div>
                                                        <div>
                                                            <div className="title">Processed</div>
                                                            {/* <div className="caption">Some text about the Processing step.</div> */}
                                                        </div>
                                                    </div>

                                                    {/* Step 2: Production */}
                                                    <div className={`step ${order.new_status === 'production' || order.new_status === 'cad' || order.new_status === 'cam' || order.new_status === 'wax' || order.new_status === 'casting' || order.new_status === 'grilling' || order.new_status === 'filling' || order.new_status === 'pre polish' || order.new_status === 'setting' || order.new_status === 'final polish' || order.new_status === 'rhoium' || order.new_status === 'final qc' || order.new_status === 'certification' || order.new_status === 'invoice' ? 'step-active' : ''}`}>
                                                        <div>
                                                            {order.new_status === 'production' || order.new_status === 'out for delivery' || order.new_status === 'delivered' || order.new_status === 'cad' || order.new_status === 'cam' || order.new_status === 'wax' || order.new_status === 'casting' || order.new_status === 'grilling' || order.new_status === 'filling' || order.new_status === 'pre polish' || order.new_status === 'setting' || order.new_status === 'final polish' || order.new_status === 'rhoium' || order.new_status === 'final qc' || order.new_status === 'certification' || order.new_status === 'invoice' ? (
                                                                <div className="circle-flow active"><i className="fa fa-check"></i></div>
                                                            ) : (
                                                                <div className="circle-flow">2</div>
                                                            )}
                                                        </div>
                                                        <div>
                                                            <div className="title">Production</div>
                                                            {getProductionSteps(order.new_status).map((step, index) => (
                                                                <div key={index} className={step.isActive ? 'caption pro-step-active' : 'caption'}>
                                                                    {step.name.charAt(0).toUpperCase() + step.name.slice(1)}
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>

                                                    {/* Step 3: Out for Delivery */}
                                                    <div className={`step ${order.new_status === 'out for delivery' ? 'step-active' : ''}`}>
                                                        <div>
                                                            {order.new_status === 'out for delivery' || order.new_status === 'delivered' ? (
                                                                <div className="circle active"><i className="fa fa-check"></i></div>
                                                            ) : (
                                                                <div className="circle">3</div>
                                                            )}
                                                        </div>
                                                        <div>
                                                            <div className="title">Out for Delivery</div>
                                                            {/* <div className="caption">Some text about Third step.</div> */}
                                                        </div>
                                                    </div>

                                                    {/* Step 4: Delivered */}
                                                    <div className={`step ${order.new_status === 'delivered' ? 'step-active' : ''}`}>
                                                        <div>
                                                            {order.new_status === 'delivered' ? (
                                                                <div className="circle active"><i className="fa fa-check"></i></div>
                                                            ) : (
                                                                <div className="circle">4</div>
                                                            )}
                                                        </div>
                                                        <div>
                                                            <div className="title">Delivered</div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}







                {Normalorders.length > 0 && (
                    <div className="orders-section-div  ">
                        <div>
                            {Normalorders.map(order => (
                                <div className='row mb-order-30'>



                                    <ul className="orders-list-normal" key={order.id}>
                                        <div className="order-item width100">
                                            <div className="order-items-list">
                                                {order.order_items.map(item => (
                                                    <div key={item?.id} className="order-item-details normal-order-item">
                                                        <div className="order-img order-img-order">
                                                            <img src={item?.product?.product_image} alt="" />
                                                        </div>

                                                        <div className="order-description">
                                                            <h5>{item?.product.category_name}</h5>
                                                            <p>SKU: {item?.product.SKU}</p>
                                                            <p>Color: {item?.color
                                                                        ? item.color.charAt(0).toUpperCase() + item.color.slice(1)
                                                                        : "N/A"}
                                                                    </p>


                                                            <p>Gross Weight: {item?.product.gross_weight} gm</p>
                                                            <p>Diamond Weight: {item?.product.diamond_weight} Ct</p>
                                                            <p>Net Weight: {item?.product.net_weight} gm</p>
                                                            <p>Color Stone: {item?.product.colour_stones} Ct</p>
                                                            <p>Product Size: {item?.product.product_size}</p>
                                                            <p>Quantity: {item?.quantity}</p>

                                                        </div>

                                                    </div>
                                                ))}
                                            </div>
                                        </div>



                                    </ul>
                                </div>
                            ))}
                        </div>
                    </div>
                )}




            </div>



        </div>
    );
}

export default Order;
