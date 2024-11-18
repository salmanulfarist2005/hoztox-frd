import React from 'react'
import SearchFilter from './SearchFilter'
import ProductCategoryList from './ProductCategoryList'
import ProductViewFilter from './ProductViewFilter'

const ShopAreaSection = () => {
  return (
    <div className='bg-gry-1'>
      <div className="shop-area">
        <div className="container">
          <div className="row gy-5 justify-content-center">
         
            <div className="col-xl-3 col-lg-4 col-md-6 col-sm-8 col-12 order-1 order-lg-0">
              <div className="fz-sidebar">
                <SearchFilter />
                <ProductCategoryList />
              </div>
            </div>

          
            <div className="col-xl-9 col-lg-8 col-12 order-2 order-lg-1">
              <ProductViewFilter />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ShopAreaSection
