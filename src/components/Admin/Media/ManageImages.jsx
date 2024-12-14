import React, { useState, useEffect } from 'react';
import { Button, Card, CardBody, Col, Container, Row } from 'reactstrap';
import Breadcrumbs from "../../../components/Admin/Breadcrumb";
import axios from 'axios';
import { BASE_URL } from '../../helpers/config';

const ManageImage = () => {
    const [mediaImages, setMediaImages] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedIds, setSelectedIds] = useState([]);
    const [isAllSelected, setIsAllSelected] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    const fetchMediaImages = async () => {
        try {
            const response = await axios.get(`${BASE_URL}/products/media/images/`);
            setMediaImages(response.data);
        } catch (error) {
            console.error('Error fetching media images:', error);
        }
    };

    useEffect(() => {
        fetchMediaImages();
    }, []);

    const filteredImages = mediaImages && mediaImages.length > 0 ? mediaImages.filter(image =>
        image.image.toLowerCase().includes(searchTerm.toLowerCase())
    ) : [];

    const totalPages = Math.ceil(filteredImages.length / itemsPerPage);
    const indexOfLastImage = currentPage * itemsPerPage;
    const indexOfFirstImage = indexOfLastImage - itemsPerPage;
    const currentImages = filteredImages.slice(indexOfFirstImage, indexOfLastImage);

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const handleSelectAllChange = () => {
        if (isAllSelected) {
            setSelectedIds([]);
        } else {
            setSelectedIds(filteredImages.map(image => image.id));
        }
        setIsAllSelected(!isAllSelected);
    };

    const handleCheckboxChange = (imageId) => {
        setSelectedIds(prevSelected =>
            prevSelected.includes(imageId)
                ? prevSelected.filter(id => id !== imageId)
                : [...prevSelected, imageId]
        );
        setIsAllSelected(filteredImages.length === selectedIds.length + 1);
    };

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const deleteMultipleCategories = async () => {
        if (selectedIds.length === 0) {
            alert("Please select at least one category to delete.");
            return;
        }
        if (window.confirm("Are you sure you want to delete the selected images?")) {
            try {
                await Promise.all(selectedIds.map(id =>
                    axios.delete(`${BASE_URL}/products/media/images/${id}/`)
                ));
                fetchMediaImages();
                alert("Selected images deleted successfully!");
                setSelectedIds([]);
            } catch (error) {
                console.error('Error deleting images:', error);
                alert("There was an error deleting the selected images.");
            }
        }
    };

    const deleteImage = async (imageId) => {
        if (window.confirm("Are you sure you want to delete this image?")) {
            try {
                await axios.delete(`${BASE_URL}/products/media/images/${imageId}/`);
                fetchMediaImages();
                alert("Image deleted successfully!");
            } catch (error) {
                console.error('Error deleting image:', error);
                alert("There was an error deleting the image.");
            }
        }
    };

    const getFileName = (imageUrl) => {
        return imageUrl.split('/').pop();
    };

    return (
        <React.Fragment>
            <div className="main-content">
                <div className="page-content">
                    <Container fluid>
                        <Breadcrumbs title="Media Images" breadcrumbItem="Manage Media Images" />
                        <Row>
                            <Col lg={12}>
                                <Card>
                                    <CardBody>
                                        <div id="mediaList">
                                            <Row className="g-4 mb-3">
                                                <Col className="col-sm-auto">
                                                    <div className="d-flex gap-1">
                                                        <Button color="soft-danger" onClick={deleteMultipleCategories}>
                                                            <i className="ri-delete-bin-2-line"></i>
                                                        </Button>
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
                                                <table className="table align-middle table-nowrap" id="mediaTable">
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
                                                            <th className="sort" data-sort="image_name">Image</th>
                                                            <th className="sort" data-sort="file_name">File Name</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {currentImages.map((image, index) => (
                                                            <tr key={index}>
                                                                <td>
                                                                    <div className="form-check">
                                                                        <input
                                                                            className="form-check-input"
                                                                            type="checkbox"
                                                                            value={image.id}
                                                                            checked={selectedIds.includes(image.id)}
                                                                            onChange={() => handleCheckboxChange(image.id)}
                                                                        />
                                                                    </div>
                                                                </td>
                                                                <td>
                                                                    <img
                                                                        src={BASE_URL + image.image}
                                                                        alt={`Media ${image.id}`}
                                                                        style={{ maxWidth: '100px' }}
                                                                    />
                                                                </td>
                                                                <td>
                                                                    {getFileName(image.image)}
                                                                </td>
                                                                <td>
                                                                    <div className="d-flex gap-2">
                                                                        <div className="remove">
                                                                            <button
                                                                                onClick={() => deleteImage(image.id)}
                                                                                className="btn btn-sm btn-danger remove-item-btn"
                                                                            >
                                                                                Remove
                                                                            </button>
                                                                        </div>
                                                                    </div>
                                                                </td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                            <nav className="pagination-container">
                                                <ul className="pagination">
                                                    <li>
                                                        <button
                                                            disabled={currentPage === 1}
                                                            onClick={() => handlePageChange(currentPage - 1)}
                                                            className={`pagination-btn ${currentPage === 1 ? 'disabled' : ''}`}
                                                        >
                                                            <i className="fa fa-angle-double-left"></i> 
                                                        </button>
                                                    </li>

                                                    {Array.from({ length: Math.min(5, totalPages - Math.floor((currentPage - 1) / 5) * 5) }, (_, index) => {
                                                        const page = Math.floor((currentPage - 1) / 5) * 5 + index + 1;
                                                        return (
                                                            <li key={page}>
                                                                <button
                                                                    className={`pagination-btn ${currentPage === page ? 'active' : ''}`}
                                                                    onClick={() => handlePageChange(page)}
                                                                >
                                                                    {page}
                                                                </button>
                                                            </li>
                                                        );
                                                    })}

                                                    <li>
                                                        <button
                                                            disabled={currentPage === totalPages}
                                                            onClick={() => handlePageChange(currentPage + 1)}
                                                            className={`pagination-btn ${currentPage === totalPages ? 'disabled' : ''}`}
                                                        >
                                                            <i className="fa fa-angle-double-right"></i>
                                                        </button>
                                                    </li>
                                                </ul>
                                            </nav>



                                        </div>
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

export default ManageImage;
