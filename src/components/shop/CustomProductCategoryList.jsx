import React, { useContext, useEffect, useState } from 'react';
import { FarzaaContext } from '../../context/FarzaaContext';
import axios from 'axios';
import { BASE_URL } from '../helpers/config';

const CustomProductCategoryList = () => {
    const { handleCategoryFilter } = useContext(FarzaaContext);
    const [categories, setCategories] = useState([]);
    const [activeCategory, setActiveCategory] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchCategories = async () => {
        try {
            const token = localStorage.getItem('authToken');
            const response = await axios.get(`${BASE_URL}/products/categories/`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setCategories(response.data);
        } catch (error) {
            console.error('Error fetching categories:', error);
            setCategories([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    const handleCategoryClick = (categoryName) => {
        setActiveCategory(categoryName);
        handleCategoryFilter(categoryName);
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    return (
        <section className="sidebar-single-area product-categories-area">
            <h3 className="sidebar-single-area__title">Product Categories</h3>
            <ul className="product-categories">
                {categories.length > 0 ? (
                    categories.map((categoryObj) => (
                        <li
                            key={categoryObj.category_name}
                            onClick={() => handleCategoryClick(categoryObj.id)}
                            className={activeCategory === categoryObj.category_name ? 'active' : ''}
                            style={{ cursor: 'pointer', textTransform: 'capitalize' }}  
                        >
                            {categoryObj.category_name.toUpperCase()}  
                        </li>
                    ))
                ) : (
                    <li>No categories available</li>
                )}
            </ul>
        </section>
    );
};

export default CustomProductCategoryList;
