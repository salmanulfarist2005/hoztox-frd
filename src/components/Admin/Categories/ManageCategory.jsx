import React, { useState, useEffect } from 'react';
import { Button, Card, CardBody, CardHeader, Col, Container, Row, Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
// import Breadcrumbs from "../../Admin/Breadcrumb";
import { Link } from 'react-router-dom';
import axios from 'axios';
import Breadcrumbs from "../../../components/Admin/Breadcrumb";

import { BASE_URL } from '../../helpers/config';
import useDebounce from '../../../Hooks/useDebounce';
import Pagination from '../../pagination/Pagination';
const ManageCategory = () => {
    const [images, setImages] = useState([]);
    const [formData, setFormData] = useState({ category_name: '', image: "" });
    const [modal_list, setmodal_list] = useState(false);
    const [modal_delete, setmodal_delete] = useState(false);
    const [category, setCategory] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState([]);
    const [totalPages,setTotalPages] = useState(1)
    const [itemCount,setItemCount] = useState(1)
    const [pagetrigger, setPageTrigger] = useState(false);

    const [currentImage, setCurrentImage] = useState(null);
    const [newImage, setNewImage] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedIds, setSelectedIds] = useState([]);
    const [isEditMode, setIsEditMode] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;


     const debouncedValue = useDebounce(searchTerm)

    const clearForm = () => {
        setFormData({ category_name: '', image: "" });
        setNewImage(null);
        setCurrentImage(null);
        setSelectedCategory(null);
    };

    const handleRemoveImage = (index) => {
        setImages((prevImages) => prevImages.filter((_, i) => i !== index));
    };

    const fetchCategory = async () => {
        try {
            const token = localStorage.getItem('authToken');
            const response = await axios.get(`${BASE_URL}/products/categories/`,{
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                                                    params:{
                    is_paginated:true,
                    page:currentPage,
                    limit:10,
                    search:searchTerm
                }

            });
            if(!response.error){
            const categories = response.data.message.results;
            const totalPages = Math.ceil(response.data.message.count / itemsPerPage);
            setCategory(categories);
            setItemCount(response.data.message.count)
            setTotalPages(totalPages)
            }


        } catch (error) {
            console.error('Error fetching category:', error);
            setCategory([]);
        }
    };

    useEffect(() => {
        fetchCategory();
    }, [debouncedValue,pagetrigger]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };
    const createCategory = async (e) => {
        e.preventDefault();

        const formDataToSend = new FormData();
        formDataToSend.append('category_name', formData.category_name);
        if (newImage) {
            formDataToSend.append('image', newImage);
        }

        try {
            const token = localStorage.getItem('authToken');
            await axios.post(`${BASE_URL}/products/categories/`, formDataToSend,{
                headers: {
                     
                    Authorization: `Bearer ${token}`,
                },
            });
            setmodal_list(false);
            fetchCategory();
            alert("Category created successfully!");
        } catch (error) {
            console.error('Error creating category:', error);
        }
    };

    const handleEdit = (cat) => {
        setSelectedCategory(cat);
        setFormData({ category_name: cat.category_name, image: "" });
        setNewImage(null);
        setCurrentImage(cat.image);
        setmodal_list(true);
    };

    const handleDelete = (cat) => {
        setSelectedCategory(cat);
        setmodal_delete(true);
    };

    const updateCategory = async (e) => {
        e.preventDefault();

        const formDataToSend = new FormData();
        formDataToSend.append('category_name', formData.category_name);

        if (newImage) {
            formDataToSend.append('image', newImage);
        }

        try {
            const token = localStorage.getItem('authToken');
            await axios.put(`${BASE_URL}/products/categories/${selectedCategory.id}/`, formDataToSend, {
                headers: {
                   
                    Authorization: `Bearer ${token}`,
                },
            });
            setmodal_list(false);
            fetchCategory();
            alert("Category Updated successfully!");
        } catch (error) {
            console.error('Error updating category:', error);
        }
    };

    const deleteCategory = async (categoryId) => {
        if (window.confirm("Are you sure you want to delete this category?")) {
            try {
                const token = localStorage.getItem('authToken');
                await axios.delete(`${BASE_URL}/products/categories/${categoryId}/`
                ,{ headers: {
                       
                        Authorization: `Bearer ${token}`,
                    },
                }
                );
                setCategory((prev) =>
                    prev.filter((item) => item.id !== categoryId)
                );
                const remainingItems = itemCount - 1;
                setItemCount(remainingItems);
                const newTotalPages = Math.ceil(remainingItems / 10);
                if (currentPage > newTotalPages && newTotalPages > 0) {
                    setCurrentPage(newTotalPages);
                }
                setPageTrigger((e) => !e);
                alert("Category deleted successfully!");
            } catch (error) {
                console.error('Error deleting category:', error);
                alert("There was an error deleting the category.");
            }
        }
    };

    const handleImageChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            const newImageURL = URL.createObjectURL(file);
            setNewImage(file);
            setCurrentImage(newImageURL);
        }
    };

    const renderImagePreviews = () => {
        return (
            <div className="image-previews">
                {newImage ? (
                    <img
                        src={URL.createObjectURL(newImage)}
                        alt="New"
                        style={{ maxWidth: '30%', marginBottom: '10px' }}
                    />
                ) : (
                    currentImage && (
                        <img
                            src={  currentImage}
                            alt="Current"
                            style={{ maxWidth: '30%', marginBottom: '10px' }}
                        />
                    )
                )}
            </div>
        );
    };


    const filteredCategories = Array.isArray(category) ? category.filter(cat =>
        cat.category_name.toLowerCase().includes(searchTerm.toLowerCase())
    ) : [];

    const deleteMultipleCategories = async () => {
        if (selectedIds.length === 0) {
            alert("Please select at least one category to delete.");
            return;
        }
        if (window.confirm("Are you sure you want to delete the selected categories?")) {
            try {
                const token = localStorage.getItem('authToken');
                await Promise.all(selectedIds.map(id => axios.delete(`${BASE_URL}/products/categories/${id}/`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                })));
             
                fetchCategory(); // Refresh the category list
                alert("Selected categories deleted successfully!");
            } catch (error) {
                console.error('Error deleting categories:', error);
                alert("There was an error deleting the selected categories.");
            }
        }
    };

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
        setCurrentPage(1)

    };

    const tog_list = () => {
        setmodal_list(!modal_list);
        setIsEditMode(false);
        clearForm();
    };
    const [isAllSelected, setIsAllSelected] = useState(false);

    const handleSelectAllChange = () => {
        if (isAllSelected) {
            setSelectedIds([]);
        } else {
            setSelectedIds(filteredCategories.map(category => category.id));
        }
        setIsAllSelected(!isAllSelected);
    };

    const handleCheckboxChange = (categoryId) => {
        setSelectedIds(prevSelected =>
            prevSelected.includes(categoryId)
                ? prevSelected.filter(id => id !== categoryId)
                : [...prevSelected, categoryId]
        );

        setIsAllSelected(filteredCategories.length === selectedIds.length + 1);
    };

    const indexOfLastCategory = currentPage * itemsPerPage;
    const indexOfFirstCategory = indexOfLastCategory - itemsPerPage;
    const currentCategories = filteredCategories.slice(indexOfFirstCategory, indexOfLastCategory);


    const handlePageChange = (page) => {
        setCurrentPage(page);
        setPageTrigger(e => !e);
    };



    return (
        <React.Fragment>
            <div className="main-content">
                <div className="page-content ">
                    <Container fluid={true}>
                        <Breadcrumbs title="Product Categories" breadcrumbItem="Manage Categories" />
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
                                                    <thead className="table-light">
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
                                                            <th className="sort" data-sort="customer_email">Image</th>
                                                            <th className="sort" data-sort="customer_name">Category Name</th>
                                                            
                                                            <th className="sort" data-sort="customer_status">Actions</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody className="list form-check-all manage-product">
                                                        {category.map((cat, index) => (
                                                            <tr key={index}>
                                                                <td>
                                                                    <div className="form-check">
                                                                        <input
                                                                            className="form-check-input"
                                                                            type="checkbox"
                                                                            value={cat.id}
                                                                            checked={selectedIds.includes(cat.id)} 
                                                                            onChange={(e) => handleCheckboxChange(cat.id)}
                                                                        />
                                                                    </div>
                                                                </td>
                                                                      <td>
                                                                    <img
                                                                        src={cat.image}
                                                                        alt={cat.category_name}
                                                                        style={{ maxWidth: '80px' }}
                                                                    />
                                                                </td>
                                                                <td>{cat.category_name}</td>
                                                          



                                                                <td>
                                                                    <div className="d-flex gap-2">
                                                                        {/* Edit Icon Button */}
                                                                        <button
                                                                            onClick={() => handleEdit(cat)}
                                                                            title="Edit"
                                                                            style={{
                                                                                background: 'none',
                                                                                border: 'none',
                                                                                padding: '5px',
                                                                                cursor: 'pointer',
                                                                                display: 'inline-block'
                                                                            }}
                                                                        >
                                                                            <i className="ri-pencil-line" style={{ fontSize: '18px', color: '#10b981' }}></i>
                                                                        </button>

                                                                        {/* Delete Icon Button */}
                                                                        <button
                                                                            onClick={() => deleteCategory(cat.id)}
                                                                            title="Delete"
                                                                            data-bs-toggle="modal"
                                                                            data-bs-target="#deleteRecordModal"
                                                                            style={{
                                                                                background: 'none',
                                                                                border: 'none',
                                                                                padding: '5px',
                                                                                cursor: 'pointer',
                                                                                display: 'inline-block'
                                                                            }}
                                                                        >
                                                                            <i className="ri-delete-bin-line" style={{ fontSize: '18px', color: '#ef4444' }}></i>
                                                                        </button>
                                                                    </div>
                                                                </td>

                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>



                                            {/* <div className="d-flex justify-content-end">
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
                                            </div> */}
                                                   <div className="d-flex justify-content-end mt-3">
                                                    <Pagination
                                                        currentPage={currentPage}
                                                        totalPages={totalPages}
                                                        totalItems={itemCount}
                                                        onPageChange={handlePageChange}
                                                        showTotal={true}
                                                    />
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
                toggle={() => setmodal_list(!modal_list)}
                centered
                style={{ maxWidth: '900px', width: '90%' }}
            >
                <ModalHeader className="bg-light p-3" toggle={() => setmodal_list(false)}> Edit Category </ModalHeader>
                <form onSubmit={updateCategory}>
                    <CardBody style={{ padding: '20px' }}>
                        <Row className="mb-3">
                            <label htmlFor="category_name" className="col-md-2 col-form-label">Category Name</label>
                            <div className="col-md-10">
                                <input
                                    className="form-control"
                                    type="text"
                                    name="category_name"
                                    placeholder="Category Name"
                                    value={formData.category_name || ''}
                                    onChange={handleInputChange}
                                />
                            </div>
                        </Row>
                        <Row className="mb-3">
                            <label htmlFor="example-image-input" className="col-md-2 col-form-label">Category Logo /Image</label>
                            <div className="col-md-10">
                                <input
                                    className="form-control"
                                    type="file"
                                    id="example-image-input"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                />
                                {renderImagePreviews()}
                            </div>
                        </Row>
                    </CardBody>
                    <ModalFooter>
                        <div className="hstack gap-2 justify-content-end">
                            {/* <button type="button" className="btn btn-light" onClick={() => setmodal_list(false)}>Close</button> */}
                            <Button color='primary' type="submit" className="btn btn-success">Update</Button>
                        </div>
                    </ModalFooter>
                </form>
            </Modal>


        </React.Fragment>
    );
};

export default ManageCategory;
