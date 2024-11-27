import React, { useState } from "react";
import { Card, CardBody, Col, Row, Container } from "reactstrap";
import Breadcrumbs from "../../../components/Admin/Breadcrumb";
import axios from "axios";
import { BASE_URL } from '../../helpers/config';

const Media = () => {
  document.title = "Caratree Diamonds-Dashboard";

  const [formData, setFormData] = useState({
    SKU: "",
    product_name: "",
    category: "",
    color: "",
    gross_weight: "",
    diamond_weight: "",
    colour_stones: "",
    net_weight: "",
    product_size: "",
    product_image: null,
    description: "",
    usertypes: []
  });

  const [images, setImages] = useState([]);

  const handleImageChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setImages((prevImages) => [...prevImages, ...selectedFiles]);
  };

  const handleRemoveImage = (index) => {
    setImages((prevImages) => prevImages.filter((_, i) => i !== index));
  };

  const renderImagePreviews = () => {
    return images.map((image, index) => (
      <div key={index} style={{ position: 'relative', margin: '5px' }}>
        <img
          src={URL.createObjectURL(image)}
          alt={`preview ${index + 1}`}
          style={{ width: '100px', height: '100px' }}
        />
        <button
          onClick={() => handleRemoveImage(index)}
          style={{
            position: 'absolute',
            top: '5px',
            right: '5px',
            background: 'gray',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
          }}
        >
          X
        </button>
      </div>
    ));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const productFormData = new FormData();

    // Append form data fields
    for (const key in formData) {
      productFormData.append(key, formData[key]);
    }

    // Append images with the key 'images'
    images.forEach((image) => {
      productFormData.append("images", image);
    });

    try {
      const response = await axios.post(`${BASE_URL}/products/upload-media/`, productFormData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      console.log("Media added:", response.data);
      alert("Images uploaded successfully!");

      // Reset form and images
      setFormData({
        SKU: "",
        product_name: "",
        category: "",
        color: "",
        gross_weight: "",
        diamond_weight: "",
        colour_stones: "",
        net_weight: "",
        product_size: "",
        product_image: null,
        description: "",
        usertypes: []
      });
      setImages([]);

    } catch (error) {
      console.error("Error uploading media:", error.response ? error.response.data : error.message);
    }
  };

  return (
    <React.Fragment>
      <div className="main-content">
        <div className="page-content ">
          <Container fluid={true}>
            <Breadcrumbs title="media" breadcrumbItem="Add Images" />
            <Row>
              <Col>
                <Card>
                  <CardBody>
                    <form onSubmit={handleSubmit}>
                      <Row className="mb-3">
                        <label htmlFor="additional_images" className="col-md-2 col-form-label">Images</label>
                        <div className="col-md-10">
                          <input
                            className="form-control"
                            type="file"
                            accept="image/*"
                            multiple
                            onChange={handleImageChange}
                          />
                        </div>
                      </Row>
                      <div>
                        {images.length > 0 && <h5>Image Previews:</h5>}
                        <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                          {renderImagePreviews()}
                        </div>
                      </div>
                      <div className="d-flex justify-content-end">
                        <button type="submit" className="btn btn-primary">Add Images</button>
                      </div>
                    </form>
                  </CardBody>
                </Card>
              </Col>
            </Row>
          </Container>
        </div>
        </div>
    </React.Fragment>
  );
};

export default Media;
