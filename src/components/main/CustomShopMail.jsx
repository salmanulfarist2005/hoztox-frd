import React from 'react'
import BreadcrumbSection from '../breadcrumb/BreadcrumbSection'
 
import CustomShopAreaSection from '../shop/CustomShopAreaSection'

const CustomShopMain = () => {
  return (
    <>
        <BreadcrumbSection title={"Shop Page"} current={"Custom Products"}/>
        <CustomShopAreaSection />
    </>
  )
}

export default CustomShopMain