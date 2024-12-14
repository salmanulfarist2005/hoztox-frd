import React, { useContext, useEffect, useState } from 'react';
import { FarzaaContext } from '../../context/FarzaaContext';
import axios from 'axios';
import { BASE_URL } from '../helpers/config';
import { Link, useNavigate } from 'react-router-dom';

const ProductViewFilter = () => {
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
    const [quantity, setQuantity] = useState({});
    const [categories, setCategories] = useState([]);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

   
    const productsPerPage = 15;
    const [currentPage, setCurrentPage] = useState(1);

 
    const handleQuantityChange = (productId, newQuantity) => {
        setQuantity(prevQuantities => ({
            ...prevQuantities,
            [productId]: Math.max(1, newQuantity),
        }));
    };

 
    const fetchData = async () => {
        try {
            const token = localStorage.getItem('authToken');
            const productsResponse = await axios.get(`${BASE_URL}/products/products_user_list/`, {
                headers: { Authorization: `Bearer ${token}` }
            });

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
                        <div className="col-xl-4 col-md-4 col-6 col-xxs-6 m-p-1" key={item.id}>
                            <div className="fz-2-single-product">
                                <div className="fz-2-single-product-img">
                                    <Link to={`/products/${item.SKU}`}>
                                        <img src={BASE_URL + item.product_image} alt={item.product_name} />
                                    </Link>
                                    <div className="color_text">
                                        <h5 className="fz-2-single-product-title">
                                            <Link to={`/products/${item.id}`}>{item.SKU}</Link>
                                        </h5>
                                    </div>
                                    <div className="fz-2-single-product-actions">
                                        <button
                                            className="fz-add-to-cart-btn"
                                            onClick={() => {
                                                const selectedColor = selectedColors[item.id] || '';  
                                                addToJeweleryCart(item.id, quantity[item.id], selectedColor);
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
                                                    value={quantity[item.id]}
                                                    onChange={(e) =>
                                                        handleQuantityChange(
                                                            item.id,
                                                            Math.max(1, parseInt(e.target.value))
                                                        )
                                                    }
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
                                        <Link to={`/products/${item.id}`}>{item.category_name}</Link>
                                    </h5>

                                    <div className="inf_gm">
                                        <ul>
                                            <li>GW:<span>{item.gross_weight}</span></li>
                                            <li>DMD:<span>{item.diamond_weight} CT</span></li>
                                        </ul>
                                    </div>
                                    <div className="inf_gm">
                                        <ul>
                                            <li>CS:<span>{item.colour_stones}</span></li>
                                            <li>NW:<span>{item.net_weight}</span></li>
                                        </ul>
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
                                    <div className="mob-cart">
                                        <div className="mob-cart-number">
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
                                                    value={quantity[item.id]}
                                                    onChange={(e) =>
                                                        handleQuantityChange(
                                                            item.id,
                                                            Math.max(1, parseInt(e.target.value))
                                                        )
                                                    }
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
                                        <div className="m-cart">
                                            <button
                                                className="fz-add-to-cart-btn"
                                                onClick={() => {
                                                    const selectedColor = selectedColors[item.id] || '';  
                                                    addToJeweleryCart(item.id, quantity[item.id], selectedColor);
                                                }}
                                            >
                                                Add to Cart
                                            </button>
                                        </div>
                                    </div>
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

      
        {Array.from({ length: Math.min(5, totalPages - (Math.floor((currentPage - 1) / 5) * 5)) }, (_, index) => {
            const page = Math.floor((currentPage - 1) / 5) * 5 + index + 1;
            return (
                page <= totalPages && (
                    <li key={page}>
                        <button
                            className={`page-number-btn ${currentPage === page ? 'current' : ''}`}
                            onClick={() => handlePageChange(page)}
                        >
                            {page}
                        </button>
                    </li>
                )
            );
        })}

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
