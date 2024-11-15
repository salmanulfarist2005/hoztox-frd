import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { FarzaaContext } from '../../context/FarzaaContext';
import { Link, useNavigate } from 'react-router-dom';
import { BASE_URL } from '../helpers/config';
import './checkout.css';

const CheckoutSection = () => {
    const { finalPrice } = useContext(FarzaaContext);
    const [cartItems, setCartItems] = useState([]);
    const [totals, setTotals] = useState({});
    const [loading, setLoading] = useState(true);
    const [notes, setNotes] = useState({});
    const [showConfirmation, setShowConfirmation] = useState(false); // New state for confirmation popup
    const navigate = useNavigate();

    const fetchCartItems = async () => {
        try {
            const token = localStorage.getItem('authToken');
            const response = await axios.get(`${BASE_URL}/products/cart/items/`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setCartItems(response.data.cart_items);
            setTotals(response.data.totals);
        } catch (error) {
            console.error('Error fetching cart items:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCartItems();
    }, []);

    const handleNoteChange = (id, text) => {
        setNotes({ ...notes, [id]: text });
    };

    const handlePlaceOrder = async () => {
        const token = localStorage.getItem('authToken');
        const uniqueCartItems = [];
        const seenSKUs = new Set();
    
        cartItems.forEach(item => {
            if (!seenSKUs.has(item.product.SKU)) {
                seenSKUs.add(item.product.SKU);
                uniqueCartItems.push({
                    product: item.product.SKU,
                    quantity: item.quantity,
                    color: item.color,
                    additional_notes: notes[item.product.SKU] || '',
                });
            }
        });
    
        try {
            const response = await axios.post(`${BASE_URL}/products/orders/`, { order_items: uniqueCartItems }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
    
            console.log(response);   
    
            if (response.status === 201) {
             
                setShowConfirmation(true);
                fetchCartItems();
                setTimeout(() => {
                    setShowConfirmation(false);
                    navigate('/checkout');
                }, 3000);
            } else {
                alert("Failed to place order: Unexpected response");
            }
        } catch (error) {
            console.error("Error placing order:", error);   
            if (error.response) {
                alert("Failed to place order: " + (error.response.data.detail || "An error occurred."));
            } else {
                alert("Failed to place order: Network error or server not reachable.");
            }
        }
    };
    
    return (
        <div className="checkout-container">
            <h3 className="checkout-title">Order Items</h3>
            <div className='check-cart-div'>
                <div className="cart-list">
                    {cartItems.length === 0 ? (
                        <p>No items in cart.</p>
                    ) : (
                        cartItems.map((item) => (
                            <div className="cart-card" key={item.id}>
                                <div className="cart-product__img">
                                    <img src={item.product.product_image} alt="Product" />
                                </div>
                                <h4 className="cart-title">{item.product?.product_name}</h4>
                                <ul className="cart-summary">
                                    <li><span className="cart-key">Quantity:</span> <span className="cart-value">{item.quantity}</span></li>
                                    <li><span className="cart-key">Color:</span> <span className="cart-value">{item.color.charAt(0).toUpperCase() + item.color.slice(1)}</span></li>
                                    <li><span className="cart-key">Gross Weight:</span> <span className="cart-value">{item.gross_weight} gm</span></li>
                                    <li><span className="cart-key">Diamond Weight:</span> <span className="cart-value">{item.diamond_weight} gm</span></li>
                                    <li><span className="cart-key">Color Stones:</span> <span className="cart-value">{item.colour_stones} gm</span></li>
                                    <li><span className="cart-key">Net Weight:</span> <span className="cart-value">{item.net_weight} gm</span></li>
                                </ul>
                                <div className="notes-section">
                                    <label htmlFor={`note-${item.id}`} className="note-label">Additional Notes:</label>
                                    <textarea
                                        id={`note-${item.id}`}
                                        className="note-textarea"
                                        value={notes[item.product.SKU] || ''}
                                        onChange={(e) => handleNoteChange(item.product.SKU, e.target.value)}
                                        placeholder="Add any specific instructions or notes here"
                                    />
                                </div>
                                <Link to="/cart" className="edit-cart-button">Edit Item</Link>
                            </div>
                        ))
                    )}
                </div>

                {cartItems.length > 0 && (
                    <div className="total-weights">
                        <h4>Total Weights</h4>
                        <p>Total Gross Weight: {totals.total_gross_weight || 0} gm</p>
                        <p>Total Diamond Weight: {totals.total_diamond_weight || 0} gm</p>
                        <p>Total Color Stones: {totals.total_colour_stones || 0} gm</p>
                        <p>Total Net Weight: {totals.total_net_weight || 0} gm</p>
                        <button onClick={handlePlaceOrder} className="fz-1-banner-btn cart-checkout-btn bg-gold">
                            Place Order
                        </button>
                    </div>
                )}
            </div>

           
            {showConfirmation && (
                <div className="confirmation-popup">
                    <div className="confirmation-content">
                        <span className="checkmark">&#10003;</span>  
                        <p>Order placed successfully!</p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CheckoutSection;