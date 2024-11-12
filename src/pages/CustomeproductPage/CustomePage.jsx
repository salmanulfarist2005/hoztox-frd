import React from "react";
import Layout from "../../components/layout/Layout";
import BreadcrumbSection from '../../components/breadcrumb/BreadcrumbSection'
import CustomeDetail from "../../components/offer/Customedetail";   


const CustomePage = () => {
  return (
    <Layout>
      <div></div>
    <BreadcrumbSection title={"Product Details"} current={"Product Details"}/>
    <CustomeDetail/>
  </Layout>
  
  );
};

export default CustomePage;
