import { useEffect, useState } from 'react';
import ProductDetailAction from './ProductDetailAction';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { BASE_URL } from '../helpers/config';

const ProductDetailTextSection = () => {
    const { SKU } = useParams();  
    const [product, setProduct] = useState(null);
    const [activeTab, setActiveTab] = useState('description');

    
    useEffect(() => {
        const fetchProductDetails = async () => {
            try {
  
                const response = await axios.get(`${BASE_URL}/products/products/${SKU}/`, {
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

    if (!product) {
        return <div>Loading...</div>;  
    }

    return (
        <div className="fz-product-details__txt">
            <h2 className="fz-product-details__title">{product.product_name}</h2>      

            <div className="fz-product-details__infos">
                <ul>
                    <li><span className="info-property"> Category </span>: <span className="info-value">{product.category_name}</span></li>
                    <li><span className="info-property"> SKU </span>: <span className="info-value">{product.SKU}</span></li>                
                    <li><span className="info-property"> Product Color </span>: <span className="info-value">{product.color}</span></li>
                    <li><span className="info-property"> Gross Weight </span>: <span className="info-value">{product.gross_weight} gm</span></li>
                    <li><span className="info-property"> Diamond </span>: <span className="info-value">{product.diamond_weight} gm</span></li>
                    <li><span className="info-property"> Color Stone </span>: <span className="info-value">{product.colour_stones} gm</span></li>
                    <li><span className="info-property"> Net Weight </span>: <span className="info-value">{product.net_weight} gm</span></li>
                </ul>
            </div>

            <p className="fz-product-details__short-descr">
                {product.description}
            </p>
            
            <ProductDetailAction />
        </div>
    );
};

export default ProductDetailTextSection;
