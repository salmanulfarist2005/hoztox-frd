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
    const [categories, setCategories] = useState([]);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    // Pagination States
    const productsPerPage = 9;  
    const [currentPage, setCurrentPage] = useState(1);

    const handleQuantityChange = (newQuantity) => {
        if (newQuantity >= 1) {
            setQuantity(newQuantity);
        }
    };

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

    const totalProducts = filteredProducts.length;
    const totalPages = Math.ceil(totalProducts / productsPerPage);

    const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
        scrollToTop();  
    };

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    };

 
    const startIndex = (currentPage - 1) * productsPerPage;
    const endIndex = currentPage * productsPerPage;
    const paginatedProducts = filteredProducts.slice(startIndex, endIndex);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div className="product-category-and-view">
            <div className="row gy-4 gx-3 justify-content-center">
                {paginatedProducts.length > 0 ? (
                    paginatedProducts.map((item) => (
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
                                    </div>
                                </div>
                                <div className="fz-2-single-product-txt">
                                    <h5 className="fz-2-single-product-title">
                                        <Link to={`/products/${item.SKU}`}>{item.product_name}</Link>
                                    </h5>
                                    <span className="fz-2-single-product-category">
                                        <Link to="#">{item.category_name}</Link>
                                    </span>
                                    <h5 className="fz-2-single-product-title">
                                        <Link to={`/products/${item.SKU}`}>SKU: {item.SKU}</Link>
                                    </h5>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div>No products found.</div>
                )}
            </div>

           
            <nav className="fz-shop-pagination">
                <ul className="page-numbers">
                    <li>
                        <button
                            disabled={currentPage === 1}
                            onClick={() => handlePageChange(currentPage - 1)}
                            className="page-number-btn"
                        >
                            <span aria-current="page" className="last-page">
                                <i className="fa-light fa-angle-double-left"></i>
                            </span>
                        </button>
                    </li>

                    {Array.from({ length: totalPages }, (_, index) => (
                        <li key={index}>
                            <button
                                className={`page-number-btn ${currentPage === index + 1 ? 'current' : ''}`}
                                onClick={() => handlePageChange(index + 1)}
                            >
                                {index + 1}
                            </button>
                        </li>
                    ))}

                    <li>
                        <button
                            disabled={currentPage === totalPages}
                            className="page-number-btn"
                            onClick={() => handlePageChange(currentPage + 1)}
                        >
                            <span aria-current="page" className="last-page">
                                <i className="fa-light fa-angle-double-right"></i>
                            </span>
                        </button>
                    </li>
                </ul>
            </nav>
        </div>
    );
};

export default ProductViewFilter;
