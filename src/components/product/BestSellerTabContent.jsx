import React, { useContext, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { FarzaaContext } from '../../context/FarzaaContext';
import { BASE_URL } from '../helpers/config';

const BestSellerTabContent = () => {
    const { addToJeweleryWishlist, addToJeweleryCart } = useContext(FarzaaContext);

    const [quantities, setQuantities] = useState({});
    const [products, setProducts] = useState([]);

    const fetchProducts = async () => {
        try {
            const response = await axios.get(`${BASE_URL}/products/products_list/`);
            const fetchedProducts = response.data;
            setProducts(fetchedProducts);

            // Set initial quantities based on fetched products
            const initialQuantities = {};
            fetchedProducts.forEach((product) => {
                initialQuantities[product.id] = 1; // Default quantity of 1
            });
            setQuantities(initialQuantities);
        } catch (error) {
            console.error('Error fetching products:', error);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const handleQuantityChange = (productId, newQuantity) => {
        setQuantities((prevQuantities) => ({
            ...prevQuantities,
            [productId]: Math.max(1, newQuantity), // Ensure quantity doesn't go below 1
        }));
    };

    return (
        <div className="row gy-4 gx-3 justify-content-center">
            {products.slice(0, 12).map((product) => (
                <div className="col-xl-3 col-md-4 col-6 col-xxs-6 m-p-1" key={product.id}>
                    <div className="fz-2-single-product">
                        <div className="fz-2-single-product-img">
                            <Link to={`/products/${product.SKU}`}>
                                <img src={BASE_URL + product.product_image} alt={product.product_name} />
                            </Link>
                            <div className="color_text">
                                <h5 className="fz-2-single-product-title">
                                    <Link to={`/products/${product.id}`}>{product.SKU}</Link>
                                </h5>
                            </div>
                            <div className="fz-2-single-product-actions">
                                <button
                                    className="fz-add-to-cart-btn"
                                    onClick={() => addToJeweleryCart(product.id, quantities[product.id])}
                                >
                                    Add to Cart
                                </button>
                                <div className="btnactions">
                                    <div className="fz-product-details__quantity cart-product__quantity">
                                        <button
                                            className="minus-btn cart-product__minus"
                                            onClick={() => handleQuantityChange(product.id, quantities[product.id] - 1)}
                                        >
                                            <i className="fa-light fa-minus"></i>
                                        </button>
                                        <input
                                            type="number"
                                            name="product-quantity"
                                            className="cart-product-quantity-input"
                                            value={quantities[product.id]}
                                            onChange={(e) =>
                                                handleQuantityChange(
                                                    product.id,
                                                    Math.max(1, parseInt(e.target.value))
                                                )
                                            }
                                            min="1"
                                        />
                                        <button
                                            className="plus-btn cart-product__plus"
                                            onClick={() => handleQuantityChange(product.id, quantities[product.id] + 1)}
                                        >
                                            <i className="fa-light fa-plus"></i>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="fz-2-single-product-txt">
                            <div>
                                <span className="fz-2-single-product-category">{product.category_name}</span>
                                <span className="color_span">&nbsp;&nbsp;( {product.color} )</span>
                            </div>
                            <h5 className="fz-2-single-product-title mb-555">
                                <Link to={`/products/${product.id}`}>{product.product_name}</Link>
                            </h5>
                            <div className="inf_gm">
                                <ul>
                                    <li>GW:<span>{product.gross_weight}</span></li>
                                    <li>D:<span>{product.diamond_weight}</span></li>
                                </ul>
                            </div>
                            <div className="inf_gm">
                                <ul>
                                    <li>CS:<span>{product.colour_stones}</span></li>
                                    <li>NW:<span>{product.net_weight}</span></li>
                                </ul>
                            </div>
                            
                            <div className="mob-cart">
                               
                                <div className="mob-cart-number">
                                    <div className="fz-product-details__quantity cart-product__quantity">
                                        <button
                                            className="minus-btn cart-product__minus"
                                            onClick={() => handleQuantityChange(product.id, quantities[product.id] - 1)}
                                        >
                                            <i className="fa-light fa-minus"></i>
                                        </button>
                                        <input
                                            type="number"
                                            name="product-quantity"
                                            className="cart-product-quantity-input"
                                            value={quantities[product.id]}
                                            onChange={(e) =>
                                                handleQuantityChange(
                                                    product.id,
                                                    Math.max(1, parseInt(e.target.value))
                                                )
                                            }
                                            min="1"
                                        />
                                        <button
                                            className="plus-btn cart-product__plus"
                                            onClick={() => handleQuantityChange(product.id, quantities[product.id] + 1)}
                                        >
                                            <i className="fa-light fa-plus"></i>
                                        </button>
                                    </div>
                                </div>

                                <div className="m-cart">
                                    <button
                                        className="fz-add-to-cart-btn"
                                        onClick={() => addToJeweleryCart(product.id, quantities[product.id])}
                                    >
                                        Add to Cart
                                    </button>
                                </div>

                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default BestSellerTabContent;
