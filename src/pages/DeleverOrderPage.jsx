import React from 'react'
import BreadcrumbSection from '../components/breadcrumb/BreadcrumbSection'
import DeleiverOrder from '../components/OderSection/Deleveredorders'
import Layout from "../components/layout/Layout";
 
 

const DeliverOrderprofile = () => {
  return (
    <>
     <Layout>
        <BreadcrumbSection title={"My Orders"} current={"My Orders"}/>
        <DeleiverOrder/>
        </Layout>
    </>
  )
}

export default DeliverOrderprofile