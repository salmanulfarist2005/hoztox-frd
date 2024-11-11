import React, { useState } from "react";
import {
    Card,
    CardBody,
    Col,
    Row,
    Container,
} from "reactstrap";
import Breadcrumbs from "../../../components/Admin/Breadcrumb";

import { BASE_URL } from '../../helpers/config';
import axios from 'axios';

const AddCategory = () => {
    document.title = "Form Elements | Upzet - React Admin & Dashboard Template";
    const [categoryName, setCategoryName] = useState(""); 
    const [image, setImage] = useState(null);  

    const handleImageChange = (e) => {
        const selectedFile = e.target.files[0];  
        setImage(selectedFile);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

      
        const formData = new FormData();
        formData.append("category_name", categoryName);
        if (image) {
            formData.append("image", image);
        }

        try {
         
            await axios.post(`${BASE_URL}/products/categories/create/`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',  
                },
            });

         
            setCategoryName("");
            setImage(null);

            alert("Category added successfully!");
            console.log("Form data:", formData);
        } catch (error) {
            console.error('Error adding category:', error);
            alert("Error adding category! Please try again."); 
        }
    };
    return (
        <React.Fragment>
            <div className="main-content">
            <div className="page-content ">
                <Container fluid={true}>
                    <Breadcrumbs title="Product Categories" breadcrumbItem="Add Category" />

                    <Row>
                        <Col>
                            <Card>
                                <CardBody>
                                    <form onSubmit={handleSubmit}>
                                        <Row className="mb-3">
                                            <label
                                                htmlFor="category-name"
                                                className="col-md-2 col-form-label"
                                            >
                                                Category Name
                                            </label>
                                            <div className="col-md-10">
                                                <input
                                                    className="form-control"
                                                    type="text"
                                                    id="category-name"
                                                    placeholder="Category Name"
                                                    value={categoryName}
                                                    onChange={(e) => setCategoryName(e.target.value)}  
                                                    required  
                                                />
                                            </div>
                                        </Row>

                                        <Row className="mb-3">
                                            <label
                                                htmlFor="example-image-input"
                                                className="col-md-2 col-form-label"
                                            >
                                                Category Logo/Image
                                            </label>
                                            <div className="col-md-10">
                                                <input
                                                    className="form-control"
                                                    type="file"
                                                    id="example-image-input"
                                                    accept="image/*"
                                                    onChange={handleImageChange} 
                                                    required 
                                                />
                                            </div>
                                        </Row>

                                        <div className="d-flex justify-content-end">
                                            <button type="submit" className="btn btn-primary">
                                                Submit
                                            </button>
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

export default AddCategory;
