import React, { useContext, useEffect, useState } from 'react';
import { FarzaaContext } from '../../context/FarzaaContext';
import axios from 'axios';
import { BASE_URL } from '../helpers/config';
import { Link } from 'react-router-dom';

const ProductViewFilter = () => {
    const {
        handleCategoryFilter,
        addToJeweleryWishlist,
        addToJeweleryCart,
        searchedProducts,  
        searchTerm,  
        activeCategory  
    } = useContext(FarzaaContext);


    const defaultQuantity = 1;
    const [quantity, setQuantity] = useState(defaultQuantity);

    const handleQuantityChange = (newQuantity) => {
        if (newQuantity >= 1) {
            setQuantity(newQuantity);
        }
    };
    const [categories, setCategories] = useState([]);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

  
    const fetchData = async () => {
        try {
         
            const productsResponse = await axios.get(`${BASE_URL}/products/products_list/`);  
            
          
            setProducts(productsResponse.data);
        } catch (error) {
            console.error('Error fetching data:', error);
            setError('Failed to load data. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const filteredProducts = products.filter(product => {
        const matchesCategory = activeCategory ? product.category_name === activeCategory : true;
        const matchesSearch = product.product_name.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div className="product-category-and-view">
            <div className="row gy-4 gx-3 justify-content-center">
                {filteredProducts.length > 0 ? (
                    filteredProducts.map((item) => (
                        <div className="col-xl-4 col-md-4 col-6 col-xxs-6" key={item.id}>
                            <div className="fz-2-single-product">
                                <div className="fz-2-single-product-img">
                                <Link to={`/products/${item.SKU}`}>
                                    <img src={BASE_URL + item.product_image} alt={item.product_name} />
                                    </Link>
                                    <div className="fz-2-single-product-actions">
                                <button
                                    className="fz-add-to-cart-btn"
                                    onClick={() => addToJeweleryCart(item.id, quantity)}
                                >
                                    Add to cart
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
                                    <h5 className="fz-2-single-product-title">  <Link to={`/products/${item.SKU}`}>{item.product_name}</Link></h5>
                                    <span className="fz-2-single-product-category"><Link to="#">{item.category_name}</Link></span>
                                    <h5 className="fz-2-single-product-title">  <Link to={`/products/${item.SKU}`}>SKU: {item.SKU}</Link></h5>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div>No products found.</div>
                )}
            </div>
        </div>
    );
};

export default ProductViewFilter;
