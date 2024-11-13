import React, { useContext } from 'react'
import { FarzaaContext } from '../../context/FarzaaContext'
import { Link } from 'react-router-dom'

const RelatedProductSection = () => {
    const {
        addToJeweleryWishlist,
        addToJeweleryCart,
        jeweleryArray
    } = useContext(FarzaaContext)
  return (
    <section className="related-product-section">
        <div className="container">
            <h2 className="related-product__title">Related Products</h2>
            <div className="row gy-4 gx-3 justify-content-center">
        {jeweleryArray.map((item) => (
            <div className="col-xl-3 col-md-4 col-6 col-xxs-12" key={item.id}>
                <div className="fz-2-single-product">
                    <div className="fz-2-single-product-img">
                    <Link to="/shop"> 
                        <img src={item.imgSrc} alt={item.name}/>
                        </Link>
                        <div className="fz-2-single-product-actions">
                            <button 
                            className="fz-add-to-cart-btn"
                            onClick={() => addToJeweleryCart(item.id)}
                            >Add to Cart</button>
                            <button 
                            className="fz-add-to-wishlist"
                            onClick={() => addToJeweleryWishlist(item.id)}
                            >{item.isInWishlist? (<i className="fa-solid fa-heart"></i>):(<i className="fa-regular fa-heart"></i>)}</button>
                        </div>
                    </div>
                    <div className="fz-2-single-product-txt">
                    <h5 className="fz-2-single-product-title"><Link to="#">SKU</Link></h5>
                        <span className="fz-2-single-product-category"><Link to="#">{item.category}</Link></span>
                        <h5 className="fz-2-single-product-title"><Link to="#">{item.name}</Link></h5>
                        
                    </div>
                </div>
            </div> 
        ))}
       
    </div>
          
        </div>
    </section>
  )
}

export default RelatedProductSection