import React, { Fragment, useEffect, useState } from "react";
import axios from "axios";  
import './Category.css';
import { Container, Row, Col } from "reactstrap";

import { BASE_URL } from '../helpers/config';

const MasterCategory = ({ img, title, link }) => {
    return (
      <div className="category-block">
        <a href={link}>
          <div className="category-image svg-image">
            <img src={img} alt={title} />  
          </div>
        </a>
        <div className="category-details">
          <a href={link}>
            <h5>{title}</h5>
          </a>
        </div>
      </div>
    );
  };
  
const Category = () => {
  const [categories, setCategories] = useState([]);

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

  return (
    <section className="bg-gry-1 p-top-20">
      <Fragment>
        <Container>
          <section className="section-b-space border-section border-top-0">
            <Row className="justify-content-center g-4">  
              {categories.map((category, i) => (
                <Col key={i} xs="4" sm="4" md="4" lg="3" className="d-flex justify-content-center">
                  <MasterCategory
                    img={BASE_URL + category.image}  
             
                    title={category.category_name }  
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
