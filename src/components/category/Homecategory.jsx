import React, { Fragment, useEffect, useState, useContext } from "react";
import axios from "axios";
import './Category.css';
import { Container, Row, Col } from "reactstrap";
import { FarzaaContext } from '../../context/FarzaaContext';
import { BASE_URL } from '../helpers/config';
import { useNavigate } from "react-router-dom";  // Import useNavigate for navigation

const MasterCategory = ({ img, title, link, onCategoryClick }) => {
  return (
    <div className="category-block" onClick={onCategoryClick}> {/* Trigger the category filter */}
      <div className="category-image svg-image">
        <img src={img} alt={title} />
      </div>
      <div className="category-details">
        <h5>{title}</h5>
      </div>
    </div>
  );
};

const Category = () => {
  const [categories, setCategories] = useState([]);
  const { handleCategoryFilter } = useContext(FarzaaContext);
  const navigate = useNavigate();  // Hook to perform navigation

  const fetchCategories = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/products/categories/`);
      const data = response.data;

      if (Array.isArray(data)) {
        setCategories(data);
      } else {
        console.warn("Unexpected data format:", data);
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

  const handleCategoryClick = (categoryName) => {
    handleCategoryFilter(categoryName);  // Update the active category
    navigate(`/shop/${categoryName}`);  // Navigate to the category-specific page
  };

  return (
    <section className="bg-gry-1 p-top-20">
      <Fragment>
        <Container>
          <section className="section-b-space border-section border-top-0">
            <Row className="justify-content-center g-4">
              {categories.map((category, i) => (
                <Col
                  key={i}
                  xs="4"
                  sm="4"
                  md="3"
                  lg="2"
                  className="d-flex justify-content-center"
                >
                  <MasterCategory
                    img={BASE_URL + category.image}
                    title={category.category_name}
                    link={`/shop/${category.category_name}`}   
                    onCategoryClick={() => handleCategoryClick(category.category_name)}   
                  />
                </Col>
              ))}
            </Row>
          </section>
        </Container>
      </Fragment>
    </section>
  );
};

export default Category;
