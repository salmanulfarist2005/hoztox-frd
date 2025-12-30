import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import CustomProductDetailSlider from '../sliders/CustomProductDetailSlider';
import ProductDetailTextSection from './ProductDetailTextSection';
import { BASE_URL } from '../helpers/config';

const CustomProductDetailSection = () => {
    const { SKU } = useParams();  
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    useEffect(() => {
        const fetchProductDetails = async () => {
            try {
         
                const response = await axios.get(`${BASE_URL}/products/customized-products/${SKU}/`,{
                    headers: {
                    'Authorization': `Bearer ${localStorage.getItem('authToken')}`
                }
                });
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

    if (loading) {
        return <div>Loading...</div>; 
    }

    if (error) {
        return <div>{error}</div>; 
    }

    return (
        <section className="fz-product-details bg-gry-1">
            <div className="container">
                <div className="row align-items-start justify-content-center">
                    <div className="col-lg-5 col-md-6 col-12 col-xxs-12">
                        <CustomProductDetailSlider product={product} />
                    </div>
                    <div className="col-lg-7 col-md-6">
                        <ProductDetailTextSection product={product} />
                    </div>
                </div>
            </div>
        </section>
    );
};

export default CustomProductDetailSection;
