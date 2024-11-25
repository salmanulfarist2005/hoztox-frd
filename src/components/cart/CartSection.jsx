import React, { useContext, useEffect, useState } from 'react';
import CartItemTable from './CartItemTable';
import { FarzaaContext } from '../../context/FarzaaContext';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { BASE_URL } from '../helpers/config';

const CartSection = () => {
    const {
        cartItems,
        handleQuantityChange,
        handleRemoveItem,
    } = useContext(FarzaaContext);
    const navigate = useNavigate();
    useEffect(() => {
        const authToken = localStorage.getItem('authToken');
        if (!authToken) {
            navigate('/');
        } 
    }, [navigate]);

    const [additionalNotes, setAdditionalNotes] = useState({});
    const [cartData, setCartData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
 

  
    const fetchCartDetails = async () => {
        try {
            const token = localStorage.getItem('authToken');
            const response = await axios.get(`${BASE_URL}/products/cart/items/`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setCartData(response.data); 
        } catch (error) {
            console.error('Error fetching cart details:', error);
            setError('Failed to load cart items.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCartDetails();
    }, []);  
 
    const handleNoteChange = (sku, note) => {
        setAdditionalNotes(prevNotes => ({
            ...prevNotes,
            [sku]: note,
        }));
    };

 
    

    return (
        <div className="container">
            <div className="cart-section">
                <div className="cart-left inner-cart">
                    <div className="cart-area">
                        <div className="cart__body">
                            <div className="table-responsive">
                                <CartItemTable 
                                    cartArray={cartData} // Pass fetched cart data
                                    remove={handleRemoveItem} 
                                    quantity={handleQuantityChange} 
                                    additionalNotes={additionalNotes} 
                                    onNoteChange={handleNoteChange}  
                                />
                            </div>
 
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CartSection;
