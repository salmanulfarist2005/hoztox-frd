import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { BASE_URL } from '../helpers/config';
import './Order.css';

function Order() {
    const [orders, setOrders] = useState([]);
    const [Normalorders, setNormalOrders] = useState([]);
    const [fullorders, setfullOrders] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const token = localStorage.getItem('authToken');

    // Fetch user orders
    const fetchUserOrders = async () => {
        try {
            const response = await axios.get(`${BASE_URL}/products/full-customized-approved/`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setOrders(response.data);
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
            const response = await axios.get(`${BASE_URL}/products/customized-approved/`);
            const data = response.data;
            setfullOrders(data || []);
            console.log("response", response);
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
            console.log("response.dataSSSSSSSSSSSSSSSSSS", response.data);
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

    return (
        <div className="profile-container">

            <div className="orders-section">
                <h2>My Orders</h2>
                
                <div className="orders-section-div">
                   
                    {orders.length > 0 ? (
                        <div className=''>
                            {orders.map(order => (
                                <ul className="orders-list" key={order.id}>
                                    <li className="order-item">
                                        <div className="order-items-list">
                                            <div className='order-item-details'>
                                                <div className='order-description'>
                                                    <h5>Design Number: {order.design_number}</h5>
                                                    <p>OrderId: {order.ordercode}</p>
                                                    <p>Size: {order.size}</p>
                                                    <p>Gram: {order.gram} gm</p>
                                                    <p>Cent: {order.cent} gm</p>
                                                    <p>Color: {order.color.color}</p>
                                                    <p>Quantity: {order.quantity}</p>
                                                    <p>Due Date: {order.due_date ? new Date(order.due_date).toLocaleString() : 'N/A'}</p>
                                                    {order.additional_images && order.additional_images.length > 0 ? (
                                                        <img
                                                            src={BASE_URL + order.additional_images[0].image}
                                                            alt="Product"
                                                            className="order-product-image"
                                                            onError={(e) => {
                                                                console.error("Failed to load image:", e.target.src);
                                                                e.target.src = 'path/to/fallback/image.jpg';
                                                            }}
                                                        />
                                                    ) : (
                                                        <p>No image available</p>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                        <div className='order-status'>
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
                                                        <div className="caption">Some text about the Processing step.</div>
                                                    </div>
                                                </div>
                                                {/* Step 2: Production */}
                                                <div className={`step ${order.new_status === 'production' || order.new_status === 'cad' || order.new_status === 'cam' || order.new_status === 'wax' || order.new_status === 'casting' || order.new_status === 'grilling' || order.new_status === 'filling' || order.new_status === 'pre polish' || order.new_status === 'setting' || order.new_status === 'final polish' || order.new_status === 'rhoium' || order.new_status === 'final qc' || order.new_status === 'certification' || order.new_status === 'invoice' ? 'step-active' : ''}`}>
                                                    <div>
                                                        {order.new_status === 'production' || order.new_status === 'out for delivery' || order.new_status === 'delivered' || order.new_status === 'cad' || order.new_status === 'cam' || order.new_status === 'wax' || order.new_status === 'casting' || order.new_status === 'grilling' || order.new_status === 'filling' || order.new_status === 'pre polish' || order.new_status === 'setting' || order.new_status === 'final polish' || order.new_status === 'rhoium' || order.new_status === 'final qc' || order.new_status === 'certification' || order.new_status === 'invoice' ? (
                                                            <div className="circle active"><i className="fa fa-check"></i></div>
                                                        ) : (
                                                            <div className="circle">2</div>
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
                                                {/* Step 3: Delivered */}
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
                                                        <div className="caption">Some text about Third step.</div>
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
                                    </li>
                                </ul>
                            ))}
                        </div>
                    ) : null}
                </div>


                <div className="profile-container">
                    <div className="orders-section-div">
                       
                        {fullorders.length > 0 && (
                            <div>
                                {fullorders.map(order => (
                                    <ul className="orders-list" key={order.id}>
                                        <li className="order-item">
                                            <div className="order-items-list">
                                                <div className="order-img">
                                                    <img src={BASE_URL + order.product.product_image} alt="" />
                                                </div>
                                                <div className="order-description">
                                                <h5>{item.product.category.category_name}</h5>
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
                                        </li>
                                        <div className='order-status'>
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
                                                        <div className="caption">Some text about the Processing step.</div>
                                                    </div>
                                                </div>

                                                {/* Step 2: Production */}
                                                <div className={`step ${order.new_status === 'production' || order.new_status === 'cad' || order.new_status === 'cam' || order.new_status === 'wax' || order.new_status === 'casting' || order.new_status === 'grilling' || order.new_status === 'filling' || order.new_status === 'pre polish' || order.new_status === 'setting' || order.new_status === 'final polish' || order.new_status === 'rhoium' || order.new_status === 'final qc' || order.new_status === 'certification' || order.new_status === 'invoice' ? 'step-active' : ''}`}>
                                                    <div>
                                                        {order.new_status === 'production' || order.new_status === 'out for delivery' || order.new_status === 'delivered' || order.new_status === 'cad' || order.new_status === 'cam' || order.new_status === 'wax' || order.new_status === 'casting' || order.new_status === 'grilling' || order.new_status === 'filling' || order.new_status === 'pre polish' || order.new_status === 'setting' || order.new_status === 'final polish' || order.new_status === 'rhoium' || order.new_status === 'final qc' || order.new_status === 'certification' || order.new_status === 'invoice' ? (
                                                            <div className="circle active"><i className="fa fa-check"></i></div>
                                                        ) : (
                                                            <div className="circle">2</div>
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
                                                        <div className="caption">Some text about Third step.</div>
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
                                    </ul>
                                ))}
                            </div>
                        )}
                    </div>
                </div>


                <div className="profile-container">
                    <div className="orders-section-div">
                       
                        {Normalorders.length > 0 && (
                            <div>
                                {Normalorders.map(order => (
                                    <ul className="orders-list" key={order.id}>
                                        <li className="order-item">
                                            <h6>Order ID: {order.id}</h6>
                                            <p>Order Date: {new Date(order.created_at).toLocaleString()}</p>
                                            <div className="order-items-list">
                                                {order.order_items.map(item => (
                                                    <div key={item.id} className="order-item-details">
                                                        <div className="order-img">
                                                            <img src={BASE_URL + item.product.product_image} alt="" />
                                                        </div>
                                                        <div className="order-description">
                                                            <h5>{item.product.category.category_name}</h5>
                                                            <p>SKU: {item.product.SKU}</p>
                                                            <p>Color: {item.product.color}</p>
                                                            <p>Gross Weight: {item.total_gross_weight} gm</p>
                                                            <p>Diamond Weight: {item.diamond_weight} gm</p>
                                                            <p>Net Weight: {item.net_weight} gm</p>
                                                            <p>Color Stone: {item.color_stones} gm</p>
                                                            <p>Product Size: {item.product.product_size}</p>
                                                            <p>Quantity: {item.quantity}</p>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </li>
                                    </ul>
                                ))}
                            </div>
                        )}
                    </div>
                </div>


            </div>



        </div>
    );
}

export default Order;
