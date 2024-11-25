import React, { useContext, useEffect, useState } from 'react';
import { FarzaaContext } from '../../context/FarzaaContext';
import axios from 'axios';
import { BASE_URL } from '../helpers/config';
import { Link ,useNavigate} from 'react-router-dom';

const CustomProductViewFilter = () => {
    const {
        handleCategoryFilter,
        addToJeweleryWishlist,
        addToJeweleryCart,
        searchedProducts,  
        searchTerm,  
        activeCategory  
    } = useContext(FarzaaContext);
    const navigate = useNavigate();
    useEffect(() => {
        const authToken = localStorage.getItem('authToken');
        if (!authToken) {
            navigate('/');
        } 
    }, [navigate]);
    const defaultQuantity = 1;
    const [quantity, setQuantity] = useState(defaultQuantity);
    const [categories, setCategories] = useState([]);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 9; // Adjust this as needed

    const handleQuantityChange = (newQuantity) => {
        if (newQuantity >= 1) {
            setQuantity(newQuantity);
        }
    };

    const fetchData = async () => {
        try {
            const token = localStorage.getItem('authToken');
            const productsResponse = await axios.get(`${BASE_URL}/products/custom_products_user_list/`, {
                headers: { Authorization: `Bearer ${token}` }
            });
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

    // Filter the products based on category and search term
    const filteredProducts = products.filter(product => {
        const matchesCategory = activeCategory ? product.category_name === activeCategory : true;
        const matchesSearch = product.product_name.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    // Pagination logic
    const indexOfLastProduct = currentPage * itemsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - itemsPerPage;
    const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);

    const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

    // Pagination click handler
    const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div className="product-category-and-view">
            <div className="row gy-4 gx-3 justify-content-center">
                {currentProducts.length > 0 ? (
                    currentProducts.map((item) => (
                        <div className="col-xl-4 col-md-4 col-6 col-xxs-6" key={item.id}>
                              <div className="fz-2-single-product br-12">
                                <div className="fz-2-single-product-img br-0">
                                    <Link to={`/customized-products/${item.SKU}`}>
                                        <img className='br-0' src={BASE_URL + item.product_image} alt={item.product_name} />
                                    </Link>
                                    <div className='color_text'>
                                        <h5 className="fz-2-single-product-title">
                                            <Link to={`/customized-products/${item.SKU}`}>{item.SKU}</Link>
                                        </h5>
                                    </div>

                                </div>
                                <div className="fz-2-single-product-txt br-0">
                                    <h5 className="fz-2-single-product-title ">
                                        <Link to={`/customized-products/${item.SKU}`}>{item.category_name}</Link>
                                    </h5>
                                    



                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div>No products found.</div>
                )}
            </div>

            {/* Pagination Controls */}
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

export default CustomProductViewFilter;
