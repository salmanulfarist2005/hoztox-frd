import React, { useState, useEffect } from 'react';
import { Button, Card, CardBody, CardHeader, Col, Container, ListGroup, ListGroupItem, Modal, ModalBody, ModalFooter, Row, ModalHeader } from 'reactstrap';

import { Link, useParams } from 'react-router-dom';
import axios from 'axios';
import Breadcrumbs from "../../../components/Admin/Breadcrumb";

import { BASE_URL } from '../../helpers/config';


const ManageProducts = () => {
    const [products, setProducts] = useState([]);
    const [images, setImages] = useState([]);

    const [productId, setProductId] = useState([]);

    console.log("Retrieved productId:", productId);
    const [userTypes, setUserTypes] = useState([]);
    const [formData, setFormData] = useState({
        SKU: "",
        product_name: "",
        category: "",

        gross_weight: "",
        diamond_weight: "",
        colour_stones: "",
        net_weight: "",

        product_image: null,
        description: "",
        usertypes: []
    });

    const [category, setCategory] = useState([]);

    const fetchProducts = async () => {
        try {
            const response = await axios.get(`${BASE_URL}/products/products_list/`);
            const data = response.data;
            setProducts(data);
            console.log("products", response.data);
        } catch (error) {
            console.error('Error fetching products:', error);
        }
    };


    useEffect(() => {
        fetchProducts();
    }, []);




    const handleEditClick = (product) => {
        console.log("Editing product:", product);


        if (!product.id) {
            console.error("Product does not have a valid ID.");
            return;
        }

        setProductId(product.id);

        setFormData({
            SKU: product.SKU,
            product_name: product.product_name,
            category: product.category,

            gross_weight: product.gross_weight,
            diamond_weight: product.diamond_weight,
            colour_stones: product.colour_stones,
            net_weight: product.net_weight,

            product_image: product.product_image, // Main image
            description: product.description,
            usertypes: product.usertypes
        });

        setCurrentImage(product.product_image); // Set the current image for preview
        setSelectedUserTypes(product.usertypes);
        setImages([]); // Reset the additional images on edit
        setmodal_list(true);
    };



    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({ ...prevData, [name]: value }));
    };



    const handleRemoveImage = (index) => {
        setImages((prevImages) => prevImages.filter((_, i) => i !== index));
    };




    const [modal_list, setmodal_list] = useState(false);
    function tog_list() {
        setmodal_list(!modal_list);
    }

    const [modal_delete, setmodal_delete] = useState(false);
    function tog_delete() {
        setmodal_delete(!modal_delete);
    }
    const fetchCategory = async () => {
        try {
            const response = await axios.get(`${BASE_URL}/products/categories/`);
            const category = response.data;

            if (Array.isArray(category)) {
                setCategory(category);
            } else {
                console.warn("Unexpected data format:", category);
                setCategory([]);
            }
        } catch (error) {
            console.error('Error fetching category:', error);
            setCategory([]);
        }
    };


    const fetchUserTypes = async () => {
        try {
            const response = await axios.get(`${BASE_URL}/products/usertypes_list/`);
            console.log("Full response:", response.data);


            const userTypesData = response.data;


            console.log("User types data:", userTypesData);

            if (Array.isArray(userTypesData)) {
                setUserTypes(userTypesData);
            } else {
                console.warn("Unexpected data format:", userTypesData);
                setUserTypes([]);
            }
        } catch (error) {
            console.error('Error fetching user types:', error);
            setUserTypes([]);
        }
    };

    useEffect(() => {
        fetchCategory();
        fetchUserTypes();
    }, []);

    const [selectedUserTypes, setSelectedUserTypes] = useState([]);
    const handleCheckboxChange = (event) => {
        const { value } = event.target;
        setSelectedUserTypes((prevSelected) => {
            const userTypeId = parseInt(value, 10);
            if (prevSelected.includes(userTypeId)) {
                return prevSelected.filter((id) => id !== userTypeId);
            } else {
                return [...prevSelected, userTypeId];
            }
        });
    };
    const [currentImage, setCurrentImage] = useState(null);
    const [newImage, setNewImage] = useState(null);
    const [mainImage, setMainImage] = useState(null);

    const handleImageRemove = (index) => {

        setImages((prevImages) => prevImages.filter((_, i) => i !== index));
    };

    const handleNewImageRemove = (index) => {
        setAdditionalImages((prevImages) => prevImages.filter((_, i) => i !== index));
    };




    const [additionalImages, setAdditionalImages] = useState([]);
    const handleImageChange = (e) => {
        const selectedFiles = Array.from(e.target.files);
        if (selectedFiles.length > 0) {
            setNewImage(selectedFiles[0]);
            setMainImage(selectedFiles[0]);
        }
        setImages((prevImages) => [...prevImages, ...selectedFiles]);
    };

    const handleMainImageChange = (e) => {
        const selectedFiles = Array.from(e.target.files);
        if (selectedFiles.length > 0) {
            setMainImage(selectedFiles[0]);
        }
    };
    const handleImageAdd = (e) => {
        const selectedFiles = Array.from(e.target.files);
        setAdditionalImages((prevImages) => [...prevImages, ...selectedFiles]);
    };
    const renderImagePreviews = () => {
        return (
            <div className="image-previews">
                {mainImage && mainImage instanceof File ? (
                    <img
                        src={URL.createObjectURL(mainImage)}
                        alt="Main"
                        style={{ maxWidth: '30%', marginBottom: '10px' }}
                    />
                ) : (
                    currentImage && (
                        <img
                            src={BASE_URL + currentImage}
                            alt="Current"
                            style={{ maxWidth: '30%', marginBottom: '10px' }}
                        />
                    )
                )}
            </div>
        );
    };


    const [imagesToRemove, setImagesToRemove] = useState([]);


    const handleExistingImageRemove = (index) => {
        const product = products.find(prod => prod.id === productId);
        const imageToRemove = product.additional_images[index];


        setImagesToRemove((prev) => [...prev, imageToRemove.id]);


        product.additional_images.splice(index, 1);

        setProducts([...products]);
    };

    const renderImagePreviewAdditional = () => {
        // Find the product by id to render additional images
        const product = products.find(prod => prod.id === productId); // Match with the current product ID

        return (
            <div className="image-previews" style={{ display: 'flex', flexWrap: 'wrap' }}>
                {product?.additional_images?.length > 0 ? (
                    product.additional_images.map((imageObj, index) => (
                        <div key={imageObj.id} style={{ position: 'relative', margin: '10px' }}>
                            <img
                                src={`${BASE_URL}${imageObj.image}`}
                                alt={`Existing Additional ${index + 1}`}
                                style={{ maxWidth: '100px', maxHeight: '100px' }}
                            />
                            <button
                                onClick={() => handleExistingImageRemove(index)} // Pass the index to remove
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
                    ))
                ) : (
                    <p>No additional images available.</p> // Fallback if no images
                )}

                {additionalImages.length > 0 && additionalImages.map((image, index) => (
                    <div key={index} style={{ position: 'relative', margin: '10px' }}>
                        <img
                            src={URL.createObjectURL(image)}
                            alt={`Uploaded Additional ${index + 1}`}
                            style={{ maxWidth: '100px', maxHeight: '100px' }}
                        />
                        <button
                            onClick={() => handleNewImageRemove(index)}
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
                ))}
            </div>
        );
    };


    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!productId) return;

        const updatedFormData = {
            ...formData,
            usertypes: selectedUserTypes,
            product_image: mainImage || formData.product_image,
        };

        try {
            const formDataToSubmit = new FormData();

            Object.keys(updatedFormData).forEach((key) => {
                if (key !== 'product_image' && key !== 'additional_images') {
                    formDataToSubmit.append(key, updatedFormData[key]);
                }
            });

            if (mainImage instanceof File) {
                formDataToSubmit.append('product_image', mainImage);
            }

            additionalImages.forEach((image) => {
                formDataToSubmit.append('additional_images', image);
            });

            const product = products.find(prod => prod.id === productId);
            if (product && product.additional_images) {
                product.additional_images.forEach((existingImage) => {
                    if (!imagesToRemove.includes(existingImage.id)) {
                        formDataToSubmit.append('additional_images', existingImage.image);
                    }
                });
            }

            imagesToRemove.forEach((imageId) => {
                formDataToSubmit.append('images_to_remove[]', imageId);
            });

            // Send the update request
            await axios.put(`${BASE_URL}/products/products/${productId}/update/`, formDataToSubmit, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            // Update the local state with the updated product
            setProducts(prevProducts => prevProducts.map(prod => prod.id === productId ? { ...prod, ...updatedFormData } : prod));

            alert("Product updated successfully!");
            setFormData({
                SKU: "",
                product_name: "",
                category: "",
                gross_weight: "",
                diamond_weight: "",
                colour_stones: "",
                net_weight: "",
                product_image: null,
                description: "",
                usertypes: []
            });

            setImages([]);
            setSelectedUserTypes([]);
            setImagesToRemove([]);
            setmodal_list(false);

        } catch (error) {
            console.error("Error updating product:", error.response ? error.response.data : error.message);
        }
    };



    useEffect(() => {
        fetchProducts();
    }, []);


    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };
    const deleteCategory = async (productId) => {
        if (window.confirm("Are you sure you want to delete this product?")) {
            try {
                await axios.delete(`${BASE_URL}/products/product/${productId}/delete/`);
                fetchProducts();
                alert("Product deleted successfully!");
            } catch (error) {
                console.error('Error deleting product:', error);
                alert("There was an error deleting the product.");
            }
        }
    };
    const [searchTerm, setSearchTerm] = useState("");

    const deleteMultipleCategories = async () => {
        if (selectedIds.length === 0) {
            alert("Please select at least one Product to delete.");
            return;
        }
        if (window.confirm("Are you sure you want to delete the selected Products?")) {
            try {
                await Promise.all(selectedIds.map(id =>
                    axios.delete(`${BASE_URL}/products/product/${id}/delete/`)
                ));
                fetchProducts();
                alert("Selected Products deleted successfully!");
            } catch (error) {
                console.error('Error deleting Products:', error.response ? error.response.data : error.message);
                alert("There was an error deleting the selected Products.");
            }
        }
    };


    const filteredProducts = products.filter(product => {
        return product && (
            product.product_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            product.SKU.toLowerCase().includes(searchTerm.toLowerCase())
        );
    });


    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);


    const indexOfLastProduct = currentPage * itemsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - itemsPerPage;
    const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);


    const handleNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };

    const handlePreviousPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };
    const [selectedIds, setSelectedIds] = useState([]);
    const [isAllSelected, setIsAllSelected] = useState(false);

    const handleSelectAllChange = () => {
        if (isAllSelected) {
            setSelectedIds([]);
        } else {
            setSelectedIds(filteredProducts.map(product => product.id));
        }
        setIsAllSelected(!isAllSelected);
    };
    const handleCheckboxChanges = (productId) => {
        setSelectedIds(prevSelected =>
            prevSelected.includes(productId)
                ? prevSelected.filter(id => id !== productId)
                : [...prevSelected, productId]
        );

        setIsAllSelected(filteredProducts.length === selectedIds.length + 1);
    };
    return (
        <React.Fragment>
            <div className="main-content">
                <div className="page-content ">
                    <Container fluid>
                        <Breadcrumbs title="Products" breadcrumbItem="Manage Products" />
                        <Row>
                            <Col lg={12}>
                                <Card>
                                    <CardBody>
                                        <div id="customerList">
                                            <Row className="g-4 mb-3">
                                                <Col className="col-sm-auto">
                                                    <div className="d-flex gap-1">
                                                        <Button color="soft-danger" onClick={deleteMultipleCategories}><i className="ri-delete-bin-2-line"></i></Button>
                                                    </div>
                                                </Col>
                                                <Col className="col-sm">
                                                    <div className="d-flex justify-content-sm-end">
                                                        <div className="search-box ms-2" style={{ position: 'relative' }}>
                                                            <input
                                                                type="text"
                                                                className="form-control search"
                                                                placeholder="Search..."
                                                                style={{ paddingRight: '30px' }}
                                                                value={searchTerm}
                                                                onChange={handleSearchChange}
                                                            />
                                                            <i className="ri-search-line search-icon" style={{
                                                                position: 'absolute',
                                                                right: '10px',
                                                                top: '50%',
                                                                transform: 'translateY(-50%)',
                                                                pointerEvents: 'none'
                                                            }}></i>
                                                        </div>
                                                    </div>
                                                </Col>
                                            </Row>

                                            <div className="table-responsive table-card mt-3 mb-1">
                                                <table className="table align-middle table-nowrap min-500" id="customerTable">
                                                    <thead className="table-light manage-product">
                                                        <tr>
                                                            <th scope="col" style={{ width: "50px" }}>
                                                                <div className="form-check">
                                                                    <input
                                                                        className="form-check-input"
                                                                        type="checkbox"
                                                                        id="checkAll"
                                                                        checked={isAllSelected}
                                                                        onChange={handleSelectAllChange}
                                                                    />
                                                                </div>
                                                            </th>
                                                            <th className="sort" data-sort="customer_name"  >
                                                                Product Name
                                                            </th>

                                                            <th className="sort" data-sort="email">SKU</th>
                                                            <th className="sort" data-sort="phone">Product Category</th>

                                                            <th className="sort" data-sort="action">Action</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody className="list form-check-all manage-product">
                                                        {currentProducts.map((product) => (
                                                            <tr key={product.id}>
                                                                <td>
                                                                    <div className="form-check">
                                                                        <input
                                                                            className="form-check-input"
                                                                            type="checkbox"
                                                                            value={product.id}
                                                                            checked={selectedIds.includes(product.id)}
                                                                            onChange={(e) => handleCheckboxChanges(product.id)}
                                                                        />
                                                                    </div>
                                                                </td>
                                                                <td>{product.product_name}</td>
                                                                <td>{product.SKU}</td>
                                                                <td>{product.category_name}</td>


                                                                <td>
                                                                    <div className="d-flex gap-2">
                                                                        <div className="edit">
                                                                            <button onClick={() => handleEditClick(product)} className="btn btn-sm btn-success edit-item-btn">Edit</button>
                                                                        </div>
                                                                        <div className="remove">
                                                                            <button onClick={() => deleteCategory(product.id)} className="btn btn-sm btn-danger remove-item-btn" data-bs-toggle="modal" data-bs-target="#deleteRecordModal">Remove</button>
                                                                        </div>
                                                                    </div>
                                                                </td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>

                                            <div className="d-flex justify-content-end">
                                                <div className="pagination-wrap hstack gap-2">
                                                    <Link onClick={() => handlePreviousPage(currentPage - 1)}
                                                        disabled={currentPage === 1} className="page-item pagination-prev disabled" to="#">
                                                        Previous
                                                    </Link>
                                                    <ul className="pagination listjs-pagination mb-0"></ul>
                                                    <Link onClick={() => handleNextPage(currentPage + 1)}
                                                        disabled={currentPage === totalPages} className="page-item pagination-next" to="#">
                                                        Next
                                                    </Link>
                                                </div>
                                            </div>
                                        </div>
                                    </CardBody>
                                </Card>
                            </Col>
                        </Row>
                    </Container>
                </div>
            </div>
            <Modal
                isOpen={modal_list}
                toggle={() => {
                    tog_list();
                }}
                centered
                style={{ maxWidth: '900px', width: '90%' }}
            >
                <ModalHeader className="bg-light p-3" id="exampleModalLabel" toggle={() => { tog_list(); }}> Edit Product </ModalHeader>
                <form className="tablelist-form" onSubmit={handleSubmit} >
                    <CardBody style={{ padding: '20px' }}>



                        <Row className="mb-3 mt-2">
                            <label
                                htmlFor="example-text-input"
                                className="col-md-2 col-form-label"
                            >
                                SKU
                            </label>
                            <div className="col-md-10">
                                <input
                                    className="form-control"
                                    type="text"
                                    name="SKU"
                                    placeholder="SKU"
                                    value={formData.SKU}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </Row>
                        <Row className="mb-3">
                            <label
                                htmlFor="example-text-input"
                                className="col-md-2 col-form-label"
                            >
                                Product Name
                            </label>
                            <div className="col-md-10">
                                <input
                                    className="form-control"
                                    type="text"
                                    name="product_name"
                                    value={formData.product_name}
                                    placeholder="Product Name"
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </Row>
                        <Row className="mb-3">
                            <label htmlFor="product-category" className="col-md-2 col-form-label">
                                Product Category
                            </label>
                            <div className="col-md-10">
                                <select
                                    className="form-control"
                                    value={formData.category}
                                    name="category"
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="" disabled>Select Product Category</option>
                                    {category.map((category) => (
                                        <option key={category.id} value={category.id}>{category.category_name}</option>
                                    ))}
                                </select>
                            </div>
                        </Row>

                        <Row className="mb-3 d-flex align-items-center">
                            <label htmlFor="example-text-input" className="col-md-2 col-form-label">
                                Product Weight
                            </label>

                            <div className="col-md-10 d-flex justify-content-between">

                                <div className="me-2 flex-grow-1">
                                    <label htmlFor=" " className=" ">
                                        Gross Weight (gm)
                                    </label>
                                    <input
                                        className="form-control"
                                        type="text"
                                        name="gross_weight"
                                        placeholder="Gross Weight"
                                        value={formData.gross_weight}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div className="me-2 flex-grow-1">
                                    <label htmlFor=" " className=" ">
                                        Diamond Weight (gm)
                                    </label>
                                    <input
                                        className="form-control"
                                        type="text"
                                        name="diamond_weight"
                                        placeholder="Diamond Weight"
                                        value={formData.diamond_weight}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div className="me-2 flex-grow-1">
                                    <label htmlFor=" " className=" ">
                                        Colour Stones (gm)
                                    </label>
                                    <input
                                        className="form-control"
                                        type="text"
                                        name="colour_stones"
                                        placeholder="Colour Stones"
                                        value={formData.colour_stones}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div className="flex-grow-1">
                                    <label htmlFor=" " className=" ">
                                        Net Weight (gm)
                                    </label>
                                    <input
                                        className="form-control"
                                        type="text"
                                        name="net_weight"
                                        placeholder="Net Weight"
                                        value={formData.net_weight}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                            </div>
                        </Row>



                        <Row className="mb-3">
                            <label
                                htmlFor="example-image-input"
                                className="col-md-2 col-form-label"
                            >
                                Product Image
                            </label>
                            <div className="col-md-10">
                                <input
                                    className="form-control"
                                    type="file"
                                    name="product_image"
                                    accept="image/*"
                                    multiple
                                    onChange={handleImageChange}
                                />
                                {renderImagePreviews()}
                            </div>
                        </Row>

                        <Row className="mb-3">
                            <label
                                htmlFor="example-image-local-input"
                                className="col-md-2 col-form-label"
                            >
                                Product Gallery
                            </label>
                            <div className="col-md-10">
                                <input
                                    className="form-control"
                                    type="file"
                                    id="example-image-local-input"
                                    accept="image/*"
                                    multiple
                                    onChange={handleImageAdd}
                                />
                                {renderImagePreviewAdditional()}
                            </div>
                        </Row>




                        <Row className="mb-3">
                            <label htmlFor="example-text-input" className="col-md-2 col-form-label">
                                Description
                            </label>
                            <div className="col-md-10">
                                <textarea
                                    className="form-control"
                                    name="description"
                                    placeholder="Description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    rows="5"
                                    required
                                ></textarea>
                            </div>
                        </Row>
                        <Row className="mb-3">
                            <label htmlFor="usertypes" className="col-md-2 d-flex  align-items-center">User Types</label>
                            <div className="col-md-10 d-flex flex-wrap">
                                {userTypes.map((userType) => (
                                    <div key={userType.id} className="form-check me-4">
                                        <input
                                            type="checkbox"
                                            className="form-check-input"
                                            id={`usertype-${userType.id}`}
                                            value={userType.id}
                                            onChange={handleCheckboxChange}
                                            checked={selectedUserTypes.includes(userType.id)} // Check if selected
                                        />
                                        <label htmlFor={`usertype-${userType.id}`} className="form-check-label">
                                            {userType.usertype}
                                        </label>
                                    </div>
                                ))}

                            </div>
                        </Row>
                    </CardBody>
                    <ModalFooter>
                        <div className="hstack gap-2 justify-content-end">
                            <button type="button" className="btn btn-light" onClick={() => setmodal_list(false)}>Close</button>
                            <button type="submit" className="btn btn-success" id="add-btn">Update product</button>

                        </div>
                    </ModalFooter>
                </form>
            </Modal>
        </React.Fragment>
    );
};

export default ManageProducts;
