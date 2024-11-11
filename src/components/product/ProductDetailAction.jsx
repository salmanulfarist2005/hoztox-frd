import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { FarzaaContext } from '../../context/FarzaaContext';
import { BASE_URL } from '../helpers/config';

const ProductDetailAction = () => {
    const {
        addToJeweleryCart,
    } = useContext(FarzaaContext);
    const defaultQuantity = 1;
    const [quantity, setQuantity] = useState(defaultQuantity);
    const { SKU } = useParams();
    const [product, setProduct] = useState(null);

    const handleQuantityChange = (newQuantity) => {
        if (newQuantity >= 1) {
            setQuantity(newQuantity);
        }
    };

    useEffect(() => {
        const fetchProductDetails = async () => {
            try {
  
                const response = await axios.get(`${BASE_URL}/products/products/${SKU}/`, {
                    headers: {
                   
                        'Authorization': `Bearer ${localStorage.getItem('authToken')}`
                    }
                });
                setProduct(response.data);  
            } catch (error) {
                console.error('Error fetching product details:', error);
                setError('Could not fetch product details. Please try again later.');
            } finally {
                setLoading(false);   
            }
        };

        fetchProductDetails();
    }, [SKU]);

    return (
        <div className="fz-product-details__actions">
            <div className="fz-product-details__quantity cart-product__quantity">
                <button className="minus-btn cart-product__minus" onClick={() => handleQuantityChange(quantity - 1)}>
                    <i className="fa-light fa-minus"></i>
                </button>
                <input
                    type="number"
                    name="product-quantity"
                    className="cart-product-quantity-input"
                    value={quantity}
                    onChange={(e) => handleQuantityChange(Math.max(1, parseInt(e.target.value)))}
                    min="1"
                />
                <button className="plus-btn cart-product__plus" onClick={() => handleQuantityChange(quantity + 1)}>
                    <i className="fa-light fa-plus"></i>
                </button>
            </div>

            <button
                className="fz-add-to-cart-btn"
                onClick={() => addToJeweleryCart(product.id, quantity)}  
            >
                Add to cart
            </button>
        </div>
    );
}

export default ProductDetailAction;
