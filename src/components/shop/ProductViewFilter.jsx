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
    const [quantity, setQuantity] = useState({});
    const [categories, setCategories] = useState([]);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Pagination States
    const productsPerPage = 9;
    const [currentPage, setCurrentPage] = useState(1);

    const handleQuantityChange = (productId, newQuantity) => {
        setQuantity(prevQuantities => ({
            ...prevQuantities,
            [productId]: Math.max(1, newQuantity),
        }));
    };

    const fetchData = async () => {
        try {
            const productsResponse = await axios.get(`${BASE_URL}/products/products_list/`);
            setProducts(productsResponse.data);
            const initialQuantities = {};
            productsResponse.data.forEach((product) => {
                initialQuantities[product.id] = 1;
            });
            setQuantity(initialQuantities);
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
    const [selectedColors, setSelectedColors] = useState({});
    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;
    const handleColorSelection = (productId, color) => {
        setSelectedColors((prevSelectedColors) => ({
            ...prevSelectedColors,
            [productId]: color,
        }));
    };
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
                                    onClick={() => {
                                        const selectedColor = selectedColors[item.id];
                                        if (selectedColor) {
                                            addToJeweleryCart(item.id, quantity[item.id], selectedColor);
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
                                                    onClick={() => handleQuantityChange(item.id, quantity[item.id] - 1)}
                                                >
                                                    <i className="fa-light fa-minus"></i>
                                                </button>
                                                <input
                                                    type="number"
                                                    name="product-quantity"
                                                    className="cart-product-quantity-input"
                                                    value={quantity[item.id] || 1}
                                                    onChange={(e) => handleQuantityChange(item.id, parseInt(e.target.value))}
                                                    min="1"
                                                />
                                                <button
                                                    className="plus-btn cart-product__plus"
                                                    onClick={() => handleQuantityChange(item.id, quantity[item.id] + 1)}
                                                >
                                                    <i className="fa-light fa-plus"></i>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="fz-2-single-product-txt">
                                <h5 className="fz-2-single-product-title ">
                                        <Link to={`/products/${item.id}`}>{item.product_name}</Link>
                                    </h5>
                                    <div>
                                        <span className="fz-2-single-product-category mb-555">{item.category_name}</span>
                                        
                                    </div>
                                    
                                    <div className='inf_gm'>
                                        <ul>
                                            <li>GW:<span>{item.gross_weight} gm</span></li>
                                            <li>D:<span>{item.diamond_weight} gm</span></li>
                                        </ul>
                                    </div>
                                    <div className='inf_gm'>
                                        <ul>
                                            <li>CS:<span>{item.colour_stones} gm</span></li>
                                            <li>NW:<span>{item.net_weight} gm</span></li>
                                        </ul>
                                    </div>
                                </div>
                                <div className="color-selection">
                                <ul className="color-options">
                                    <li className={`color-option ${selectedColors[item.id] === 'rose' ? 'selected' : ''}`}>
                                        <input
                                            type="radio"
                                            name={`color-${item.id}`}
                                            value="rose"
                                            onChange={() => handleColorSelection(item.id, 'rose')}
                                            checked={selectedColors[item.id] === 'rose'}
                                        />
                                        <span className="color-box" style={{ backgroundColor: 'pink' }}></span>
                                        Rose
                                    </li>
                                    <li className={`color-option ${selectedColors[item.id] === 'yellow' ? 'selected' : ''}`}>
                                        <input
                                            type="radio"
                                            name={`color-${item.id}`}
                                            value="yellow"
                                            onChange={() => handleColorSelection(item.id, 'yellow')}
                                            checked={selectedColors[item.id] === 'yellow'}
                                        />
                                        <span className="color-box" style={{ backgroundColor: 'yellow' }}></span>
                                        Yellow
                                    </li>
                                </ul>
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
