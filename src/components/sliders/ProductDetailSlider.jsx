import React, { useRef, useEffect, useState } from 'react';
import Slider from 'react-slick';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { BASE_URL } from '../helpers/config';

const ProductDetailSlider = () => {
    const mainImageRef = useRef(null);
    const navImageRef = useRef(null);
    const [imgNavSettings, setImgNavSettings] = useState({
        slidesToShow: 4,
        slidesToScroll: 1,
        asNavFor: null,
        infinite: false,
        dots: false,
        focusOnSelect: true,
    });

    const imgSliderSettings = {
        slidesToShow: 1,
        slidesToScroll: 1,
        infinite: true,
        arrows: false,
        fade: true,
        asNavFor: navImageRef.current,
    };

    const { SKU } = useParams();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [mainImage, setMainImage] = useState(null);  
    const [zoomImage, setZoomImage] = useState(null);  
    const [isModalOpen, setIsModalOpen] = useState(false);   

    useEffect(() => {
        setImgNavSettings((prevSettings) => ({
            ...prevSettings,
            asNavFor: mainImageRef.current,
        }));
    }, []);

    useEffect(() => {
        const fetchProductDetails = async () => {
            try {
                const response = await axios.get(`${BASE_URL}/products/products/${SKU}/`, {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
                    },
                });
                setProduct(response.data);
                setMainImage(response.data.product_image ? `${BASE_URL}${response.data.product_image}` : null); 
            } catch (error) {
                console.error('Error fetching product details:', error);
                setError('Could not fetch product details. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        fetchProductDetails();
    }, [SKU]);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    const additionalImages = product.additional_images || [];
    const slidesToShow = Math.min(additionalImages.length + 1, 4); // Adjust the number of slides to show

    const openZoomModal = (image) => {
        setZoomImage(image);  
        setIsModalOpen(true);   
    };

    const closeZoomModal = () => {
        setIsModalOpen(false);  
        setZoomImage(null);    
    };

    const handleImageClick = (image) => {
        setMainImage(image);  
    };

    return (
        <>
            {/* Main Image Slider */}
            <Slider className="fz-product-details__img-slider br-01" {...imgSliderSettings} ref={mainImageRef}>
                {mainImage && (
                    <div onClick={() => openZoomModal(mainImage)} title="Click to zoom">
                        <img src={mainImage} alt="Product Image" />
                    </div>
                )}
            </Slider>

            {/* Thumbnail Slider */}
            {additionalImages.length > 0 && (
                <Slider className="fz-product-details__img-nav" {...{ ...imgNavSettings, slidesToShow }} ref={navImageRef}>
                    {additionalImages.map((image, index) => (
                        <div key={index} onClick={() => handleImageClick(`${BASE_URL}${image.image}`)}>
                            <img src={`${BASE_URL}${image.image}`} alt={`Thumbnail Image ${index + 1}`} />
                        </div>
                    ))}
                </Slider>
            )}

            {/* Zoom Modal */}
            {isModalOpen && (
                <div className="zoom-modal" onClick={closeZoomModal}>
                    <div className="zoom-modal-content">
                        <img
                            src={zoomImage}   
                            alt="Zoomed Product"
                            className="zoom-image"
                        />
                    </div>
                </div>
            )}
        </>
    );
};

export default ProductDetailSlider;
