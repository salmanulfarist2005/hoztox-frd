import React from 'react'
import SearchFilter from './SearchFilter'
import CustomProductCategoryList from './CustomProductCategoryList'
// import ProductPriceFilter from './ProductPriceFilter'
 
import CustomProductViewFilter from './CustomProductViewFilter'
 
import ProductPagination from './ProductPagination'

const CustomShopAreaSection = () => {
  return (
    <div className='bg-gry-1'>

    <div className="shop-area">
        <div className="container">
            <div className="row gy-5 justify-content-center">
                <div className="col-xl-3 col-lg-4 col-md-6 col-sm-8 col-9 col-xxs-12 order-1 order-lg-0">
                    <div className="fz-sidebar">
                        <SearchFilter/>

                        <CustomProductCategoryList/>

                        {/* <ProductPriceFilter/> */}
 
                    </div>
                </div>

                <div className="col-xl-9 col-lg-8 order-0 order-lg-1">
                    <CustomProductViewFilter/>

                  

                    <ProductPagination/>
                </div>
            </div>
        </div>
    </div>
    </div>
  )
}

export default CustomShopAreaSection