import React from 'react'
import BreadcrumbSection from '../breadcrumb/BreadcrumbSection'
 
import CustomShopAreaSection from '../shop/CustomShopAreaSection'

const CustomShopMain = () => {
  return (
    <>
        <BreadcrumbSection title={"Custom Products "} current={"Custom Products"}/>
        <CustomShopAreaSection />
    </>
  )
}

export default CustomShopMain