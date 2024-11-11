import React from "react";
import Layout from "../../components/layout/Layout";
// import BreadcrumbSection from '../../components/breadcrumb/BreadcrumbSection'
import CustomeDetail from "../../components/offer/Customedetail";   

const CustomePage = () => {
  return (
    <Layout>
       {/* <BreadcrumbSection title={"Custom Products"} current={"Custom Products"}/> */}
      <CustomeDetail/>
    </Layout>
  );
};

export default CustomePage;
