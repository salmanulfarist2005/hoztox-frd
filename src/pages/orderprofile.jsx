import React from 'react'
import BreadcrumbSection from '../components/breadcrumb/BreadcrumbSection'
import Order from '../components/OderSection/Order'
import Layout from "../components/layout/Layout";
 

const Orderprofile = () => {
  return (
    <>
     <Layout>
        <BreadcrumbSection title={"My Orders"} current={"My Orders"}/>
        <Order/>
        </Layout>
    </>
  )
}

export default Orderprofile