import React from 'react'
import BreadcrumbSection from '../breadcrumb/BreadcrumbSection'
import ProductDetailSection from '../product/ProductDetailSection'
// import RelatedProductSection from '../product/RelatedProductSection'

const ShopDetailsMain = () => {
  return (
    <>
        <BreadcrumbSection title={"products Details"} current={"products Detail"}/>
        <ProductDetailSection/>
        {/* <RelatedProductSection/> */}
    </>
  )
}

export default ShopDetailsMain