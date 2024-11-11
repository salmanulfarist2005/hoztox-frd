import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { BASE_URL } from '../helpers/config';
import { toast } from 'react-toastify';
import './CustomeDetail.css';
import Slider from 'react-slick';

function CustomeDetail() {
    const { id, SKU } = useParams();

    const [product, setProduct] = useState(null);
    const [additionalImages, setAdditionalImages] = useState([]);
    const [colors, setColors] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const defaultQuantity = 1;
    const [quantity, setQuantity] = useState(defaultQuantity);
    const [formData, setFormData] = useState({
        size: '',
        gram: '',
        cent: '',
        color: '',
        description: '',
    });
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    const imgSliderSettings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
    };

    const imgNavSettings = {
        dots: false,
        infinite: true,
        speed: 500,
        slidesToShow: 3,
        slidesToScroll: 1,
        focusOnSelect: true,
    };

    const mainImageRef = useRef(null);
    const navImageRef = useRef(null);

    // Fetch product details using SKU for display
    const fetchProductDetails = async () => {
        try {
            const response = await axios.get(`${BASE_URL}/products/customized-products/${SKU}/`);
            setProduct(response.data);
            setAdditionalImages(response.data.additional_images);
            console.log("custom response.data", response.data);
        } catch (error) {
            console.error('Error fetching product details:', error);
            setError('Could not fetch product details. Please try again later.');
        } finally {
            setIsLoading(false);
        }
    };

    // Fetch colors for the product options
    const fetchColors = async () => {
        try {
            const response = await axios.get(`${BASE_URL}/products/colors_list/`);
            console.log("Response data:", response.data);

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

    // Handle form data changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };
    const [showConfirmation, setShowConfirmation] = useState(false);
    // Handle form submission to place an order
    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('authToken');
        console.error("ordercreation:", formData);
        const orderData = {
            product: product.id,
            size: formData.size,
            gram: formData.gram,
            cent: formData.cent,
            color: formData.color,
            description: formData.description,
            quantity: quantity,
        };

        try {
            const response = await axios.post(`${BASE_URL}/products/customized-orders/`, orderData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            toast.success('Order placed successfully');
            setShowConfirmation(true);
            setTimeout(() => {
                setShowConfirmation(false);
                navigate('/checkout');
            }, 3000);
            setFormData({
                size: '',
                gram: '',
                cent: '',
                color: '',
                description: '',
            });
            setQuantity(defaultQuantity);

        } catch (error) {
            console.error("Error placing order:", error);
            toast.error('Error placing order');
        }
    };

    useEffect(() => {
        fetchProductDetails();
        fetchColors();
    }, [SKU, id]);

    const handleQuantityChange = (newQuantity) => {
        if (newQuantity >= 1) {
            setQuantity(newQuantity);
        }
    };

    // Handle image click for slider navigation
    const handleImageClick = (index) => {
        setCurrentImageIndex(index);
    };

    const mainImage = product?.product_image ? product.product_image : null;

    return (
        <section className="fz-product-details bg-gry-1">
            <div className="container">
                {isLoading ? (
                    <p>Loading...</p>
                ) : product ? (
                    <>
                        <div className="row align-items-start justify-content-center">
                            <div className="col-lg-5 col-md-6 col-12 col-xxs-12">
                                <Slider className="fz-product-details__img-slider br-01" {...imgSliderSettings} ref={mainImageRef}>
                                    {mainImage && (
                                        <div>
                                            <img src={BASE_URL + mainImage} alt="Product Image" />
                                        </div>
                                    )}
                                    {additionalImages.map((image, index) => (
                                        <div key={index}>
                                            <img src={BASE_URL + image.image} alt={`Product Additional Image ${index + 1}`} />
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
                                            <img src={BASE_URL + image.image} alt={`Thumbnail Image ${index + 1}`} />
                                        </div>
                                    ))}
                                </Slider>
                            </div>
                            <div className="col-lg-7 col-md-6">
                                <h2>{product.product_name}</h2>

                                <p>SKU: {product.SKU}</p>
                                <p>Category: {product.category_name}</p>
                                <div className="fz-product-details__quantity cart-product__quantity">
                                    <button className="minus-btn cart-product__minus" onClick={() => handleQuantityChange(quantity - 1)}>
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
                                    <button className="plus-btn cart-product__plus" onClick={() => handleQuantityChange(quantity + 1)}>
                                        <i className="fa-light fa-plus"></i>
                                    </button>
                                </div>
                                <form className="customization-form" onSubmit={handleSubmit}>
                                    <label>
                                        Size:
                                        <input
                                            type="text"
                                            name="size"
                                            value={formData.size}
                                            onChange={handleChange}
                                            required
                                        />
                                    </label>
                                    <label>
                                        Gram:
                                        <input
                                            type="number"
                                            name="gram"
                                            value={formData.gram}
                                            onChange={handleChange}
                                            required
                                        />
                                    </label>
                                    <label>
                                        Cent:
                                        <input
                                            type="number"
                                            name="cent"
                                            value={formData.cent}
                                            onChange={handleChange}
                                            required
                                        />
                                    </label>

                                    <label htmlFor="color" className=" ">Color</label>
                                    <div className=" ">
                                        <select className="form-control" value={formData.color} name="color" onChange={handleChange} required>
                                            <option value="" disabled>Select a Color</option>
                                            {colors.map((color) => (
                                                <option key={color.id} value={color.id}>{color.color}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <label>
                                        Description:
                                        <textarea
                                            name="description"
                                            value={formData.description}
                                            onChange={handleChange}
                                            required
                                        />
                                    </label>
                                    <button type="submit">Place Order</button>
                                </form>
                            </div>
                        </div>
                    </>
                ) : (
                    <p>Product not found.</p>
                )}
                 {showConfirmation && (
                <div className="confirmation-popup">
                    <div className="confirmation-content">
                        <span className="checkmark">&#10003;</span>  
                        <p>Order placed successfully!</p>
                    </div>
                </div>
            )}
            </div>
        </section>
    );
}

export default CustomeDetail;


