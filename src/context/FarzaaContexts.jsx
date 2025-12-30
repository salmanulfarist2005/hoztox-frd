// src/context/FarzaaContext.jsx
import React, { createContext, useState } from 'react';
import axios from 'axios'; // Ensure axios is imported
import { BASE_URL } from '../components/helpers/config'; // Adjust the path as needed

export const FarzaaContexts = createContext();

export const FarzaaProvider = ({ children }) => {
    const [activeCategory, setActiveCategory] = useState(null);
    const [products, setProducts] = useState([]);

    const handleCategoryFilter = async (category) => {
        setActiveCategory(category);
        const response = await axios.get(`${BASE_URL}/?category=${category}`,{
            headers: {
                Authorization: `Bearer ${localStorage.getItem('authToken')}`,
            },
        });
        setProducts(response.data);
    };

    return (
        <FarzaaContexts.Provider value={{ products, handleCategoryFilter }}>
            {children}
        </FarzaaContexts.Provider>
    );
};
