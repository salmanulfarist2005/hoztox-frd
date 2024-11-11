import React, { useRef, useEffect, useState } from 'react';
import Slider from 'react-slick';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { BASE_URL } from '../helpers/config';

const CustomProductDetailSlider = () => {
    const mainImageRef = useRef(null);
    const navImageRef = useRef(null);  
    const [imgNavSettings, setImgNavSettings] = useState({
        slidesToShow: 4,
        slidesToScroll: 1,
        asNavFor: null,
        infinite: true,
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

    useEffect(() => {
        setImgNavSettings((prevSettings) => ({
            ...prevSettings,
            asNavFor: navImageRef.current,
        }));
    }, []);

    const { SKU } = useParams();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProductDetails = async () => {
            try {
         
                const response = await axios.get(`${BASE_URL}/products/customized-products/${SKU}/`);
                setProduct(response.data);
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

    // Destructure main image and additional images
    const mainImage = product.product_image ? `${BASE_URL}${product.product_image}` : null;
    const additionalImages = product.additional_images || [];

    return (
        <>
            <Slider className="fz-product-details__img-slider br-01" {...imgSliderSettings} ref={mainImageRef}>
                {mainImage && (
                    <div>
                        <img src={BASE_URL+ mainImage} alt="Product Image" />
                    </div>
                )}
                {additionalImages.map((image, index) => (
                    <div key={index}>
                        <img src={`${BASE_URL}${image.image}`} alt={`Product Additional Image ${index + 1}`} />
                    </div>
                ))}
            </Slider>

            <Slider
                className="fz-product-details__img-nav"
                {...imgNavSettings}
                ref={navImageRef}  
            >
                {mainImage && (
                    <div onClick={() => mainImageRef.current.slickGoTo(0)}>
                        <img src={BASE_URL + mainImage} alt="Thumbnail Image" />
                    </div>
                )}
                {additionalImages.map((image, index) => (
                    <div key={index} onClick={() => mainImageRef.current.slickGoTo(index + 1)}>
                        <img src={`${BASE_URL}${image.image}`} alt={`Thumbnail Image ${index + 1}`} />
                    </div>
                ))}
            </Slider>
        </>
    );
};

export default CustomProductDetailSlider;
