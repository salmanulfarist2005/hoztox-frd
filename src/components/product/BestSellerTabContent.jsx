import React, { useContext, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { FarzaaContext } from '../../context/FarzaaContext';
import { BASE_URL } from '../helpers/config';

const  BestSellerTabContent = () => {
    const {
        addToJeweleryWishlist,
        addToJeweleryCart,
    } = useContext(FarzaaContext);

    const defaultQuantity = 1;
    const [quantity, setQuantity] = useState(defaultQuantity);

    const handleQuantityChange = (newQuantity) => {
        if (newQuantity >= 1) {
            setQuantity(newQuantity);
        }
    };

    const [products, setProducts] = useState([]);


    const fetchProducts = async () => {
        try {
            // const token = localStorage.getItem('authToken');
            const response = await axios.get(`${BASE_URL}/products/products_list/`, {
                // headers: {
                //     Authorization: `Bearer ${token}`,
                // },
            });
            const data = response.data;
            setProducts(data);
            console.log("products..................", response.data);
        } catch (error) {
            console.error('Error fetching products:', error);
        }
    };
    

 
    useEffect(() => {
        fetchProducts();
    }, []);

    return (
        <div className="row gy-4 gx-3 justify-content-center">
            {products.slice(0, 12).map((product) => (
                <div className="col-xl-3 col-md-4 col-6 col-xxs-6" key={product.id}>
                    <div className="fz-2-single-product">
                        <div className="fz-2-single-product-img">
                        <Link to={`/products/${product.SKU}`}> 

                                <img src={BASE_URL + product.product_image} alt={product.product_name} />
                            </Link>
                            <div className='color_text'>
                                <h5 className="fz-2-single-product-title">
                                <Link to={`/products/${product.id}`}>{product.SKU}</Link>
                                </h5>
                            </div>
                            <div className="fz-2-single-product-actions">
                                <button
                                    className="fz-add-to-cart-btn"
                                    onClick={() => addToJeweleryCart(product.id, quantity)} 
                                >
                                    Add to Cart
                                </button>


                                <div className="btnactions">
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

                                </div>


                            </div>

                        </div>
                        <div className="fz-2-single-product-txt">
                            <div className=''>

                                <span className="fz-2-single-product-category">   {product.category_name} </span>

                                <span className="color_span">&nbsp;&nbsp;( {product.color} )</span>
                            </div>
                            <h5 className="fz-2-single-product-title mb-555">
                            <Link to={`/products/${product.id}`}>{product.product_name}</Link>

                            </h5>
                            <div className='inf_gm'>
                                <ul>
                                    <li>GW:<span>{product.gross_weight} gm</span></li>
                                    <li>D:<span>{product.diamond_weight} gm</span></li>
                                </ul>
                            </div>

                            <div className='inf_gm'>
                                <ul>
                                    <li>CS:<span>{product.colour_stones} gm</span></li>
                                    <li>NW:<span>{product.net_weight} gm</span></li>
                                </ul>
                            </div>

                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default BestSellerTabContent;
