import React from "react";
import Layout from "../../components/layout/Layout";
import BreadcrumbSection from '../../components/breadcrumb/BreadcrumbSection'
import CustomeFull from "../../components/offer/CustomefullDetail";

const CustomeFullPage = () => {
  return (
    <Layout>
       <BreadcrumbSection title={"Custom Details"} current={"Custom Details"}/>
      <CustomeFull/>
    </Layout>
  );
};

export default CustomeFullPage;
