import React, { useContext, useEffect, useState } from 'react';
import { FarzaaContext } from '../../context/FarzaaContext';
import axios from 'axios';
import { BASE_URL } from '../helpers/config';
import { Link ,useNavigate} from 'react-router-dom';
import useDebounce from '../../Hooks/useDebounce';
import Pagination from '../pagination/Pagination';
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
    const itemsPerPage = 10; // Adjust this as needed
    const [totalPages,setTotalPages] = useState(1)
    const [pagetrigger, setPageTrigger] = useState(false);
       const debouncedValue = useDebounce(searchTerm)
    const [totalItems,setTotalItems] = useState(1)
    
    const handleQuantityChange = (newQuantity) => {
        if (newQuantity >= 1) {
            setQuantity(newQuantity);
        }
    };

    useEffect(() => {
        setCurrentPage(1);
        fetchData();

    }, [debouncedValue, activeCategory]);

    const fetchData = async () => {
        try {
            const token = localStorage.getItem('authToken');
            const response = await axios.get(`${BASE_URL}/products/custom_products_user_list/`, {
                headers: { Authorization: `Bearer ${token}` },
                                    params:{
                    is_paginated:true,
                    page:currentPage,
                    limit:9,
                    search:searchTerm
                }

            });
            
        if(!response.error){
            const productes = response.data.message.results;
            const totalPages = Math.ceil(response.data.message.count / itemsPerPage);
            setProducts(productes);
            setTotalItems(response.data.message.count)
            setTotalPages(totalPages)
            }

        } catch (error) {
            console.error('Error fetching data:', error);
            setError('Failed to load data. Please try again later.');
        } finally {
            setLoading(false);
        }
    };
    

    useEffect(() => {
        fetchData();
    }, [debouncedValue,pagetrigger]);
 
    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber)
        setPageTrigger(e=>!e)

    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div className="product-category-and-view">
            <div className="row gy-4 gx-3 justify-content-center">
                {products.length > 0 ? (
                    products.map((item) => (
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

          
                        <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                totalItems={totalItems}
                onPageChange={handlePageChange}
            />

        </div>
    );
};

export default CustomProductViewFilter;
