import React, { useState, useEffect } from "react";
import {
  Card,
  CardBody,
  Col,
  Row,
  Container,
} from "reactstrap";
import axios from "axios";
import { BASE_URL } from '../helpers/config';
import "./CustomeDetail.css"

const CustomFull = () => {
  document.title = "Caratree Diamonds-Dashboard";
  const [category, setCategory] = useState([]);
  const [colors, setColors] = useState([]);  
  const [formData, setFormData] = useState({
    design_number: "",
    category: "",
    color: "",
    gram: "",
    cent: "",
    size: "",
    due_date:"",
    description: "",
  });
  const [images, setImages] = useState([]);
  const [categories, setCategories] = useState([]);
  const [quantity, setQuantity] = useState(1);  
  const [showConfirmation, setShowConfirmation] = useState(false); 
  const [orderProcessing, setOrderProcessing] = useState(false); 
  const handleImageChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setImages((prevImages) => [...prevImages, ...selectedFiles]);
  };

  const handleRemoveImage = (index) => {
    setImages((prevImages) => prevImages.filter((_, i) => i !== index));
  };

  const renderImagePreviews = () => {
  return (
    <div style={{ 
      display: 'flex', 
      flexWrap: 'wrap', 
      gap: '10px',
      alignItems: 'center'
    }}>
      {images.map((image, index) => (
        <div key={index} style={{ 
          position: 'relative', 
          flexShrink: 0 // Prevents images from shrinking
        }}>
          <img
            src={URL.createObjectURL(image)}
            alt={`preview ${index + 1}`}
            style={{ 
              width: '100px', 
              height: '100px',
              objectFit: 'cover', // Ensures images maintain aspect ratio
              borderRadius: '8px',
              border: '2px solid #ddd'
            }}
          />
          <button
            onClick={() => handleRemoveImage(index)}
            style={{
              position: 'absolute',
              top: '-5px',
              right: '-5px',
              background: '#ccc',
              color: 'black',
              border: 'none',
              borderRadius: '50%',
              width: '24px',
              height: '24px',
              cursor: 'pointer',
              fontSize: '12px',
              fontWeight: 'bold',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
            }}
          >
            ×
          </button>
        </div>
      ))}
    </div>
  );
};

  const fetchCategory = async () => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await axios.get(`${BASE_URL}/products/categories/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const category = response.data;

      if (Array.isArray(category)) {
        setCategories(category);
      } else {
        console.warn("Unexpected data format:", category);
        setCategories([]);
      }
    } catch (error) {
      console.error('Error fetching category:', error);
      setCategories([]);
    }
  };

  useEffect(() => {
    fetchCategory();
  }, []);

  const fetchColors = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/products/colors_list/`, { headers: { Authorization: `Bearer ${localStorage.getItem('authToken')}` } });
      if (Array.isArray(response.data)) {
        setColors(response.data);
      } else {
        console.warn("Unexpected data format:", response.data);
        setColors([]);
      }
    } catch (error) {
      console.error('Error fetching colors:', error);
      setColors([]);
    }
  };

  useEffect(() => {
    fetchColors();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e) => {
    setOrderProcessing(true);
 
    e.preventDefault();
    const productFormData = new FormData();
    
   
    productFormData.append("quantity", quantity);
    for (const key in formData) {
        productFormData.append(key, formData[key]);
    }
    images.forEach((image) => {
        productFormData.append("product_images", image);
    });

    const token = localStorage.getItem('authToken');

    try {
        const response = await axios.post(`${BASE_URL}/products/full-cutome-order/`, productFormData, {
            headers: {
                "Content-Type": "multipart/form-data",
                Authorization: `Bearer ${token}`,
            },
        });
        console.log("Product added:", response.data);
  
        setShowConfirmation(true);
        setOrderProcessing(false);
        // Reset form state
        setFormData({
            design_number: "",
            category: "",
            color: "",
            gram: "",
            cent: "",
            size: "",
            due_date:"",
            description: "",
        });
        setImages([]);
        setQuantity(1); 
        
   
        setTimeout(() => {
            setShowConfirmation(false);
        }, 3000);
    } catch (error) {
        console.error("Error adding product:", error.response ? error.response.data : error.message);
    }
};



  const handleQuantityChange = (newQuantity) => {
    if (newQuantity >= 1) {
      setQuantity(newQuantity);
    }
  };

  return (
    <React.Fragment>
      <div className="page-content ">
        <Container fluid={true}>
          <Row>
            <Col>
              <Card>
                <CardBody>
                  <form onSubmit={handleSubmit}>
                    <label htmlFor="quantity" className="col-md-2 col-form-label">Quantity</label>
                    <div className="fz-product-details__quantity cart-product__quantity">
                      <button type="button" className="minus-btn cart-product__minus" onClick={() => handleQuantityChange(quantity - 1)}>
                          <i className="fa-light fa-minus"></i>
                      </button>
                      <input
                          type="number"
                          name="product-quantity"
                          className="cart-product-quantity-input"
                          value={quantity}
                          onChange={(e) => handleQuantityChange(Math.max(1, parseInt(e.target.value)))}
                          min="1"
                      />
                      <button type="button" className="plus-btn cart-product__plus" onClick={() => handleQuantityChange(quantity + 1)}>
                          <i className="fa-light fa-plus"></i>
                      </button>
                    </div>
                    
                   
                   
                    <Row className="mb-3">
                      <label htmlFor="category" className="col-md-2 col-form-label">Product Category</label>
                      <div className="col-md-10">
                        <select className="form-control" value={formData.category} name="category" onChange={handleChange} required>
                          <option value="" disabled>Select Product Category</option>
                          {categories.map((category) => (
                            <option key={category.id} value={category.id}>{category.category_name}</option>
                          ))}
                        </select>
                      </div>
                    </Row>

                    <Row className="mb-3">
                      <label htmlFor="color" className="col-md-2 col-form-label ">Color</label>
                      <div className="col-md-10">
                        <select className="form-control" value={formData.color} name="color" onChange={handleChange} required>
                          <option value="" disabled>Select a Color</option>
                          {colors.map((color) => (
                            <option key={color.id} value={color.id}>{color.color}</option>
                          ))}
                        </select>
                      </div>
                    </Row>
                    
                    <Row className="mb-3">
                      <label htmlFor="gram" className="col-md-2 col-form-label">Weight (Gram)</label>
                      <div className="col-md-10">
                        <input
                          className="form-control"
                          type="number"
                          name="gram"
                          placeholder="Weight (Gram)"
                          value={formData.gram}
                          onChange={handleChange}
                    
                        />
                      </div>
                    </Row>

                    <Row className="mb-3">
                      <label htmlFor="cent" className="col-md-2 col-form-label">Cent </label>
                      <div className="col-md-10">
                        <input
                          className="form-control"
                          type="number"
                          name="cent"
                          placeholder="Cent "
                          value={formData.cent}
                          onChange={handleChange}
                      
                        />
                      </div>
                    </Row>

                    <Row className="mb-3">
                      <label htmlFor="size" className="col-md-2 col-form-label">Product Size</label>
                      <div className="col-md-10">
                        <input
                          className="form-control"
                          type="text"
                          name="size"
                          placeholder="Product Size"
                          value={formData.size}
                          onChange={handleChange}
                     
                        />
                      </div>
                    </Row>
                    <Row className="mb-3">
                      <label htmlFor="size" className="col-md-2 col-form-label">Due Date</label>
                      <div className="col-md-10">
                        <input
                          className="form-control"
                          type="date"
                          name="due_date"
                          placeholder="Due Date"
                          value={formData.due_date}
                          onChange={handleChange}
                      
                        />
                      </div>
                    </Row>
                    <Row className="mb-3">
                      <label htmlFor="description" className="col-md-2 col-form-label">Addtional Notes</label>
                      <div className="col-md-10">
                        <textarea
                          className="form-control"
                          name="description"
                          rows="3"
                          value={formData.description}
                          onChange={handleChange}
                       
                        ></textarea>
                      </div>
                    </Row>

                    <Row className="mb-3">
                      <label htmlFor="images" className="col-md-2 col-form-label">Product Images</label>
                      <div className="col-md-10">
                        <input
                          type="file"
                          accept="image/*"
                          multiple
                          onChange={handleImageChange}
                       
                        />
                      </div>
                    </Row>

                    <div className="mb-3">
                      {renderImagePreviews()}
                    </div>

                    <button type="submit" className="btn btn-primary">Place Order</button>
                  </form>
                </CardBody>
                {orderProcessing && (
                <div className="loading-spinner">
                    <div className="spinner"></div>
                    <p>Processing your order...</p>
                </div>
            )}

                {showConfirmation && (
                <div className="confirmation-popup">
                    <div className="confirmation-content">
                        <span className="checkmark">&#10003;</span>  
                        <p>Order placed successfully!</p>
                    </div>
                </div>
            )}
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default CustomFull;
