import React, { useContext, useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FarzaaContext } from '../../context/FarzaaContext';
import { BASE_URL } from '../helpers/config';

const BestSellerTabContent = () => {
    const { addToJeweleryWishlist, addToJeweleryCart } = useContext(FarzaaContext);

    const [quantities, setQuantities] = useState({});
    const [products, setProducts] = useState([]);
    const [selectedColors, setSelectedColors] = useState({});

    const navigate = useNavigate();
    useEffect(() => {
        const authToken = localStorage.getItem('authToken');
        if (!authToken) {
            navigate('/');
        }
    }, [navigate]);
    const fetchProducts = async () => {
        try {
            const token = localStorage.getItem('authToken');
            const response = await axios.get(`${BASE_URL}/products/products_user_list/`, {
                headers: { Authorization: `Bearer ${token}` },
            });

        
            console.log('Fetched Products Response:', response);

      
            const fetchedProducts = response.data;
            setProducts(fetchedProducts);

 
            const initialQuantities = {};
            fetchedProducts.forEach((product) => {
                initialQuantities[product.id] = 1;
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
            [productId]: Math.max(1, newQuantity),
        }));
    };

    const handleColorSelection = (productId, color) => {
        setSelectedColors((prevSelectedColors) => ({
            ...prevSelectedColors,
            [productId]: color,
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
                                    onClick={() => {
                                        const selectedColor = selectedColors[product.id];
                                        if (selectedColor) {
                                            addToJeweleryCart(product.id, quantities[product.id], selectedColor);
                                        } else {
                                            alert('Please select a color!');
                                        }
                                    }}
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
                                <span className="fz-2-single-product-title">{product.category_name}</span>

                            </div>

                            <div className="inf_gm">
                                <ul>
                                    <li>GW:<span>{product.gross_weight}</span></li>
                                    <li>DMD:<span>{product.diamond_weight} CT</span></li>
                                </ul>
                            </div>
                            <div className="inf_gm">
                                <ul>
                                    <li>CS:<span>{product.colour_stones}</span></li>
                                    <li>NW:<span>{product.net_weight}</span></li>
                                </ul>
                            </div>
                            <div className="color-selection">
                                <ul className="color-options">
                                    <li className={`color-option ${selectedColors[product.id] === 'rose' ? 'selected' : ''}`}>
                                        <input
                                            type="radio"
                                            name={`color-${product.id}`}
                                            value="rose"
                                            onChange={() => handleColorSelection(product.id, 'rose')}
                                            checked={selectedColors[product.id] === 'rose'}
                                        />
                                        <span className="color-box" style={{ backgroundColor: 'pink' }}></span>
                                        Rose
                                    </li>
                                    <li className={`color-option ${selectedColors[product.id] === 'yellow' ? 'selected' : ''}`}>
                                        <input
                                            type="radio"
                                            name={`color-${product.id}`}
                                            value="yellow"
                                            onChange={() => handleColorSelection(product.id, 'yellow')}
                                            checked={selectedColors[product.id] === 'yellow'}
                                        />
                                        <span className="color-box" style={{ backgroundColor: 'yellow' }}></span>
                                        Yellow
                                    </li>
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
                                        onClick={() => {
                                            const selectedColor = selectedColors[product.id];
                                            if (selectedColor) {
                                                addToJeweleryCart(product.id, quantities[product.id], selectedColor);
                                            } else {
                                                alert('Please select a color!');
                                            }
                                        }}
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
