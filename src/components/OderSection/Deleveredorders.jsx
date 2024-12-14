import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { BASE_URL } from '../helpers/config';
import './Order.css';
import { useNavigate } from 'react-router-dom';

function DeleiverOrder() {
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
            const response = await axios.get(`${BASE_URL}/products/user-complete-fullcus-orders/`, {
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
            const response = await axios.get(`${BASE_URL}/products/user-complete-cus-orders/`, {
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
            const response = await axios.get(`${BASE_URL}/products/my-complete-orders/`, {
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

    return (
        <div className="order-container">

            <div className="orders-section">
                <h2 className='my-order-head'>My Orders</h2>



                {orders.length > 0 ? (
                    <div className="orders-section-div">
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
                            {orders.map((order, index) => (
                                <div
                                    key={order.id}
                                    style={{
                                        flex: '0 1 calc(33.33% - 10px)',
                                        marginBottom: '20px',
                                        border: '1px solid #ccc',
                                        padding: '10px',
                                        boxSizing: 'border-box',
                                    }}
                                >
                                    <ul className="orders-list">
                                        <li style={{ textAlign: 'center', marginBottom: '10px' }}>
                                            {order.additional_images && order.additional_images.length > 0 ? (
                                                <img
                                                    src={BASE_URL + order.additional_images[0].image}
                                                    alt="Product"
                                                    style={{
                                                        width: '100%',
                                                        height: 'auto',
                                                        maxWidth: '200px',
                                                    }}
                                                    
                                                />
                                            ) : (
                                                <p>No image available</p>
                                            )}
                                        </li>
                                        <li>
                                            <div>
                                                <p>OrderId: {order.ordercode}</p>
                                                <p>Size: {order.size}</p>
                                                <p>Gram: {order.gram} gm</p>
                                                <p>Cent: {order.cent} gm</p>
                                                <p>Color: {order.color.color}</p>
                                                <p>Quantity: {order.quantity}</p>
                                                <p>Due Date: {order.due_date ? new Date(order.due_date).toLocaleString() : 'N/A'}</p>
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
                         <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
                            {fullorders.map(order => (
                                  <div
                                  key={order.id}
                                  style={{
                                      flex: '0 1 calc(33.33% - 10px)',
                                      marginBottom: '20px',
                                      border: '1px solid #ccc',
                                      padding: '10px',
                                      boxSizing: 'border-box',
                                  }}
                              >
                                <div className='row mb-order-30'>
                                    <div className="orders-list" key={order.id}>

                                        <div className="order-img order-img-200">
                                            <img src={BASE_URL + order.product.product_image} alt=""  style={{
                                                        width: '100%',
                                                        height: 'auto',
                                                        maxWidth: '200px',
                                                    }}/>
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
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
                            {Normalorders.map(order => (
                                 <div
                                 key={order.id}
                                 style={{
                                     flex: '0 1 calc(33.33% - 10px)',
                                     marginBottom: '20px',
                                     border: '1px solid #ccc',
                                     padding: '10px',
                                     boxSizing: 'border-box',
                                 }}
                             >
                                <div className='row mb-order-30'>



                                    <ul className="orders-list-normal" key={order.id}>
                                        <div className="order-item width100">
                                            <div className="order-items-list">
                                                {order.order_items.map(item => (
                                                    <div key={item?.id} className="order-item-details normal-order-item">
                                                        <div className="order-img order-img-order">
                                                            <img src={BASE_URL + item?.product.product_image} alt="" style={{
                                                        width: '100%',
                                                        height: 'auto',
                                                        maxWidth: '200px',
                                                    }}/>
                                                        </div>

                                                        <div className="order-description">
                                                            <h5>{item?.product.category_name}</h5>
                                                            <p>SKU: {item?.product.SKU}</p>
                                                            <p>Color: {item?.color.charAt(0).toUpperCase() + item.color.slice(1)}</p>

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
                                </div>
                            ))}
                        </div>
                    </div>
                )}




            </div>



        </div>
    );
}

export default DeleiverOrder;
