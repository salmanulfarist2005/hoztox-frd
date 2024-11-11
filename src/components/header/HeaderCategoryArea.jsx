import React, { useContext, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { FarzaaContext } from '../../context/FarzaaContext';
import { BASE_URL } from '../helpers/config';

const HeaderCategoryArea = ({ header, title }) => {
  const { isCategoryOpen, handleCategoryBtn, categoryBtnRef } = useContext(FarzaaContext);
  const [categories, setCategories] = useState([]);

  const fetchCategories = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/products/categories/`);
      const data = response.data;

      if (Array.isArray(data)) {
        setCategories(data);
      } else {
        console.warn('Unexpected data format:', data);
        setCategories([]);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
      setCategories([]);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

 
  const chunkCategories = (categories, size) => {
    const chunks = [];
    for (let i = 0; i < categories.length; i += size) {
      chunks.push(categories.slice(i, size + i));
    }
    return chunks;
  };

  const categoryChunks = chunkCategories(categories, 6);

  return (
    <div className={`fz-category-area ${header}`} ref={categoryBtnRef}>
      <button className="fz-category-btn" onClick={handleCategoryBtn}>
        <i className="fa-solid fa-grid"></i>
        <span className={title}>Category</span>
      </button>

      <div className={`fz-category-menu ${isCategoryOpen ? 'open' : ''}`}>
        <div className="row gx-4 gy-4"> 
      
          {categoryChunks.map((chunk, chunkIndex) => (
            <div key={chunkIndex} className="col-lg-4 col-md-6 col-sm-6 col-12">
              <ul className="fz-category-list">
                {chunk.map((category, index) => (
                  <li key={index}>
                    <div>
                    {/* <Link to={`/shop/${category.slug}`}> */}
                    {category.category_name}
                    {/* </Link> */}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HeaderCategoryArea;
