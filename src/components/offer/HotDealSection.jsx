import React, { useContext, useState, useEffect } from 'react'
import { FarzaaContext } from '../../context/FarzaaContext'
import { Link } from 'react-router-dom'
import { BASE_URL } from '../helpers/config';
import axios from 'axios';

const HotDealSection = () => {
    const { addToJeweleryWishlist, addToJeweleryCart, jeweleryArray } = useContext(FarzaaContext)
    const [products, setProducts] = useState([]);





    const fetchProducts = async () => {
        try {
            // const token = localStorage.getItem('authToken');
            const response = await axios.get(`${BASE_URL}/products/customized_products_list/`, {
                // headers: {
                //     Authorization: `Bearer ${token}`,
                // },
            });

            const data = response.data;
            setProducts(data);
            console.log("products", data);
        } catch (error) {
            console.error('Error fetching products:', error);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);







    const defaultQuantity = 1;
    const [quantity, setQuantity] = useState(defaultQuantity);

    const handleQuantityChange = (newQuantity) => {
        if (newQuantity >= 1) {
            setQuantity(newQuantity);
        }
    };
    return (
        <section className="fz-2-hot-deal-section">
            <div className="container">
                <div className="fz-2-section-heading">
                    <div className="row gy-4 align-items-center">
                        <div className="col-md-12">
                            <h2 className="fz-section-title">Customized Products</h2>
                        </div>

                    </div>
                </div>

                <div className="row gy-4 gx-3 justify-content-center">
                    {products.slice(0, 8).map((product) => (
                        <div className="col-xl-3 col-md-4 col-6 col-xxs-6" key={product.id}>
                            <div className="fz-2-single-product br-12">
                                <div className="fz-2-single-product-img br-0">
                                    <Link to={`/customized-products/${product.SKU}`}>
                                        <img className='br-0' src={BASE_URL + product.product_image} alt={product.product_name} />
                                    </Link>
                                    <div className='color_text'>
                                        <h5 className="fz-2-single-product-title">
                                            <Link to={`/customized-products/${product.SKU}`}>{product.SKU}</Link>
                                        </h5>
                                    </div>

                                </div>
                                <div className="fz-2-single-product-txt br-0">
                                    <h5 className="fz-2-single-product-title ">
                                        <Link to={`/customized-products/${product.SKU}`}>{product.product_name}</Link>
                                    </h5>
                                    <div className=''>

                                        <span className="fz-2-single-product-category mb-555">   {product.category_name} </span>


                                    </div>



                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div class="text-center">
                    <div className="fz-def_btn_wrapper mt-10">

                        <Link to="/custom-full" className="fz-def-btn">
                            <span></span>
                            Custom Your Design
                            <i className="fa-light fa-arrow-up-right ml-10"></i>
                        </Link>
                    </div>
                </div>


            </div>
        </section>
    )
}

export default HotDealSection