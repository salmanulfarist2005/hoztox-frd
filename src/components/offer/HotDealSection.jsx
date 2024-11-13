import React, { useContext,useState,useEffect } from 'react'
import { FarzaaContext } from '../../context/FarzaaContext'
import { Link } from 'react-router-dom'
import { BASE_URL } from '../helpers/config';
import axios from 'axios';

const HotDealSection = () => {
    const {addToJeweleryWishlist,addToJeweleryCart,jeweleryArray} = useContext(FarzaaContext)
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
                    <div className="fz-2-single-product">
                        <div className="fz-2-single-product-img">
                        <Link to={`/customized-products/${product.SKU}`}>
                                <img src={BASE_URL + product.product_image} alt={product.product_name} />
                            </Link>
                            <div className='color_text'>
                                <h5 className="fz-2-single-product-title">
                                <Link to={`/customized-products/${product.SKU}`}>{product.SKU}</Link>
                                </h5>
                            </div>
                            {/* <div className="fz-2-single-product-actions">
                                <button
                                    className="fz-add-to-cart-btn"
                                    onClick={() => addToJeweleryCart(product.id)}
                                >
                                    Add to cart
                                </button>


                                <div className="btnactions">
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

                                </div>


                            </div>   */}

                        </div>
                        <div className="fz-2-single-product-txt">
                            <div className=''>

                                <span className="fz-2-single-product-category">   {product.category_name} </span>

                                <span className="color_span">&nbsp;&nbsp;( {product.color} )</span>
                            </div>
                            <h5 className="fz-2-single-product-title mb-555">
                            <Link to={`/customized-products/${product.SKU}`}>{product.product_name}</Link>
                            </h5>
                         

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